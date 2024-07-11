import { useState } from "react";
import { router } from "expo-router";

// Components
import {
    StyleSheet,
    TextInput,
    Pressable,
    Text,
    View,
    SafeAreaView,
    Alert,
} from "react-native";

// Contexts
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function LoginScreen() {
    // Login functionality
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { onLogin } = useAuth();

    const login = async () => {
        // Check that user is entering both username and password
        if (!email || !password) {
            Alert.alert("Error", "Please enter credentials.");
            return;
        }

        try {
            const result = await onLogin!(email, password);

            if (result.error) {
                // Error
                console.log(result);
                Alert.alert(
                    `Error (${result.status})`,
                    result.detail || "Login failed."
                );
            } else {
                // Success
                console.log(result);
                router.replace("(home)");
            }
        } catch (e) {
            console.error("Unexpected error:", e);
            Alert.alert(
                "Error",
                "An unexpected error occurred. Please try again."
            );
        }
    };

    // Themes
    const { theme } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.c1 }]}>
            <Text
                style={[
                    styles.title,
                    {
                        color: theme.c4,
                    },
                ]}
            >
                What to Cook
            </Text>
            <TextInput
                placeholder="Email"
                placeholderTextColor={theme.c3}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                onChangeText={(text: string) => setEmail(text)}
                style={[
                    styles.input,
                    { color: theme.c4, backgroundColor: theme.c2 },
                ]}
            />
            <TextInput
                placeholder="Password"
                placeholderTextColor={theme.c3}
                secureTextEntry={true}
                onChangeText={(text: string) => setPassword(text)}
                style={[
                    styles.input,
                    { color: theme.c4, backgroundColor: theme.c2 },
                ]}
            />
            <Pressable
                onPress={login}
                style={[styles.button, { backgroundColor: theme.c2 }]}
            >
                <Text style={[styles.text, { color: theme.c5 }]}>Login</Text>
            </Pressable>
            <View style={styles.link}>
                <Text style={[styles.text, { color: theme.c3 }]}>
                    Don't have an account?
                </Text>
                <Pressable onPress={() => router.replace("/register")}>
                    <Text style={[styles.text, { color: theme.c5 }]}>
                        Sign Up
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        lineHeight: "100%",
        fontFamily: "Adelia",
        fontSize: 40,
    },
    input: {
        marginTop: "4%",
        minWidth: "80%",
        paddingVertical: "3%",
        paddingHorizontal: "3%",
        borderRadius: 10,
        fontFamily: "LouisGeorgeCafe",
        fontSize: 20,
    },
    button: {
        marginTop: "4%",
        minWidth: "80%",
        paddingVertical: "3%",
        paddingHorizontal: "8%",
        borderRadius: 10,
    },
    text: {
        textAlign: "center",
        fontFamily: "LouisGeorgeCafeBold",
        fontSize: 20,
    },
    link: {
        marginTop: "4%",
        flexDirection: "row",
        gap: 8,
    },
});
