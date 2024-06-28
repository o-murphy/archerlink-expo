import React, {useEffect, useState} from "react";
import {View} from "react-native";
import {FAB} from "react-native-paper";
import styles from "../styles";
import {useDevControlWS} from "../providers/devControlWSProvider";
import * as control from "../proto/control.js";

const DevControlView = () => {

    const {socket} = useDevControlWS();

    useEffect(() => {
        if (!socket) return;
        return () => {
            if (socket) {
            }
        }
    })

    const sendDataToSocket = (data: string) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(data);
            console.log('Sent data to socket:', data);
        } else {
            console.error('WebSocket is not open to send data');
        }
    };

    const updateDevStatusAndCall = async (callback: any) => {
        if (socket) {
            socket.addEventListener('message', callback)
            sendDataToSocket(control.buildGetCurrentDevStatusPayload())
        }
    }

    const changeSchemeCallback = async (event: any) => {
        if (socket) {
            socket.removeEventListener('message', changeSchemeCallback)
        }
        if (event?.data) {
            const parsedData = await control.parseGetCurrentDevStatus(event.data);
            if (parsedData?.devstatus) {
                console.log(parsedData.devstatus.zoom)
                const payload = control.buildSetColorScheme(
                    parsedData.devstatus.colorscheme,
                )
                sendDataToSocket(payload)
            }
        }
    }

    const changeAGCCallback = async (event: any) => {
        if (socket) {
            socket.removeEventListener('message', changeAGCCallback)
        }
        if (event?.data) {
            const parsedData = await control.parseGetCurrentDevStatus(event.data);
            if (parsedData?.devstatus) {
                console.log(parsedData.devstatus.modagc)
                const payload = control.buildSetAgcModePayload(
                    parsedData.devstatus.modagc
                )
                sendDataToSocket(payload)
            }
        }
    }

    const changeZoomCallback = async (event: any) => {
        if (socket) {
            socket.removeEventListener('message', changeZoomCallback)
        }
        if (event?.data) {
            const parsedData = await control.parseGetCurrentDevStatus(event.data);
            if (parsedData?.devstatus) {
                console.log(parsedData.devstatus.zoom)
                const payload = control.buildSetZoomLevelPayload(
                    parsedData.devstatus.zoom,
                    parsedData.devstatus.maxzoom
                )
                sendDataToSocket(payload)
            }
        }
    }

    const onShemePress = async () => updateDevStatusAndCall(changeSchemeCallback)
    const onAGCPress = async () => updateDevStatusAndCall(changeAGCCallback)
    const onZoomPress = async () => updateDevStatusAndCall(changeZoomCallback)

    const toggleFFCCallback = async () => {
        if (socket) {
            const payload = control.buildTriggerFFCPayload();
            sendDataToSocket(payload)
        }
    }

    return (
        <View style={styles.rightColumn}>
            <FAB size="medium" icon="palette" style={styles.fab} onPress={onShemePress}/>
            <FAB size="medium" icon="image" style={styles.fab} onPress={onAGCPress}/>
            <FAB size="medium" icon="loupe" style={styles.fab} onPress={onZoomPress}/>
            <FAB size="medium" icon="camera-iris" style={styles.fab} onPress={toggleFFCCallback}/>
        </View>)
}

export default DevControlView