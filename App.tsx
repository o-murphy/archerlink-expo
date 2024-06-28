import React from "react";
import {PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {DarkTheme} from "./src/theme";
import {SnackbarProvider} from "./src/components/SnackbarComponent";
import MainView from "./src/components/MainView";

function App() {
    return (
        <SafeAreaProvider>
            <PaperProvider theme={DarkTheme}>
                <SnackbarProvider>
                    <MainView/>
                </SnackbarProvider>
            </PaperProvider>
        </SafeAreaProvider>
    );
}

export default App;
