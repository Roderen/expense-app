"use client"

import {Layout} from "antd";
import MyHeader from "@/app/components/MyHeader/MyHeader";
import {useAuth} from "@/app/context/AuthContext";
import React, {useEffect} from 'react';

import styles from "@/app/page.module.css";
import ReceiptsTable from "@/app/components/ReceiptsTable/ReceiptsTable";

const Home = () => {
    const { user, loading, signInWithGoogle } = useAuth();

    useEffect(() => {
        if (!loading && !user) {

        }
    }, [user, loading]);

    if (loading) return null;

    if (!user) return (
        <button onClick={signInWithGoogle} className={styles.loginButton}>Login</button>
    );

    return (
        <Layout style={{backgroundColor: 'transparent'}}>
            <MyHeader/>
            <div style={{marginTop: '50px'}}>
                <ReceiptsTable/>
            </div>
        </Layout>
    );
};

export default Home;