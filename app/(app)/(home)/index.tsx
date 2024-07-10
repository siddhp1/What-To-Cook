import { View, Text, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";

import { useAuth } from "@/contexts/AuthContext";

export default function HomeScreen() {
    const { onLogout } = useAuth();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tab One (Home)</Text>
            <Text style={styles.content}>Tab One (Home)</Text>
            <Link href="/settings" asChild>
                <Pressable>
                    <Text style={styles.title}>Settings</Text>
                </Pressable>
            </Link>
            {/* Potentially relocate to the header or somewhere else (settings) */}
            <Pressable onPress={onLogout}>
                <Text style={styles.title}>LOGOUT</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        color: "#ffffff",
        fontFamily: "Inter",
        fontSize: 20,
        fontWeight: "bold",
    },
    content: {
        color: "#ffffff",
        fontSize: 20,
        fontWeight: "bold",
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: "80%",
    },
});
