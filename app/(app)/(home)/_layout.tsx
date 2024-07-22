import { useTheme } from "@/contexts/ThemeContext";
import { Stack, router } from "expo-router";
import { Pressable, Text, StyleSheet } from "react-native";

export default function HomeLayout() {
    const { theme } = useTheme();

    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
                name="add-existing"
                options={{
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: theme.c1,
                    },
                    title: "Add Existing Dish",
                    headerTitleStyle: [
                        styles.title,
                        {
                            color: theme.c4,
                        },
                    ],
                    headerLeft: () => (
                        <Pressable onPress={() => router.back()}>
                            <Text
                                style={[
                                    styles.link,
                                    {
                                        color: theme.c5,
                                    },
                                ]}
                            >
                                {/* Update this to a proper icon or make custom component */}
                                &lt; Back
                            </Text>
                        </Pressable>
                    ),
                }}
            />
            <Stack.Screen name="[id]" />
            <Stack.Screen
                name="add"
                options={{
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: theme.c1,
                    },
                    title: "Add New Dish",
                    headerTitleStyle: [
                        styles.title,
                        {
                            color: theme.c4,
                        },
                    ],
                    headerLeft: () => (
                        <Pressable onPress={() => router.back()}>
                            <Text
                                style={[
                                    styles.link,
                                    {
                                        color: theme.c5,
                                    },
                                ]}
                            >
                                {/* Update this to a proper icon or make custom component */}
                                &lt; Back
                            </Text>
                        </Pressable>
                    ),
                }}
            />
        </Stack>
    );
}

const styles = StyleSheet.create({
    title: {
        fontFamily: "LouisGeorgeCafeBold",
        fontSize: 20,
    },
    link: {
        fontFamily: "LouisGeorgeCafe",
        fontSize: 20,
    },
});
