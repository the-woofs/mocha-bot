const next = require('next')
const http = require('http')
  
const app = next({dev: process.env.NODE_ENV !== 'production'})
  
app.prepare().then(() => {
 const server = http.createServer((req, res) => {
   // Handle API routes
   if (req.url.startsWith('/api')) {
     // Your API handling logic here
   } else {
     // Handle Next.js routes
     return app.getRequestHandler()(req, res)
   }
 })
 server.listen(3000, (err) => {
   if (err) throw err
    
   // This code is the entry point for the bot, and it logs in the bot to Discord.
// It also sets up the event handler to log when the bot is ready.

// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');

// Get the token from the environment variables
const token = process.env.TOKEN;

	// Create a new client instance
	const client = new Client({ intents: [GatewayIntentBits.Guilds] });

	// When the client is ready, run this code (only once)
	// We use 'c' for the event parameter to keep it separate from the already defined 'client'
	client.once(Events.ClientReady, c => {
		console.log(`Ready! Logged in as ${c.user?.tag}`);
	});

	// Log in to Discord with your client's token
	client.login(token).catch(console.error);

 })
})