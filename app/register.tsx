import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";

import { router, Link } from "expo-router";

import { useAuth } from "@/contexts/AuthContext";

export default function RegisterScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // Register?
    const { onLogin, onRegister } = useAuth();

    const login = async () => {
        if (email && password) {
            const result = await onLogin!(email, password);
            if (result && result.error) {
                console.log(result);
                alert(result.msg);
            } else {
                router.replace("/");
            }
        } else {
            alert("Enter Credentials");
        }
    };

    // Migrate to other screen after
    const register = async () => {
        if (email && password) {
            const result = await onRegister!(email, password);
            if (result && result.error) {
                console.log(result);
                alert(result.msg);
            } else {
                login(); // Auto login
            }
        } else {
            alert("Enter Credentials");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            <View style={styles.form}>
                <TextInput
                    placeholder="email"
                    onChangeText={(text: string) => setEmail(text)}
                    value={email}
                />
                <TextInput
                    placeholder="password"
                    secureTextEntry={true}
                    onChangeText={(text: string) => setPassword(text)}
                    value={password}
                />
                <Pressable onPress={login}>
                    <Text style={styles.title}>Login</Text>
                </Pressable>
                <Pressable onPress={register}>
                    <Text style={styles.title}>Register</Text>
                </Pressable>
            </View>
            <Link href="/" asChild>
                <Pressable>
                    <Text style={styles.title}>Bsck to welcome</Text>
                </Pressable>
            </Link>
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
        fontFamily: "Inter",
        fontSize: 20,
        fontWeight: "bold",
    },
    form: {
        gap: 10,
        width: "60%",
    },
});
