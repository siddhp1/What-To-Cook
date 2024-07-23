import { Stack } from "expo-router";

import { HeaderOptions } from "@/components/Header";

export default function HomeLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="[id]" options={HeaderOptions("View Dish")} />
            <Stack.Screen name="add" options={HeaderOptions("Add New Dish")} />
            <Stack.Screen
                name="add-existing"
                options={HeaderOptions("Add Existing Dish")}
            />
        </Stack>
    );
}
