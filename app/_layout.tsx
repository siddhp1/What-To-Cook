// Core
import React, { useEffect } from "react";
import "react-native-reanimated";

// Routing
import { Slot } from "expo-router";

// Styling
import { useFonts } from "expo-font";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as SplashScreen from "expo-splash-screen";

// Providers
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    initialRouteName: "(home)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        LouisGeorgeCafe: require("../assets/fonts/louisgeorgecafe.ttf"),
        LouisGeorgeCafeBold: require("../assets/fonts/louisgeorgecafebold.ttf"),
        LouisGeorgeCafeLight: require("../assets/fonts/louisgeorgecafelight.ttf"),
        Adelia: require("../assets/fonts/adelia.otf"),
        ...FontAwesome.font,
    });

    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return <RootLayoutNav />;
}

function RootLayoutNav() {
    return (
        <ThemeProvider>
            <SafeAreaProvider>
                <AuthProvider>
                    <Slot />
                </AuthProvider>
            </SafeAreaProvider>
        </ThemeProvider>
    );
}
