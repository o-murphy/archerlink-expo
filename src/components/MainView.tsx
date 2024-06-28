import {View} from "react-native";
import styles from "../styles";
import AppControlView from "./AppControlView";
import VideoStream from "./VideoStream";
import DevControlView from "./DevControlView";
import React, {useEffect} from "react";
import {fetchStopServer} from "../api/appControl";
import {AppControlWSProvider} from "../providers/appControlWSProvider";
import {DevControlWSProvider} from "../providers/devControlWSProvider";


const MainView = () => {
    useEffect(() => {
        const handleBeforeUnload = async (event: any) => {
            // Perform the action you want before the tab/window is closed
            console.log('Tab is about to be closed');
            await fetchStopServer()
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);
    return (
        <View style={styles.container}>
            <AppControlWSProvider>
                <AppControlView/>
                <VideoStream/>
            </AppControlWSProvider>
            <DevControlWSProvider>
                <DevControlView/>
            </DevControlWSProvider>
        </View>
    )
}

export default MainView;

