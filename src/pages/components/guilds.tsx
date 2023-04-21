import { useEffect, useState } from "react";
import Image from 'next/image'
import Button from "./button";
import { motion } from "framer-motion";

async function getGuilds(userId: string) {
    let guilds = [] as any;
    const res = await fetch('/api/bot/users/@me/guilds')
    let data = await res.json()
    for (const guild of data.result) {
        const guildRes = await fetch(`/api/bot/guilds/${guild.id}/members/${userId}`)
        const guildData = await guildRes.json()
        if (guildData.result.user) {
            guilds.push(guild)
        }
    }
    return guilds;
}

function GuildSidebar({ userId, className }: { userId: string, className: string }) {

    const [width, setWidth] = useState<number>(window.innerWidth)

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }
    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    const isMobile = width <= 768;

    const [guilds, setGuilds] = useState([])

    useEffect(() => {
        if (!isMobile) {
            getGuilds(userId).then(
                (guilds) => {
                    setGuilds(guilds)
                }
            )
        }
    }, [])

    return <>
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className={"flex flex-col gap-2 bg-graph-paper min- dark:bg-graph-paper-dark min-w-[250px] min-h-screen border-r-2 border-[#e2e8f0] dark:border-[#1e293b] " + className}
        >
            {
                guilds.map((guild: any) => {
                    return <div key={guild.id}>
                        <button
                            onClick={() => {
                                window.location.href = `/${guild.id}`
                            }}
                            type="button" className="pl-[16px] pr-[24px] py-[10px] flex items-center gap-2 w-full p-2 text-base text-gray-900 transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                        >
                            <Image
                                width={38}
                                height={38}
                                style={{ borderRadius: '50%' }}
                                src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`} alt="" />
                            <h1 className="text-md">{guild.name}</h1></button>
                    </div>
                })
            }</motion.div >
    </>
}

function GuildHeader({ userId, className }: { userId: string, className: string }) {

    const [width, setWidth] = useState<number>(window.innerWidth)

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }
    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    const isMobile = width <= 768;

    const [guilds, setGuilds] = useState([])

    useEffect(() => {

        if (isMobile) {
            getGuilds(userId).then(
                (guilds) => {
                    setGuilds(guilds)
                }
            )
        }
    }, [])

    return <>
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className={"flex flex-col p-4 gap-2 bg-graph-paper dark:bg-graph-paper-dark min-w-screen border-b-2 border-[#e2e8f0] dark:border-[#1e293b] " + className}
        >
            {
                guilds.map((guild: any) => {
                    return <span className="m-0" key={guild.id}>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => { }}
                            className="p-2"
                        >
                            <Image
                                width={48}
                                height={48}
                                style={{ borderRadius: '50%' }}
                                src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`} alt="" />
                        </motion.button>
                    </span>
                })
            }</motion.div >
    </>
}

export { GuildSidebar, GuildHeader };