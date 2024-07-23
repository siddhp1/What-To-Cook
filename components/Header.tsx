import { router } from "expo-router";

// Components and styles
import { Pressable, StyleSheet } from "react-native";
import { SansSerifText } from "./Styled";

// Icons
import { Ionicons } from "@expo/vector-icons";

// Contexts
import { useTheme } from "@/contexts/ThemeContext";

function HeaderBackButton() {
    const { theme } = useTheme();

    return (
        <Pressable
            onPress={() => router.back()}
            style={styles.backButtonContainer}
        >
            <Ionicons name="chevron-back" size={28} color={theme.c5} />
            <SansSerifText size="h3" style={[{ color: theme.c5 }]}>
                Back
            </SansSerifText>
        </Pressable>
    );
}

function HeaderOptions(headerTitle: string) {
    const { theme } = useTheme();

    return {
        headerShown: true,
        headerStyle: {
            backgroundColor: theme.c1,
        },
        title: headerTitle,
        headerTitleStyle: [
            styles.headerTitle,
            {
                color: theme.c4,
            },
        ],
        headerLeft: () => <HeaderBackButton />,
    };
}

const styles = StyleSheet.create({
    backButtonContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    headerTitle: {
        fontFamily: "LouisGeorgeCafeBold",
        fontSize: 20,
    },
});

export { HeaderOptions };
