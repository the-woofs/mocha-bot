"use client"
import type { NextPage } from 'next'
import { signIn, useSession } from 'next-auth/react'
import Header from './components/header'
import Button from './components/button'
import { GuildSidebar, GuildHeader } from './components/guilds'
import { useEffect, useState } from 'react'

const Home: NextPage = () => {
  const { data: session } = useSession()

  if (session) {
    return <Main session={session} />
  }

  return (
    <main
      className='min-h-screen bg-hero dark:bg-hero-dark flex flex-col justify-center items-center'
    >
      <Button icon={<></>} onClick={() => signIn('discord')}>Sign in with Discord</Button >
    </main>
  )
}


function Main({ session }: { session: any }) {
  const { user } = session

  const [discrim, setDiscrim] = useState("0000");

  useEffect(() => {
    if (user) {
      console.log(user)
      console.log(user.id)
      const data = fetch(`/api/bot/users/${user.id}`).then((res) => res.json()).then((data) => {
        setDiscrim(data.result.discriminator)
      }
      )
    }
  }, [user])

  return (
    <main className='bg-hero dark:bg-hero-dark text-gray-200 '>
      <div className='min-h-screen flex flex-col font-medium grow justify-start'>
        <Header className='bg-graph-paper dark:bg-graph-paper-dark
        border-b-2 border-[#e2e8f0] dark:border-[#1e293b]
        ' avatar={user?.image} username={user?.name} discrim={discrim} />
        <GuildHeader userId={user?.id} className='shown-mobile' />
        <div className='h-[calc(100vh-100px)] flex flex-row'>
          <GuildSidebar
            userId={user?.id}
            className='hidden-mobile max-h-[calc(100vh-100px)] overflow-y-auto]'
          />
          <div className='grow
          flex flex-col justify-center items-center
          '>
            <h1 className='text-4xl font-bold'>Select A Server</h1>
          </div>
        </div>
      </div></main>
  )
}

export default Home