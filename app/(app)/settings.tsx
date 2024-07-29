// Components and styles
import { Alert } from "react-native";
import { Pressable, SansSerifText, SafeAreaView } from "@/components/Styled";
import { spacing } from "@/constants/Spacing";

// Contexts
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useDishes } from "@/contexts/DishContext";

export default function SettingsScreen() {
    const { theme } = useTheme();
    const { onLogout, onDelete } = useAuth();
    const { onSyncDishes } = useDishes();

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
        <SafeAreaView>
            <SansSerifText size="h1">Settings</SansSerifText>
            <Pressable onPress={onSyncDishes} style={spacing.mt4}>
                <SansSerifText size="h2" style={{ color: theme.c5 }}>
                    Sync Dishes
                </SansSerifText>
            </Pressable>
            <Pressable onPress={onLogout} style={spacing.mt4}>
                <SansSerifText size="h2" style={{ color: theme.c5 }}>
                    Log Out
                </SansSerifText>
            </Pressable>
            <Pressable onPress={onDeletePressed} style={spacing.mt4}>
                <SansSerifText size="h2" style={{ color: theme.c5 }}>
                    Delete Account
                </SansSerifText>
            </Pressable>
        </SafeAreaView>
    );
}
