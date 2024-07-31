import { useState } from "react";
import { Link, router } from "expo-router";
import zxcvbn from "zxcvbn";

// Components and styles
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
} from "react-native";
import {
    Pressable,
    SerifText,
    SansSerifText,
    SafeAreaView,
    TextInput,
    View,
} from "@/components/Styled";
import { spacing } from "@/constants/Spacing";

// Contexts
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function RegisterScreen() {
    const { theme } = useTheme();

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
                console.log(result);
                Alert.alert(
                    `Error (${result.status})`,
                    result.detail || "Login failed."
                );
            } else {
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

    return (
        <SafeAreaView
            style={{
                justifyContent: "center",
            }}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <SerifText size="h1">What to Cook</SerifText>
                <TextInput
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect={false}
                    onChangeText={(text: string) => setEmail(text)}
                    style={spacing.mt4}
                />
                <View style={[styles.splitInputContainer, spacing.mt4]}>
                    <TextInput
                        placeholder="First Name"
                        autoCapitalize="words"
                        autoComplete="given-name"
                        autoCorrect={false}
                        onChangeText={(text: string) => setFirstName(text)}
                        style={styles.splitInput}
                    />
                    <TextInput
                        placeholder="Last Name"
                        autoCapitalize="words"
                        autoComplete="family-name"
                        autoCorrect={false}
                        onChangeText={(text: string) => setLastName(text)}
                        style={styles.splitInput}
                    />
                </View>
                <TextInput
                    placeholder="Password"
                    secureTextEntry={true}
                    onChangeText={(text: string) => setPassword(text)}
                    style={spacing.mt4}
                />
                <TextInput
                    placeholder="Confirm Password"
                    secureTextEntry={true}
                    onChangeText={(text: string) => setConfirmPassword(text)}
                    style={spacing.mt4}
                />
                <Pressable onPress={register} style={spacing.mt4}>
                    <SansSerifText size="h2" style={{ color: theme.c5 }}>
                        Sign Up
                    </SansSerifText>
                </Pressable>

                <View
                    style={[
                        styles.loginLinkContainer,
                        spacing.mt4,
                        spacing.mb4,
                    ]}
                >
                    <SansSerifText size="h3">Have an account?</SansSerifText>
                    <Link replace href="/">
                        <SansSerifText size="h2" style={{ color: theme.c5 }}>
                            Login
                        </SansSerifText>
                    </Link>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    splitInputContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        minWidth: "80%",
    },
    splitInput: {
        minWidth: "38%",
    },
    loginLinkContainer: {
        flexDirection: "row",
        gap: 8,
    },
});
