import React, { useState } from "react";
import { View } from "react-native";
import { FAB } from "react-native-paper";
import styles from "../styles";
import useDevControlWS from "../hooks/devControlWS";
import * as control from "../proto/control.js";

const BASE_LOCATION = __DEV__ ?
  'ws://stream.trailcam.link:8080/websocket'
  : 'ws://192.168.100.1:8080/websocket';

const DevControlView: React.FC = () => {
  const { sendMessage, response, error } = useDevControlWS(BASE_LOCATION);

  const getDeviceState = async () => {
    const payload = control.buildGetCurrentDevStatusPayload();
    const statusResponse = await sendMessage(payload);
    const devstatus = await control.parseGetCurrentDevStatus(statusResponse)
    if (devstatus.devstatus) {
        return devstatus.devstatus
    }
    return null
  };

  const onShemePress = async () => {
    try {
      const devstatus = await getDeviceState()
      if (devstatus?.colorscheme) {
        const payload = control.buildSetColorScheme(devstatus.colorscheme);
        const colorSchemeResponse = await sendMessage(payload);
        console.log('Received color scheme response:', colorSchemeResponse);
      }
    } catch (error) {
      console.error('Error in onShemePress:', error);
    }
  };

  const onAGCPress = async () => {
    try {
      const devstatus = await getDeviceState()
      if (devstatus?.modagc) {
        const payload = control.buildSetAgcModePayload(devstatus.modagc);
        const agcModeResponse = await sendMessage(payload);
        console.log('Received agc mode response:', agcModeResponse);
      }
    } catch (error) {
      console.error('Error in onAGCPress:', error);
    }
  };

  const onZoomPress = async () => {
    try {
      const devstatus = await getDeviceState()
      if (devstatus) {
        const payload = control.buildSetZoomLevelPayload(devstatus.zoom, devstatus.maxzoom);
        const zoomLevelResponse = await sendMessage(payload);
        console.log('Received zoom level response:', zoomLevelResponse);
      }
    } catch (error) {
      console.error('Error in onZoomPress:', error);
    }
  };

  const toggleFFCCallback = () => {
    const message = control.buildTriggerFFCPayload();
    sendMessage(message);
  };

  return (
    <View style={styles.rightColumn}>
      <FAB size="medium" icon="palette" style={styles.fab} onPress={onShemePress} />
      <FAB size="medium" icon="image" style={styles.fab} onPress={onAGCPress}/>
      <FAB size="medium" icon="loupe" style={styles.fab} onPress={onZoomPress}/>
      <FAB size="medium" icon="camera-iris" style={styles.fab} onPress={toggleFFCCallback} />
    </View>
  );
}

export default DevControlView;
