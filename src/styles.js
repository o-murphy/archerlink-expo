import {StyleSheet} from "react-native";
import {DarkTheme, LightTheme} from "./theme";

const theme = DarkTheme

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: theme.colors.scrim,  // Theme Background Color
    },
    leftColumn: {
        width: 100, // Fixed width for left column
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    centerColumn: {
        flex: 1, // Center column expands
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightColumn: {
        width: 100, // Fixed width for right column
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    fab: {
        margin: 10,
        zIndex: 10, // Ensure the buttons are on top
        backgroundColor: theme.colors.primaryContainer,
        iconColor: theme.colors.onPrimaryContainer
    },
    fabRecording: {
        margin: 10,
        zIndex: 10, // Ensure the buttons are on top
        backgroundColor: theme.colors.error,
        iconColor: theme.colors.onError
    },
    snackbar: {
        zIndex: 1000,
        width: '70%', // Adjust the width as needed
        alignSelf: 'center', // Center the snackbar
    },
    canvas: {
        borderWidth: 1,
        borderColor: 'black',
        maxWidth: '95%',
        maxHeight: '95%',
        aspectRatio: '4 / 3', // This ensures the aspect ratio is maintained initially
    },
    videoViewContainer: {
        flex: 1, // Center column expands
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: theme.colors.scrim,
        width: '100%',
        height: '100%',
    },
    errorMessage: {
        color: theme.colors.errorContainer,
        fontSize: 20,
        textAlign: 'center',
        padding: 20,
    },
    errorHint: {
        color: theme.colors.primary,
        fontSize: 16,
        textAlign: 'center',
        padding: 20,
    },
    spinner: {
        color: theme.colors.primary
    }
});

export default styles;