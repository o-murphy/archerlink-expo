import React, {useEffect, useRef, useState} from 'react';
import {View} from 'react-native-web';
import {Text} from "react-native-paper";
import {Platform} from 'react-native';
import Canvas from 'react-native-canvas';
import Spinner from "./Spinner";
import styles from '../styles';
import {useAppControlWS} from "../providers/appControlWSProvider";


const VideoStream = () => {
    const canvasRef = useRef(null);
    const [hasFrame, setHasFrame] = useState(false);
    const [hasWifi, setHasWifi] = useState(false);

    const {socket} = useAppControlWS();

    useEffect(() => {
        if (socket) {

            socket.on('frame', handleSocketMessage);

            socket.on('disconnect', () => {
                setHasFrame(false);
            })

            // Cleanup function to remove the event listener
            return () => {
                socket.off('frame', handleSocketMessage);
                socket.off('disconnect');
            };
        }
    }, [socket]);

    const handleSocketMessage = (data) => {
        if (data) {
            if (data.stream && data.stream.frame && data.stream.state === "Running") {
                const {frame} = data.stream;
                const img = new Image();
                img.onload = () => {
                    const canvas = canvasRef.current;
                    if (canvas) {
                        const context = canvas.getContext('2d');
                        if (context) {
                            context.imageSmoothingEnabled = false; // Disable image smoothing
                            context.clearRect(0, 0, canvas.width, canvas.height);
                            context.drawImage(img, 0, 0, canvas.width, canvas.height);
                        }
                    }
                };
                img.src = 'data:image/jpeg;base64,' + frame;
                setHasFrame(true);
            } else {
                setHasFrame(false);
                setHasWifi(data.wifi === true);
            }
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const resizeCanvas = () => {
                const container = canvas.parentNode;
                if (container) {
                    const {width, height} = container.getBoundingClientRect();
                    canvas.width = width;
                    canvas.height = height;
                }
            };

            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);
            return () => window.removeEventListener('resize', resizeCanvas);
        }
    }, [hasFrame]);

    return (
        <View style={styles.videoViewContainer}>
            {hasFrame ? (
                Platform.OS === 'web' ? (
                    <canvas ref={canvasRef} style={styles.canvas}/>
                ) : (
                    <Canvas ref={canvasRef} style={styles.canvas}/>
                )
            ) : (
                <View>
                    <Text style={styles.errorMessage}>{
                        hasWifi ?
                            "Stream not available,\ntrying to connect..."
                            : "No WiFi connection" +
                            "\nPlease connect"
                    }</Text>
                    {!hasWifi ? <Text style={styles.errorHint}>
                        {"Use an access point that matches\n" +
                            "the last four digits\n" +
                            "serial number of the device"}
                    </Text> : null}
                    {hasWifi ? <Spinner/> : null}
                </View>
            )}
        </View>
    );
};

export default VideoStream;
