import { useState } from "react";
import { router } from "expo-router";
import zxcvbn from "zxcvbn";

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

export default function RegisterScreen() {
    // Registration functionality
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { onLogin, onRegister } = useAuth();

    // Login function for auto login
    const login = async () => {
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

    const register = async () => {
        // Check fields are filled
        if (
            !email ||
            !firstName ||
            !lastName ||
            !password ||
            !confirmPassword
        ) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        // Check that password and confirm password match
        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match.");
            return;
        }

        // Password meets strength requirements
        if (zxcvbn(password).score < 3) {
            Alert.alert("Error", "Password is not strong enough.");
            return;
        }

        try {
            const result = await onRegister!(
                email,
                firstName,
                lastName,
                password,
                confirmPassword
            );

            if (result.error) {
                console.log(result);
                let alertMessage: string = "";
                // Get all error messages from response
                Object.keys(result.data).forEach((key) => {
                    // Access the value associated with each key, which might be an array or a single value
                    const value = result.data[key];

                    // If the value is an array, join its elements into a string; otherwise, directly alert the value
                    if (Array.isArray(value)) {
                        alertMessage = `${value.join(", ")}`;
                    } else {
                        alertMessage = `${value}`;
                    }
                });
                if (alertMessage) {
                    alertMessage =
                        alertMessage.charAt(0).toUpperCase() +
                        alertMessage.slice(1);
                }
                Alert.alert(
                    `Error (${result.status})`,
                    alertMessage || "Sign up failed."
                );
            } else {
                console.log(result);
                login(); // Auto login
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
                    styles.fullInput,
                    { color: theme.c4, backgroundColor: theme.c2 },
                ]}
            />
            <View style={styles.splitContainer}>
                <TextInput
                    placeholder="First Name"
                    placeholderTextColor={theme.c3}
                    autoCapitalize="words"
                    autoComplete="given-name"
                    autoCorrect={false}
                    onChangeText={(text: string) => setFirstName(text)}
                    style={[
                        styles.halfInput,
                        { color: theme.c4, backgroundColor: theme.c2 },
                    ]}
                />
                <TextInput
                    placeholder="Last Name"
                    placeholderTextColor={theme.c3}
                    autoCapitalize="words"
                    autoComplete="family-name"
                    autoCorrect={false}
                    onChangeText={(text: string) => setLastName(text)}
                    style={[
                        styles.halfInput,
                        { color: theme.c4, backgroundColor: theme.c2 },
                    ]}
                />
            </View>
            <TextInput
                placeholder="Password"
                placeholderTextColor={theme.c3}
                secureTextEntry={true}
                onChangeText={(text: string) => setPassword(text)}
                style={[
                    styles.fullInput,
                    { color: theme.c4, backgroundColor: theme.c2 },
                ]}
            />
            <TextInput
                placeholder="Confirm Password"
                placeholderTextColor={theme.c3}
                secureTextEntry={true}
                onChangeText={(text: string) => setConfirmPassword(text)}
                style={[
                    styles.fullInput,
                    { color: theme.c4, backgroundColor: theme.c2 },
                ]}
            />
            <Pressable
                onPress={register}
                style={[styles.button, { backgroundColor: theme.c2 }]}
            >
                <Text style={[styles.text, { color: theme.c5 }]}>Sign Up</Text>
            </Pressable>
            <View style={styles.link}>
                <Text style={[styles.text, { color: theme.c3 }]}>
                    Have an account?
                </Text>
                <Pressable onPress={() => router.replace("/")}>
                    <Text style={[styles.text, { color: theme.c5 }]}>
                        Login
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
    splitContainer: {
        minWidth: "80%",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    title: {
        lineHeight: "100%",
        fontFamily: "Adelia",
        fontSize: 40,
    },
    halfInput: {
        marginTop: "4%",
        minWidth: "38%",
        paddingVertical: "3%",
        paddingHorizontal: "3%",
        borderRadius: 10,
        fontFamily: "LouisGeorgeCafe",
        fontSize: 20,
    },
    fullInput: {
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
