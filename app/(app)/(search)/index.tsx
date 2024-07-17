import { useEffect, useState } from "react";

import {
    Text,
    TextInput,
    Pressable,
    View,
    StyleSheet,
    SafeAreaView,
    ScrollView,
} from "react-native";

import axios from "axios";

import { Image } from "expo-image";

import { useTheme } from "@/contexts/ThemeContext";
import { API_URL } from "@/contexts/AuthContext";

// Icons
import { StarIcon } from "react-native-star-rating-widget";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const [sortOrder, setSortOrder] = useState<number>(0);
    const [ordering, setOrdering] = useState<string>("-date_last_made");
    const [icon, setIcon] = useState<string>("sort-calendar-descending");

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
            const result = await axios.get(`${API_URL}/api/dishes/`, {
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

    // Theme
    const { theme } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.c1 }]}>
            <View style={styles.searchContainer}>
                <TextInput
                    placeholder="Search"
                    placeholderTextColor={theme.c3}
                    autoCapitalize="words"
                    autoCorrect={false}
                    onChangeText={(text: string) => setSearchQuery(text)}
                    style={[
                        styles.fullInput,
                        { color: theme.c4, backgroundColor: theme.c2 },
                    ]}
                />
                <Pressable
                    onPress={() => (page == 1 ? getDishes() : setPage(1))}
                    style={[styles.searchButton, { backgroundColor: theme.c2 }]}
                >
                    <FontAwesome name="search" size={24} color={theme.c5} />
                </Pressable>
                <Pressable
                    onPress={() =>
                        sortOrder < 5
                            ? setSortOrder(sortOrder + 1)
                            : setSortOrder(0)
                    }
                    style={[styles.searchButton, { backgroundColor: theme.c2 }]}
                >
                    <MaterialCommunityIcons
                        name={icon as any}
                        size={24}
                        color={theme.c5}
                    />
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                {dishes
                    ? dishes.map((dish: Dish, index: number) => (
                          <Pressable
                              style={[
                                  styles.dishContainer,
                                  { backgroundColor: theme.c2 },
                              ]}
                              key={index}
                              // Link to other page, pass in the data
                          >
                              <Image
                                  style={styles.thumbnail}
                                  source={dish.image}
                              />
                              <View style={styles.details}>
                                  <Text
                                      style={[
                                          styles.dishName,
                                          {
                                              color: theme.c4,
                                          },
                                      ]}
                                  >
                                      {dish.name}
                                  </Text>
                                  <Text
                                      style={[
                                          styles.dishInfo,
                                          {
                                              color: theme.c4,
                                          },
                                      ]}
                                  >
                                      {dish.cuisine}
                                  </Text>
                                  <View style={styles.splitContainer}>
                                      <Text
                                          style={[
                                              styles.dishInfo,
                                              {
                                                  color: theme.c4,
                                                  marginRight: 2,
                                              },
                                          ]}
                                      >
                                          {parseInt(dish.rating) / 2}
                                      </Text>
                                      <StarIcon
                                          index={0}
                                          type="full"
                                          size={28}
                                          color="#fdd835"
                                      />
                                      <Text
                                          style={[
                                              styles.dishInfo,
                                              {
                                                  color: theme.c4,
                                                  marginLeft: 10,
                                                  marginRight: 4,
                                              },
                                          ]}
                                      >
                                          {dish.time_to_make}
                                      </Text>
                                      <FontAwesome6
                                          name="clock"
                                          size={24}
                                          color={theme.c4}
                                      />
                                  </View>
                              </View>
                          </Pressable>
                      ))
                    : null}

                {loading && (
                    <Text style={[styles.text, { color: theme.c4 }]}>
                        Loading...
                    </Text>
                )}

                {dishes.length == 0 && (
                    <Text style={[styles.text, { color: theme.c4 }]}>
                        No Dishes Found.
                    </Text>
                )}

                {hasNextPage && !loading && (
                    <Pressable
                        onPress={() => setPage((prevPage) => prevPage + 1)}
                        style={[styles.button, { backgroundColor: theme.c2 }]}
                    >
                        <Text style={[styles.text, { color: theme.c5 }]}>
                            Load More
                        </Text>
                    </Pressable>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    // Root containers
    container: {
        flex: 1,
        alignItems: "center",
    },
    scrollViewContainer: {
        alignItems: "center",
        minWidth: "100%",
    },

    // Search
    searchContainer: {
        minWidth: "80%",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: "4%",
    },
    searchButton: {
        paddingVertical: "3%",
        paddingHorizontal: "3%",
        borderRadius: 10,
    },
    fullInput: {
        minWidth: "52%",
        paddingVertical: "3%",
        paddingHorizontal: "3%",
        borderRadius: 10,
        fontFamily: "LouisGeorgeCafe",
        fontSize: 20,
    },

    // Dish
    dishContainer: {
        marginBottom: "4%",
        minWidth: "80%",
        paddingVertical: "3%",
        paddingHorizontal: "3%",
        borderRadius: 10,
        flexDirection: "row",
    },
    splitContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    details: {
        marginLeft: "4%",
        gap: 4,
    },
    thumbnail: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    dishName: {
        lineHeight: 40,
        fontFamily: "Adelia",
        fontSize: 20,
    },
    dishInfo: {
        fontFamily: "LouisGeorgeCafeBold",
        fontSize: 18,
    },

    // Other
    button: {
        marginBottom: "4%",
        minWidth: "80%",
        paddingVertical: "3%",
        paddingHorizontal: "8%",
        borderRadius: 10,
    },
    text: {
        textAlign: "center",
        fontFamily: "LouisGeorgeCafe",
        fontSize: 20,
    },
});
