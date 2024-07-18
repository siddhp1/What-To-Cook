// Components
import { Alert, Pressable, SafeAreaView, StyleSheet, Text } from "react-native";

// Contexts
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function SettingsScreen() {
    const { onLogout, onDelete } = useAuth();
    const { theme } = useTheme();

    // Edit prompt message and styles after
    const onDeletePressed = () => {
        Alert.alert(
            "Are You Sure?",
            "This action is irreversible.",
            [
                {
                    text: "Delete Account",
                    onPress: () => (onDelete || (() => {}))(),
                },
                {
                    text: "Cancel",
                    style: "cancel",
                },
            ],
            { cancelable: true }
        );
    };

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
                Settings
            </Text>
            <Pressable
                onPress={onLogout}
                style={[styles.button, { backgroundColor: theme.c2 }]}
            >
                <Text style={[styles.text, { color: theme.c5 }]}>Log Out</Text>
            </Pressable>
            <Pressable
                onPress={onDeletePressed}
                style={[styles.button, { backgroundColor: theme.c2 }]}
            >
                <Text style={[styles.text, { color: theme.c5 }]}>
                    Delete Account
                </Text>
            </Pressable>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
    heading: {
        fontFamily: "LouisGeorgeCafe",
        fontSize: 24,
    },
    text: {
        textAlign: "center",
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
});
