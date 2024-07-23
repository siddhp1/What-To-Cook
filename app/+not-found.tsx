import { router } from "expo-router";

// Components and styles
import { Pressable, SansSerifText, SafeAreaView } from "@/components/Styled";
import { spacing } from "@/constants/Spacing";

// Contexts
import { useTheme } from "@/contexts/ThemeContext";

export default function NotFoundScreen() {
    const { theme } = useTheme();

    return (
        <SafeAreaView
            style={{
                justifyContent: "center",
            }}
        >
            <SansSerifText size="h1">Something went wrong.</SansSerifText>
            <Pressable
                style={spacing.mt4}
                onPress={() => router.replace("(home)")}
            >
                <SansSerifText size="h2" style={{ color: theme.c5 }}>
                    Return to Home
                </SansSerifText>
            </Pressable>
        </SafeAreaView>
    );
}
