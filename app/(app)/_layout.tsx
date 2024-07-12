import React from "react";

// Routing
import { Redirect, Tabs } from "expo-router";

// Icons
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { FontAwesome6 } from "@expo/vector-icons";

// Contexts
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function AppLayout() {
    // Authentication
    const { authState } = useAuth();

    if (!authState?.authenticated) {
        // Redirect to the welcome screen if not authenticated
        return <Redirect href="/" />;
    }

    // Themes
    const { theme } = useTheme();

    // Define application layout here
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: theme.c5,
                tabBarInactiveTintColor: theme.c3,
                tabBarStyle: {
                    backgroundColor: theme.c1,
                },
            }}
        >
            {/* Home tab */}
            <Tabs.Screen
                name="(home)"
                options={{
                    title: "Home",
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <FontAwesome
                            name="home"
                            size={28}
                            style={{ marginBottom: -3 }}
                            color={color}
                        />
                    ),
                }}
            />
            {/* Search tab */}
            <Tabs.Screen
                name="(search)"
                options={{
                    title: "Dishes",
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <FontAwesome6
                            name="bowl-food"
                            size={28}
                            style={{ marginBottom: -3 }}
                            color={color}
                        />
                    ),
                }}
            />
            {/* Settings tab */}
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Settings",
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <FontAwesome
                            name="gear"
                            size={28}
                            style={{ marginBottom: -3 }}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
