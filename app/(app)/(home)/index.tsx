import { useState, useEffect, useCallback } from "react";
import axios from "axios";

import {
    FlatList,
    View,
    Text,
    StyleSheet,
    Pressable,
    SafeAreaView,
    ScrollView,
} from "react-native";
import { router, useFocusEffect } from "expo-router";

import { useTheme } from "@/contexts/ThemeContext";

import { API_URL } from "@/contexts/AuthContext";

import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";

type Dish = {
    id: number;
    name: string;
    cuisine: string;
    rating: string;
    time_to_make: string;
    date_last_made: string;
    image: string;
};

export default function HomeScreen() {
    const [quickDishes, setQuickDishes] = useState<Dish[]>([]);
    const [favoriteDishes, setFavoriteDishes] = useState<Dish[]>([]);
    const [oldestDishes, setOldestDishes] = useState<Dish[]>([]);

    const [quickDishesLoading, setQuickDisheslLoading] = useState(false);
    const [favouriteDishesLoading, setFavouriteDisheslLoading] =
        useState(false);
    const [oldestDishesLoading, setOldestDisheslLoading] = useState(false);

    // Refresh the page upon coming back, should be fine
    const refreshPage = useCallback(() => {
        getQuickDishes();
        getFavoriteDishes();
        getOldestDishes();
    }, []);

    useFocusEffect(
        useCallback(() => {
            refreshPage();
            return () => {
                // Optional cleanup if needed
            };
        }, [refreshPage])
    );

    const getQuickDishes = async () => {
        setQuickDisheslLoading(true);

        try {
            const result = await axios.get(`${API_URL}/api/dishes/quick/`);
            console.log(result.status);
            setQuickDishes(result.data);
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
            setQuickDisheslLoading(false);
        }
    };

    const getFavoriteDishes = async () => {
        setFavouriteDisheslLoading(true);

        try {
            const result = await axios.get(`${API_URL}/api/dishes/favorite/`);
            console.log(result.status);
            setFavoriteDishes(result.data);
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
            setFavouriteDisheslLoading(false);
        }
    };

    const getOldestDishes = async () => {
        setOldestDisheslLoading(true);

        try {
            const result = await axios.get(`${API_URL}/api/dishes/oldest/`);
            console.log(result.status);
            setOldestDishes(result.data);
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
            setOldestDisheslLoading(false);
        }
    };

    useEffect(() => {
        getQuickDishes();
        getFavoriteDishes();
        getOldestDishes();
    }, []);

    const { theme } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.c1 }]}>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                {/* Add section */}
                <Text
                    style={[
                        styles.heading,
                        {
                            color: theme.c4,
                        },
                    ]}
                >
                    Made Something Today?
                </Text>
                <View style={styles.splitContainer}>
                    <Pressable
                        onPress={() => router.push("/add")}
                        style={[
                            styles.button,
                            {
                                backgroundColor: theme.c2,
                            },
                        ]}
                    >
                        <Feather name="plus" size={36} color={theme.c3} />
                        <Text style={[styles.text, { color: theme.c5 }]}>
                            New Dish
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => router.push("/add-existing")}
                        style={[
                            styles.button,
                            {
                                backgroundColor: theme.c2,
                            },
                        ]}
                    >
                        <Feather name="plus" size={36} color={theme.c3} />
                        <Text style={[styles.text, { color: theme.c5 }]}>
                            Existing Dish
                        </Text>
                    </Pressable>
                </View>

                {quickDishes.length > 0 && favoriteDishes.length > 0 ? (
                    <>
                        <Text
                            style={[
                                styles.heading,
                                {
                                    color: theme.c4,
                                },
                            ]}
                        >
                            Need Something Quick?
                        </Text>
                        <FlatList
                            horizontal={true}
                            data={quickDishes}
                            style={styles.recommendationContainer}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={[
                                        styles.recommendation,
                                        { backgroundColor: theme.c2 },
                                    ]}
                                    key={item.id}
                                    onPress={() =>
                                        router.navigate(`/${item.id}`)
                                    }
                                >
                                    <Image
                                        style={styles.thumbnail}
                                        source={{ uri: item.image }}
                                    />
                                    <Text
                                        style={[
                                            styles.name,
                                            {
                                                color: theme.c4,
                                            },
                                        ]}
                                    >
                                        {item.name}
                                    </Text>
                                </Pressable>
                            )}
                            keyExtractor={(item) => item.id.toString()}
                        />
                        <Text
                            style={[
                                styles.heading,
                                {
                                    color: theme.c4,
                                },
                            ]}
                        >
                            Want Something Different?
                        </Text>
                        <FlatList
                            horizontal={true}
                            data={oldestDishes}
                            style={styles.recommendationContainer}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={[
                                        styles.recommendation,
                                        { backgroundColor: theme.c2 },
                                    ]}
                                    key={item.id}
                                    onPress={() =>
                                        router.navigate(`/${item.id}`)
                                    }
                                >
                                    <Image
                                        style={styles.thumbnail}
                                        source={{ uri: item.image }}
                                    />
                                    <Text
                                        style={[
                                            styles.name,
                                            {
                                                color: theme.c4,
                                            },
                                        ]}
                                    >
                                        {item.name}efjsdjkfh
                                    </Text>
                                </Pressable>
                            )}
                            keyExtractor={(item) => item.id.toString()}
                        />
                        <Text
                            style={[
                                styles.heading,
                                {
                                    color: theme.c4,
                                },
                            ]}
                        >
                            Your Favourites
                        </Text>
                        <FlatList
                            horizontal={true}
                            data={favoriteDishes}
                            style={styles.recommendationContainer}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={[
                                        styles.recommendation,
                                        { backgroundColor: theme.c2 },
                                    ]}
                                    key={item.id}
                                    onPress={() =>
                                        router.navigate(`/${item.id}`)
                                    }
                                >
                                    <Image
                                        style={styles.thumbnail}
                                        source={{ uri: item.image }}
                                    />
                                    <Text
                                        style={[
                                            styles.name,
                                            {
                                                color: theme.c4,
                                            },
                                        ]}
                                    >
                                        {item.name}
                                    </Text>
                                </Pressable>
                            )}
                            keyExtractor={(item) => item.id.toString()}
                        />
                    </>
                ) : (
                    <>
                        <Text
                            style={[
                                styles.name,
                                {
                                    color: theme.c4,
                                },
                            ]}
                        >
                            Add more dishes to enable recommendations.
                        </Text>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    // Containers
    container: {
        flex: 1,
    },
    scrollViewContainer: {
        alignItems: "center",
    },
    splitContainer: {
        marginVertical: "4%",
        minWidth: "80%",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    recommendationContainer: {
        marginTop: "4%",
        marginBottom: "1%",
        marginHorizontal: 4,
        paddingBottom: "3%",
    },

    heading: {
        fontFamily: "LouisGeorgeCafe",
        fontSize: 24,
    },

    recommendation: {
        marginRight: 10,
        alignItems: "center",
        borderRadius: 10,
        padding: 8,
        paddingBottom: 20,
    },
    thumbnail: {
        width: 120,
        height: 120,
    },
    name: {
        fontFamily: "LouisGeorgeCafe",
        fontSize: 20,
        marginVertical: 4,
        marginBottom: 8,
    },

    button: {
        alignItems: "center",
        justifyContent: "center",
        minWidth: "38%",
        minHeight: "16%",
        borderRadius: 10,
    },
    text: {
        flexWrap: "wrap",
        textAlign: "center",
        fontFamily: "LouisGeorgeCafe",
        fontSize: 20,
    },
});
