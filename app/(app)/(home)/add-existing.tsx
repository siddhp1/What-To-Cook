import { useCallback, useEffect, useState } from "react";
import { router, useFocusEffect } from "expo-router";

// Components and styles
import { Alert, FlatList, StyleSheet } from "react-native";
import {
    Pressable,
    SansSerifText,
    SafeAreaView,
    TextInput,
    View,
} from "@/components/Styled";
import { spacing } from "@/constants/Spacing";

// Icons
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Contexts
import { useTheme } from "@/contexts/ThemeContext";
import { useDishes, Dish } from "@/contexts/DishContext";

export default function SearchScreen() {
    const { theme } = useTheme();
    const { onGetDishes, onEditDish } = useDishes();

    const [dishes, setDishes] = useState<Dish[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<number>(0);
    const [icon, setIcon] = useState<string>("sort-calendar-descending");

    // Listen for changes in the sortOrder number, change corresponding icon
    useEffect(() => {
        const iconMap: { [key: number]: string } = {
            0: "sort-calendar-descending",
            1: "sort-calendar-ascending",
            2: "sort-alphabetical-ascending-variant",
            3: "sort-alphabetical-descending-variant",
            4: "sort-alphabetical-ascending",
            5: "sort-alphabetical-descending",
        };

        setIcon(iconMap[sortOrder] || "sort-calendar-descending");
    }, [sortOrder]);

    // CHECK IF THIS IS NECESSARY

    // Refresh the page upon coming back (see if there is a better way to do this)
    const refreshPage = useCallback(() => {
        getDishes();
    }, []);

    useEffect(() => {
        getDishes();
    }, [searchQuery, sortOrder]);

    useFocusEffect(
        useCallback(() => {
            refreshPage();
        }, [refreshPage])
    );

    // Context requests
    const getDishes = async () => {
        try {
            const dishes = await onGetDishes!(searchQuery, sortOrder);
            setDishes(dishes);
        } catch (e) {
            console.error("Unexpected error:", e);
            Alert.alert(
                "Error",
                "An unexpected error occurred. Please try again."
            );
        }
    };

    const updateDate = async (dish: Dish) => {
        const updatedDish = {
            id: dish.id,
            date_last_made: new Date().toISOString().slice(0, 10),
        };
        try {
            const result = await onEditDish!(updatedDish);
            console.log(result);
            router.back();
        } catch (e) {
            console.error("Unexpected error:", e);
            Alert.alert(
                "Error",
                "An unexpected error occurred. Please try again."
            );
        }
    };

    // Double checking prompt
    const onDishPressed = (dish: Dish) => {
        Alert.alert(
            "Update Dish",
            "Did you make this today?",
            [
                {
                    text: "Yes",
                    onPress: () => updateDate(dish) || (() => {})(),
                },
                {
                    text: "No",
                    style: "cancel",
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <SafeAreaView>
            <View style={[styles.searchContainer, spacing.mt4, spacing.mb2]}>
                <TextInput
                    placeholder="Search"
                    autoCapitalize="words"
                    autoCorrect={false}
                    onChangeText={(text: string) => setSearchQuery(text)}
                    style={styles.searchInput}
                />
                <Pressable
                    onPress={() =>
                        sortOrder < 5
                            ? setSortOrder(sortOrder + 1)
                            : setSortOrder(0)
                    }
                    style={styles.orderButton}
                >
                    <MaterialCommunityIcons
                        name={icon as any}
                        size={24}
                        color={theme.c5}
                    />
                </Pressable>
            </View>
            <FlatList
                data={dishes}
                style={[styles.dishListContainer, spacing.mt2, spacing.mb2]}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => onDishPressed(item)}
                        style={[styles.dishButton, spacing.mb4]}
                    >
                        <SansSerifText size="h3">{item.name}</SansSerifText>
                        <SansSerifText size="h4">{item.cuisine}</SansSerifText>
                    </Pressable>
                )}
                keyExtractor={(item) => item.id.toString()}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        minWidth: "80%",
    },
    searchInput: {
        minWidth: "65%",
    },
    orderButton: {
        minWidth: 0,
    },
    dishListContainer: {
        minWidth: "88%",
        paddingHorizontal: "4%",
    },
    dishButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: "4%",
    },
});
