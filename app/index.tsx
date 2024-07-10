import { useState } from "react";
import { StyleSheet, TextInput, Pressable } from "react-native";
import { router, Link } from "expo-router";

import { useAuth } from "@/contexts/AuthContext";

// Custom themed components

import { SafeAreaView, Text } from "@/components/Themed";

export default function LoginScreen() {
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

    return (
        <SafeAreaView style={styles.container}>
            <Text type="h1">What to Cook</Text>

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
                <Text type="h3">Login</Text>
            </Pressable>

            <Link href="/register" asChild>
                <Pressable>
                    <Text type="h2">
                        Dont have an accoutn Create an Account
                    </Text>
                </Pressable>
            </Link>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "center",
    },
});
