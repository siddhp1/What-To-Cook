import { useState } from "react";
import { Link, router } from "expo-router";

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

export default function LoginScreen() {
    const { theme } = useTheme();

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
                console.log(result.status);
                Alert.alert(
                    `Error (${result.status})`,
                    result.detail || "Login failed."
                );
            } else {
                console.log(result.status);
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
                <TextInput
                    placeholder="Password"
                    secureTextEntry={true}
                    onChangeText={(text: string) => setPassword(text)}
                    style={spacing.mt4}
                />
                <Pressable onPress={login} style={spacing.mt4}>
                    <SansSerifText size="h2" style={{ color: theme.c5 }}>
                        Login
                    </SansSerifText>
                </Pressable>
                <View
                    style={[
                        styles.registerLinkContainer,
                        spacing.mt4,
                        spacing.mb4,
                    ]}
                >
                    <SansSerifText size="h3">
                        Don't have an account?
                    </SansSerifText>
                    <Link replace href="/register">
                        <SansSerifText size="h2" style={{ color: theme.c5 }}>
                            Sign Up
                        </SansSerifText>
                    </Link>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    registerLinkContainer: {
        flexDirection: "row",
        gap: 8,
    },
});
