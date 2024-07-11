import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

export default function NotFoundScreen() {
    const { theme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.c1 }]}>
            <Text style={[styles.title, { color: theme.c4 }]}>
                Something went wrong.
            </Text>
            <Pressable
                style={[styles.button, { backgroundColor: theme.c2 }]}
                onPress={() => router.replace("/")}
            >
                <Text style={[styles.text, { color: theme.c5 }]}>
                    Return to Home
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
    },
    title: {
        fontFamily: "LouisGeorgeCafe",
        fontSize: 32,
    },
    text: {
        fontFamily: "LouisGeorgeCafeBold",
        fontSize: 20,
        textAlign: "center",
    },
    button: {
        marginTop: "4%",
        paddingVertical: "3%",
        paddingHorizontal: "8%",
        borderRadius: 10,
    },
});
