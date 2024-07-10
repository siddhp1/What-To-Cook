// Core
import { useEffect } from "react";
import "react-native-reanimated";

// Routing
import { Slot, Stack } from "expo-router";

// Styling
import { useFonts } from "expo-font";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";

// Mine
import { useColorScheme } from "@/hooks/useColorScheme";

import { AuthProvider } from "@/contexts/AuthContext";

///
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
    const colorScheme = useColorScheme();

    return (
        <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
            <AuthProvider>
                <Slot />
            </AuthProvider>
        </ThemeProvider>
    );
}
