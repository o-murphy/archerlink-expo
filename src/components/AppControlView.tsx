import React, {useEffect, useState} from "react";
import {View} from "react-native";
import {FAB} from "react-native-paper";
import styles from "../styles";
import {useSnackbar} from './SnackbarComponent';
import {useAppControlWS} from "../providers/appControlWSProvider";

const VideoStreamView = () => {

    const {showSnackbar} = useSnackbar();

    const [isRecording, setIsRecording] = useState(false);

    const {socket} = useAppControlWS();

    useEffect(() => {
        if (socket) {

            socket.on('frame', handleFrameMessage);
            socket.on('photo', handlePhotoMessage);
            socket.on('record', handleRecordMessage);
            socket.on('disconnect', () => {
                setIsRecording(false);
            })

            // Cleanup function to remove the event listener
            return () => {
                socket.off('frame', handleFrameMessage);
                socket.off('photo', handleFrameMessage);
                socket.off('record', handleRecordMessage);
                socket.off('disconnect');
            };
        }
    }, [socket]);

    const handleFrameMessage = (data: any) => {
        if (data) {
            if (data.recording) {
                setIsRecording(data.recording.state === true)
            }
        }
    };

    const handlePhotoMessage = (data: any) => {
        if (data?.filename) {
            showSnackbar(`Photo taken successfully\nSaved to ${data.filename}`)
        } else if (data?.error) {
            showSnackbar(`Photo taking failed:\n${data.error}`)
        }
    };

    const handleRecordMessage = (data: any) => {
        if (data?.filename) {
            showSnackbar(`Photo taken successfully\nSaved to ${data.filename}`)
        } else if (data?.error) {
            showSnackbar(`Record taking failed:\n${data.error}`)
        }
    };

    const handleFolderPress = async () => {
        try {
            if (socket) {
                socket.emit('openMedia')
            } else {
                throw new Error("Web socket error")
            }
        } catch (error) {
            showSnackbar('Media opening error: ' + error);
        }
    }

    const handlePhotoPress = async () => {
        try {
            if (socket) {
                socket.emit('makeShot'); // Emit the 'photo' event with result
            } else {
                throw new Error("Web socket error")
            }
        } catch (error) {
            showSnackbar('Photo taking failed: ' + error);
        }
    };

    const handleRecordPress = async () => {
        try {
            if (socket) {
                socket.emit('toggleRecord')
            } else {
                throw new Error("Web socket error")
            }
        } catch (error) {
            showSnackbar('Video record toggle failed: ' + error);
        }
    };

    return (
        <View style={styles.leftColumn}>
            <FAB size="medium" icon="folder" style={styles.fab} onPress={handleFolderPress}/>
            <FAB size="medium" icon="camera" style={styles.fab} onPress={handlePhotoPress}/>
            <FAB
                size="medium"
                icon="video"
                style={isRecording ? styles.fabRecording : styles.fab}
                onPress={handleRecordPress}
                color={isRecording ? styles.fabRecording.iconColor : styles.fab.iconColor}
            />
        </View>
    )
}

export default VideoStreamView