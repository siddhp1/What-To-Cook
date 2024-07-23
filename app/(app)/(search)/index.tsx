import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { router, useFocusEffect } from "expo-router";

// Components and styles
import { StyleSheet } from "react-native";
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
import { API_URL } from "@/contexts/AuthContext";

type Dish = {
    id: number;
    name: string;
    cuisine: string;
    rating: string;
    time_to_make: string;
    date_last_made: string;
    image: string;
};

export default function SearchScreen() {
    const { theme } = useTheme();

    const [dishes, setDishes] = useState<Dish[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const [sortOrder, setSortOrder] = useState<number>(0);
    const [ordering, setOrdering] = useState<string>("-date_last_made");
    const [icon, setIcon] = useState<string>("sort-calendar-descending");

    // Refresh the page upon coming back, should be fine
    const refreshPage = useCallback(() => {
        setPage(1);
        getDishes();
    }, []);

    useFocusEffect(
        useCallback(() => {
            refreshPage();
            return () => {
                // Optional cleanup if needed
            };
        }, [refreshPage])
    );

    // Listen for changes in the sortOrder number, change corresponding icon and request param
    useEffect(() => {
        switch (sortOrder) {
            case 0:
                setOrdering("-date_last_made");
                setIcon("sort-calendar-descending");
                break;
            case 1:
                setOrdering("date_last_made");
                setIcon("sort-calendar-ascending");
                break;
            case 2:
                setOrdering("cuisine");
                setIcon("sort-alphabetical-ascending-variant");
                break;
            case 3:
                setOrdering("-cuisine");
                setIcon("sort-alphabetical-descending-variant");
                break;
            case 4:
                setOrdering("name");
                setIcon("sort-alphabetical-ascending");
                break;
            case 5:
                setOrdering("-name");
                setIcon("sort-alphabetical-descending");
                break;
            default:
                setOrdering("-date_last_made");
                setIcon("sort-calendar-descending");
                break;
        }
        setPage(1);
    }, [sortOrder]);

    // Listen to change in ordering or page
    useEffect(() => {
        getDishes();
    }, [page, ordering]);

    // Api request
    const getDishes = async () => {
        setLoading(true);

        try {
            const result = await axios.get(`${API_URL}/api/dishes/dishes/`, {
                params: {
                    page,
                    search: searchQuery,
                    ordering: ordering,
                },
            });

            console.log(result.status);

            if (page === 1) {
                setDishes(result.data.results);
            } else {
                setDishes((prevDishes) => [
                    ...prevDishes,
                    ...result.data.results,
                ]);
            }
            setHasNextPage(result.data.next !== null);
            return {
                status: result.status,
            };
        } catch (e) {
            if (axios.isAxiosError(e) && e.response) {
                console.log(e.response.data);
                return {
                    error: true,
                    status: e.response.status,
                    data: e.response.data || "An error occurred.",
                };
            } else {
                return {
                    error: true,
                    status: null,
                    data: "An unexpected error occurred.",
                };
            }
        } finally {
            setLoading(false);
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
                    onPress={() => (page == 1 ? getDishes() : setPage(1))}
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
                                              {parseInt(dish.rating) / 2}
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

                {loading && <SansSerifText size="h3">Loading...</SansSerifText>}

                {dishes.length == 0 && (
                    <SansSerifText size="h3">No Dishes Found.</SansSerifText>
                )}

                {hasNextPage && !loading && (
                    <Pressable
                        onPress={() => setPage((prevPage) => prevPage + 1)}
                        style={spacing.mb4}
                    >
                        <SansSerifText size="h2" style={{ color: theme.c5 }}>
                            Load More
                        </SansSerifText>
                    </Pressable>
                )}
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
