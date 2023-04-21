// a long card that expands to full width, contains a small avatar and a name for the user information and below is the full message sent by the user

import Image from 'next/image'
import { useEffect, useState } from 'react'

function Card({ userId, message, className, attachments }: { userId: string, message: string, className: string, attachments: Array<any> }) {

    const [user, setUser] = useState({ id: "", username: "", avatar: "" })

    useEffect(() => {
        if (userId) {
            const data = fetch(`/api/bot/users/${userId}`).then((res) => res.json()).then((data) => {
                setUser(data.result)
            }
            )
        }
    }, [userId])

    return <div className={"my-4 flex flex-col gap-2 min-w-[250px] border-t-2 border-[#e2e8f0] dark:border-[#1e293b] " + className}>
        <div className="flex flex-row gap-2 p-2 items-center">
            <Image
                width={28}
                height={28}
                style={{ borderRadius: '50%' }}
                src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} alt="" />
            <span className="text-sm font-normal text-gray-500 dark:text-gray-300">{user.username} </span>
        </div>
        <div className="p-4 bg-graph-paper border border-gray-200 rounded-lg shadow-sm dark:bg-graph-paper-dark dark:border-gray-600">
            <div className="text-sm font-normal text-gray-500 dark:text-gray-300">{message} </div>
            {attachments.length > 0 &&
                attachments.map((attachment: any) => {
                    return <div key={attachment.id}>
                        <Image
                            width={attachment.width}
                            height={attachment.height}
                            className='rounded-lg max-w-[500px]'
                            src={attachment.url} alt={
                                attachment.filename
                            } />
                    </div>
                })
            }
        </div>
    </div>
}

export default Card