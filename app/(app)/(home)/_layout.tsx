import { useTheme } from "@/contexts/ThemeContext";
import { Stack, useNavigation } from "expo-router";
import { Pressable, Text, StyleSheet } from "react-native";

export default function HomeLayout() {
    const { theme } = useTheme();
    const navigation = useNavigation();

    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
                name="add"
                options={{
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: theme.c1,
                    },
                    title: "Add Dish",
                    headerTitleStyle: [
                        styles.title,
                        {
                            color: theme.c4,
                        },
                    ],
                    headerLeft: () => (
                        <Pressable onPress={() => navigation.popToTop()}>
                            <Text
                                style={[
                                    styles.link,
                                    {
                                        color: theme.c5,
                                    },
                                ]}
                            >
                                &lt; Back
                            </Text>
                        </Pressable>
                    ),
                }}
            />
            {/* Add other screens, and make the header a separate component after */}
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
