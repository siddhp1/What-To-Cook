import { Stack } from "expo-router";

import { HeaderOptions } from "@/components/Header";

export default function SearchLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
                name="dish/[id]"
                options={HeaderOptions("View Dish")}
            />
        </Stack>
    );
}
