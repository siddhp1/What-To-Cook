import { router } from "expo-router";

// Components and styles
import { Pressable, SansSerifText, SafeAreaView } from "@/components/Styled";
import { spacing } from "@/constants/Spacing";

// Contexts
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useDishes } from "@/contexts/DishContext";

export default function SettingsScreen() {
  const { theme } = useTheme();
  const { onLogout } = useAuth();
  const { onSyncDishes } = useDishes();

  return (
    <SafeAreaView>
      <SansSerifText size="h1">Dish Settings</SansSerifText>
      <Pressable onPress={onSyncDishes} style={[spacing.mt4, spacing.mb4]}>
        <SansSerifText size="h2" style={{ color: theme.c5 }}>
          Sync Dishes
        </SansSerifText>
      </Pressable>
      <SansSerifText size="h1">Account Settings</SansSerifText>
      <Pressable onPress={() => router.push("/account")} style={spacing.mt4}>
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
