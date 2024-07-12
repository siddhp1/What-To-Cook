import { Text, View, StyleSheet, SafeAreaView } from "react-native";

import { useTheme } from "@/contexts/ThemeContext";

export default function SearchScreen() {
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
                Here's Everything You Have Ever Made.
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
