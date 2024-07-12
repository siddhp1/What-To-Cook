import { SafeAreaView, Text, Pressable, StyleSheet } from "react-native";

import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function SettingsScreen() {
    const { onLogout } = useAuth();
    const { theme } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.c1 }]}>
            <Text
                style={[
                    styles.heading,
                    {
                        color: theme.c4,
                    },
                ]}
            >
                Settings
            </Text>

            {/* Add more settings here after */}

            <Pressable onPress={onLogout}>
                <Text style={styles.heading}>LOGOUT</Text>
            </Pressable>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    heading: {
        fontFamily: "LouisGeorgeCafe",
        fontSize: 24,
    },
});
