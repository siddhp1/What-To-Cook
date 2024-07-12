import { Stack } from "expo-router";

export default function SearchLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="dish" options={{ headerShown: false }} />
        </Stack>
    );
}
