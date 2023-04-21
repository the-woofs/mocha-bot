// server.js
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;

      if (pathname === "/a") {
        await app.render(req, res, "/a", query);
      } else if (pathname === "/b") {
        await app.render(req, res, "/b", query);
      } else {
        await handle(req, res, parsedUrl);
      }
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  })
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      // This code is the entry point for the bot, and it logs in the bot to Discord.
      // It also sets up the event handler to log when the bot is ready.

      // Require the necessary discord.js classes
      const { Client, Events, GatewayIntentBits } = require("discord.js");

      // Get the token from the environment variables
      const token = process.env.TOKEN;

      // Create a new client instance
      const client = new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.GuildMessageReactions,
          GatewayIntentBits.MessageContent,
        ],
      });

      // When the client is ready, run this code (only once)
      // We use 'c' for the event parameter to keep it separate from the already defined 'client'
      client.once(Events.ClientReady, (c) => {
        console.log(`Ready! Logged in as ${c.user?.tag}`);
        // make the bot send a message to channel 1095112658996433012 saying "I'm woof"
        c.channels.cache.get("1095112658996433012").send("I'm alive!");
      });

      // listen to messages
      client.on(Events.MessageCreate, async (message) => {
        // ignore messages from bots
        if (message.author.bot) return;
        let res = await fetch(
          `http://api.brainshop.ai/get?bid=153868&key=rcKonOgrUFmn5usX&uid=1&msg=${encodeURIComponent(
            message.content
          )}`
        );

        const reply = await res.json();
        if (!reply.cnt) {
          return;
        }
        message.reply(reply.cnt);
      });

      // Log in to Discord with your client's token
      client.login(token).catch(console.error);

      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
