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
        if (email && password) {
            const result = await onLogin!(email, password);
            if (result && result.error) {
                console.log(result);
                // alert(result.msg);
            } else {
                router.replace("(home)");
            }
        } else {
            alert("Enter Credentials");
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
