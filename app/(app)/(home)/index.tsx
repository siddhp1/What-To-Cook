import { View, Text, StyleSheet, Pressable, SafeAreaView } from "react-native";
import { Link } from "expo-router";

import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function HomeScreen() {
    const { onLogout } = useAuth();
    const { theme } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.c1 }]}>
            {/* Add section */}
            <Text
                style={[
                    styles.heading,
                    {
                        color: theme.c4,
                    },
                ]}
            >
                Made Something Today?
            </Text>
            <Link href="/add" asChild>
                <Pressable>
                    <Text style={styles.heading}>Link to Add</Text>
                </Pressable>
            </Link>

            {/* Quick and easy section */}
            <Text
                style={[
                    styles.heading,
                    {
                        color: theme.c4,
                    },
                ]}
            >
                Need Something Quick?
            </Text>

            {/* Haven't made in a while section */}
            <Text
                style={[
                    styles.heading,
                    {
                        color: theme.c4,
                    },
                ]}
            >
                Want Something Different?
            </Text>
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
