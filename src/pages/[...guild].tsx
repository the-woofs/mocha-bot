"use client";
import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import Header from "./components/header";
import Button from "./components/button";
import { GuildSidebar, GuildHeader } from "./components/guilds";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Card from "./components/card";
import { Suspense } from "react";

const Home: NextPage = () => {
  const { data: session } = useSession();

  if (session) {
    return <Main session={session} />;
  }

  return (
    <main className='min-h-screen bg-hero dark:bg-hero-dark flex flex-col justify-center items-center'>
      <Button icon={<></>} onClick={() => signIn("discord")}>
        Sign in with Discord
      </Button>
    </main>
  );
};

function Main({ session }: { session: any }) {
  const { user } = session;

  const router = useRouter();
  // get guild, path is /guild/[...guild]
  const guild = router.query.guild;

  const [discrim, setDiscrim] = useState("0000");

  useEffect(() => {
    if (user) {
      console.log(user);
      console.log(user.id);
      const data = fetch(`/api/bot/users/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setDiscrim(data.result.discriminator);
        });
    }
  }, [user]);

  const [suggestionsChannelId, setSuggestionsChannelId] = useState("1095281838697762897");

  const getMessages = async () => {
    const res = await fetch(
      `/api/bot/channels/${suggestionsChannelId}/messages`
    );
    const data = await res.json();
    return data;
  };

  const getChannels = async () => {
    const res = await fetch(`/api/bot/guilds/${guild}/channels`);
    const data = await res.json();
    console.log(data)
    return data;
  };

  const [suggestions, setSuggestions] = useState([] as any);
  const [channels, setChannels] = useState([] as any);

  useEffect(() => {

    getChannels().then((data) => {
      setChannels(data.result);
    });


  }, []);


  useEffect(() => {
    // get suggestionsChannel from localstorage, if not present use the first channel
    if (localStorage.getItem("suggestionsChannelId")) {
      setSuggestionsChannelId(localStorage.getItem("suggestionsChannelId") as string);
    } else if (channels && channels[0]) {
      setSuggestionsChannelId(channels[0].id as string);
    }
  }, [channels]);

  useEffect(() => {
    if (suggestionsChannelId) {
      localStorage.setItem("suggestionsChannelId", suggestionsChannelId);
    }

    getMessages().then((data) => {
      setSuggestions(data.result);
    });
  }, [suggestionsChannelId]);


  useEffect(() => {
    console.log(suggestions);
  }, [suggestions]);

  return (
    <main className='bg-hero dark:bg-hero-dark text-gray-200 overflow-hidden'>
      <div className='min-h-screen flex flex-col font-medium grow justify-start'>
        <Header
          className='bg-graph-paper dark:bg-graph-paper-dark
        border-b-2 border-[#e2e8f0] dark:border-[#1e293b]
        '
          avatar={user?.image}
          username={user?.name}
          discrim={discrim}
        />
        <GuildHeader userId={user?.id} className='shown-mobile' />
        <div className='h-[calc(100vh-100px)] flex flex-row'>
          <GuildSidebar
            userId={user?.id}
            className='hidden-mobile max-h-[calc(100vh-100px)] overflow-y-auto]'
          />
          <div className='grow p-4 flex flex-col max-h-[calc(100vh-100px)] overflow-y-auto'>
            <div className='flex flex-row justify-between'>
              <h1 className='text-4xl font-bold'>Suggestions</h1>
              <span className='text-xl font-normal text-gray-500 dark:text-gray-300'>
                {suggestions.length} suggestions in {
                  // dropdown to select channel
                  <select
                    className='bg-hero text-gray-900 text-sm p-2.5
                    max-w-[200px]
                    dark:bg-hero-dark dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                    '
                    onChange={(e) => {
                      setSuggestionsChannelId(e.target.value);
                      getMessages().then((data) => {
                        setSuggestions(data.result);
                      });
                    }
                    }
                  >
                    {channels &&
                      channels.map((channel: any) => {
                        return <option
                          selected={channel.id === suggestionsChannelId}
                          value={channel.id}
                          className="bg-transparent text-gray-500 dark:text-gray-300"
                        >{channel.name}</option>
                      })
                    }
                  </select>
                }
              </span>
            </div>
            {suggestions && suggestions.map((suggestion: any) => {
              return <Card userId={suggestion.author.id} message={suggestion.content} className={""}
                attachments={suggestion.attachments}
              />;
            })}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
