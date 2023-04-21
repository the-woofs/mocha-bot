import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from 'next/image'
import Button from "./button";
import { signOut } from "next-auth/react";

function Header({
    avatar,
    username,
    className,
    discrim,
}: {
    avatar: string;
    username: string;
    className?: string;
    discrim: string;
}
) {
    const [ref, inView] = useInView();

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: -20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 1 }}
            className={`bg-transparent flex flex-wrap items-center text-gray-200 ${className}`}
        >
            <nav className='pr-4 lg:pr-6 py-2 lg:py-4 grow'>
                <div className='flex flex-wrap justify-between items-center'>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ duration: 1, delay: 0.5 }}
                    >
                        <span className='pl-[16px] pr-[24px] py-[10px] flex items-center gap-2 p-2 text-base text-gray-900 transition duration-75 group dark:text-white'>
                            <Image
                                src={avatar}
                                alt=""
                                width={48}
                                height={48}
                                style={{ borderRadius: '50%' }}
                            />
                            <h1 className='text-xl'>{username}</h1>
                            <span className='text-sm text-gray-400 dark:text-gray-500'>#{discrim}</span>
                        </span>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                        transition={{ duration: 1, delay: 0.5 }}
                    >
                        <span className='flex flex-col font-medium lg:flex-row lg:space-x-8 lg:mt-0 items-center'>
                            <Button
                                icon={<></>}
                                onClick={() => {
                                    signOut()
                                }}
                            >
                                Sign Out
                            </Button>
                        </span></motion.div>
                </div>
            </nav>
        </motion.div>
    );
}

export default Header;