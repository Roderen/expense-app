import Image from "next/image";
import {Avatar, Flex, Typography} from "antd";
import {Header} from "antd/lib/layout/layout";

import dynamic from 'next/dynamic';
import Link from "next/link";
import {useAuth} from "@/app/context/AuthContext";

// const Link = dynamic(() => import('antd/es/typography/Link'), { ssr: false });

const MyHeader = () => {
    const { user } = useAuth();

    return (
        <Header style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 'auto',
            paddingTop: '1rem',
            paddingBottom: '1rem',
            background: "linear-gradient(90deg, #1f2a44 0%, #1b3752 35%, #1c4a50 75%, #3e6b57 100%)",
        }}
        >
            <Flex style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
            }}>
                <Typography>
                    <Link href="/" style={{
                        color: "white",
                        fontSize: "32px",
                    }}>Expense App</Link>
                </Typography>

                <Avatar size="large" src={user.photoURL} />
            </Flex>
        </Header>
    );
};

export default MyHeader;