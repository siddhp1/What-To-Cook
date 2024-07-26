import { useCallback, useEffect, useState } from "react";
import { router, useFocusEffect } from "expo-router";

// Components and styles
import { Alert, StyleSheet } from "react-native";
import {
    Image,
    Pressable,
    SerifText,
    SansSerifText,
    SafeAreaView,
    ScrollView,
    TextInput,
    View,
} from "@/components/Styled";
import { spacing } from "@/constants/Spacing";

// Icons
import { StarIcon } from "react-native-star-rating-widget";
import {
    FontAwesome,
    FontAwesome6,
    MaterialCommunityIcons,
} from "@expo/vector-icons";

// Contexts
import { useTheme } from "@/contexts/ThemeContext";
import { useDishes, Dish } from "@/contexts/DishContext";

export default function SearchScreen() {
    const { theme } = useTheme();
    const { onGetDishes } = useDishes();

    const [dishes, setDishes] = useState<Dish[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<number>(0);
    const [icon, setIcon] = useState<string>("sort-calendar-descending");

    // Listen for changes in the sortOrder number, change corresponding icon and request param
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

    // Refresh the page upon coming back (see if there is a better way to do this)
    const refreshPage = useCallback(() => {
        console.log("refreshing");
        getDishes();
    }, []);

    useFocusEffect(
        useCallback(() => {
            refreshPage();
        }, [refreshPage])
    );

    useEffect(() => {
        getDishes();
    }, [searchQuery, sortOrder]);

    // Pass in parameters here (ordering and search)
    const getDishes = async () => {
        try {
            const fdishes = await onGetDishes!(searchQuery, sortOrder);
            console.log("setting");
            console.log(fdishes);
            setDishes(fdishes);
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
            <View style={[styles.searchContainer, spacing.mb4]}>
                <TextInput
                    placeholder="Search"
                    autoCapitalize="words"
                    autoCorrect={false}
                    onChangeText={(text: string) => setSearchQuery(text)}
                    style={styles.searchInput}
                />
                <Pressable
                    onPress={() => getDishes()}
                    style={styles.searchButton}
                >
                    <FontAwesome name="search" size={24} color={theme.c5} />
                </Pressable>
                <Pressable
                    onPress={() =>
                        sortOrder < 5
                            ? setSortOrder(sortOrder + 1)
                            : setSortOrder(0)
                    }
                    style={styles.searchButton}
                >
                    <MaterialCommunityIcons
                        name={icon as any}
                        size={24}
                        color={theme.c5}
                    />
                </Pressable>
            </View>
            {/* HAVE TO CONVERT TO FLATLIST LATER FOR PERFORMANCE */}
            <ScrollView>
                {dishes
                    ? dishes.map((dish: Dish, index: number) => (
                          <Pressable
                              style={[styles.dishContainer, spacing.mb4]}
                              key={index}
                              onPress={() => router.push(`/dish/${dish.id}`)}
                          >
                              <Image style={styles.image} source={dish.image} />
                              <View style={styles.detailContainer}>
                                  <SerifText size="h3">{dish.name}</SerifText>
                                  <SansSerifText size="h4">
                                      {dish.cuisine}
                                  </SansSerifText>
                                  <View style={styles.rowContainer}>
                                      <View style={styles.ratingContainer}>
                                          <SansSerifText size="h4">
                                              {dish.rating / 2}
                                          </SansSerifText>
                                          <StarIcon
                                              index={0}
                                              type="full"
                                              size={28}
                                              color={theme.c6}
                                          />
                                      </View>
                                      <View style={styles.ratingContainer}>
                                          <SansSerifText size="h4">
                                              {dish.time_to_make}
                                          </SansSerifText>
                                          <FontAwesome6
                                              name="clock"
                                              size={24}
                                              color={theme.c4}
                                          />
                                      </View>
                                  </View>
                              </View>
                          </Pressable>
                      ))
                    : null}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        minWidth: "80%",
    },
    searchButton: {
        minWidth: 0,
    },
    searchInput: {
        minWidth: "52%",
    },
    dishContainer: {
        flexDirection: "row",
    },
    detailContainer: {
        marginLeft: "4%",
        gap: 4,
    },
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    image: {
        width: 100,
        height: 100,
    },
});
