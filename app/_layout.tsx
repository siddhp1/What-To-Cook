import React, { useEffect } from "react";
import "react-native-reanimated";
import { Slot } from "expo-router";

// Styling
import { useFonts } from "expo-font";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as SplashScreen from "expo-splash-screen";

// Contexts
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { DishProvider } from "@/contexts/DishContext";

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    initialRouteName: "(app)",
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

    return (
        <ThemeProvider>
            <SafeAreaProvider>
                <AuthProvider>
                    <DishProvider>
                        <Slot />
                    </DishProvider>
                </AuthProvider>
            </SafeAreaProvider>
        </ThemeProvider>
    );
}
