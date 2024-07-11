import { useState } from "react";
import { router, Link } from "expo-router";

// Components
import {
    StyleSheet,
    TextInput,
    Pressable,
    Text,
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
                placeholder="email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                onChangeText={(text: string) => setEmail(text)}
            />
            <TextInput
                placeholder="password"
                secureTextEntry={true}
                onChangeText={(text: string) => setPassword(text)}
            />
            <Pressable onPress={login}>
                <Text
                    style={[
                        styles.button,
                        { color: theme.c5, backgroundColor: theme.c2 },
                    ]}
                >
                    Login
                </Text>
            </Pressable>

            <Link href="/register" asChild>
                <Pressable>
                    <Text>Dont have an accoutn Create an Account</Text>
                </Pressable>
            </Link>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flex: 1,
        width: "100%",
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "center",
    },
    title: {
        fontFamily: "Adelia",
        lineHeight: "100%",
        fontSize: 40,
    },
    button: {
        fontFamily: "LouisGeorgeCafeBold",
        fontSize: 40,
        minWidth: "50%",
        textAlign: "center",
    },
});
