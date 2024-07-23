import React from "react";
import { Redirect, Tabs } from "expo-router";

// Styles
import { StyleSheet } from "react-native";

// Icons
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";

// Contexts
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function AppLayout() {
    const { theme } = useTheme();
    const { authState } = useAuth();

    // Redirect to the welcome screen if not authenticated
    if (!authState?.authenticated) {
        return <Redirect href="/" />;
    }

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
            <Tabs.Screen
                name="(home)"
                options={{
                    title: "Home",
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <FontAwesome
                            name="home"
                            size={tabBarIconSize}
                            style={styles.tabBarIconMargin}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="(search)"
                options={{
                    title: "Dishes",
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <FontAwesome6
                            name="bowl-food"
                            size={tabBarIconSize}
                            style={styles.tabBarIconMargin}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Settings",
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <FontAwesome
                            name="gear"
                            size={tabBarIconSize}
                            style={styles.tabBarIconMargin}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}

const tabBarIconSize = 28;
const styles = StyleSheet.create({
    tabBarIconMargin: {
        marginBottom: -3,
    },
});
