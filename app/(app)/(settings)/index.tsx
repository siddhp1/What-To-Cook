import { useEffect, useState } from "react";
import { router } from "expo-router";

// Components and styles
import { Alert } from "react-native";
import { Pressable, SansSerifText, SafeAreaView } from "@/components/Styled";
import { spacing } from "@/constants/Spacing";

// Contexts
import { Account, useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useDishes } from "@/contexts/DishContext";

export default function SettingsScreen() {
    const { theme } = useTheme();
    const { onGetAccount, onLogout } = useAuth();
    const { onSyncDishes } = useDishes();

    const [accountInfo, setAccountInfo] = useState<Account>();

    useEffect(() => {
        getAccount();
    }, []);

    const getAccount = async () => {
        try {
            const account = await onGetAccount!();
            setAccountInfo(account);
        } catch (e) {
            console.error("Unexpected error:", e);
            Alert.alert(
                "Error",
                "An unexpected error occurred. Please try again."
            );
        }
    };

    return (
        <SafeAreaView>
            <SansSerifText size="h1">Dish Settings</SansSerifText>
            <Pressable
                onPress={onSyncDishes}
                style={[spacing.mt4, spacing.mb4]}
            >
                <SansSerifText size="h2" style={{ color: theme.c5 }}>
                    Sync Dishes
                </SansSerifText>
            </Pressable>
            <SansSerifText size="h1">Account Settings</SansSerifText>

            {/* Boxes here */}
            <Pressable
                onPress={() => router.push("/account")}
                style={spacing.mt4}
            >
                <SansSerifText size="h2" style={{ color: theme.c5 }}>
                    Edit Account
                </SansSerifText>
            </Pressable>

            <Pressable onPress={onLogout} style={spacing.mt4}>
                <SansSerifText size="h2" style={{ color: theme.c5 }}>
                    Log Out
                </SansSerifText>
            </Pressable>
        </SafeAreaView>
    );
}
