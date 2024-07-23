import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { router, useFocusEffect } from "expo-router";

// Components and styles
import {
    FlatList,
    Pressable as DefaultPressable,
    StyleSheet,
} from "react-native";
import {
    Image,
    Pressable,
    SansSerifText,
    SafeAreaView,
    ScrollView,
    View,
} from "@/components/Styled";
import { spacing } from "@/constants/Spacing";

// Icons
import { Feather } from "@expo/vector-icons";

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

export default function HomeScreen() {
    const { theme } = useTheme();

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

    interface RecommendationListProps {
        data: Dish[];
    }

    const RecommendationList = ({ data }: RecommendationListProps) => {
        return (
            <FlatList
                horizontal={true}
                data={data}
                style={[
                    styles.recommendationContainer,
                    spacing.mt2,
                    spacing.mb2,
                ]}
                renderItem={({ item }) => (
                    <DefaultPressable
                        style={[
                            styles.recommendation,
                            { backgroundColor: theme.c2 },
                        ]}
                        key={item.id}
                        onPress={() => router.navigate(`/${item.id}`)}
                    >
                        <Image
                            style={styles.image}
                            source={{ uri: item.image }}
                        />
                        <SansSerifText size="h3">{item.name}</SansSerifText>
                    </DefaultPressable>
                )}
                keyExtractor={(item) => item.id.toString()}
            />
        );
    };

    return (
        <SafeAreaView>
            <ScrollView>
                <SansSerifText size="h1">Made Something Today?</SansSerifText>
                <View
                    style={[
                        styles.addButtonContainer,
                        spacing.mt2,
                        spacing.mb4,
                    ]}
                >
                    <Pressable
                        onPress={() => router.push("/add")}
                        style={styles.addButton}
                    >
                        <Feather name="plus" size={36} color={theme.c3} />
                        <SansSerifText size="h3" style={{ color: theme.c5 }}>
                            New Dish
                        </SansSerifText>
                    </Pressable>
                    <Pressable
                        onPress={() => router.push("/add-existing")}
                        style={styles.addButton}
                    >
                        <Feather
                            name="refresh-ccw"
                            size={36}
                            color={theme.c3}
                        />
                        <SansSerifText size="h3" style={{ color: theme.c5 }}>
                            Existing Dish
                        </SansSerifText>
                    </Pressable>
                </View>
                {quickDishes.length > 0 && favoriteDishes.length > 0 ? (
                    <>
                        <SansSerifText size="h1">Quick and Easy</SansSerifText>
                        <RecommendationList data={quickDishes} />
                        <SansSerifText size="h1">
                            Hasn't Been Made in a While
                        </SansSerifText>
                        <RecommendationList data={oldestDishes} />
                        <SansSerifText size="h1">Your Favourites</SansSerifText>
                        <RecommendationList data={favoriteDishes} />
                    </>
                ) : (
                    <>
                        <SansSerifText size="h3" style={styles.addMoreText}>
                            Add more dishes to enable recommendations.
                        </SansSerifText>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    addButtonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        minWidth: "80%",
    },
    addButton: {
        minWidth: "38%",
        paddingVertical: "10%",
    },
    recommendationContainer: {
        marginHorizontal: "1%",
        paddingBottom: 10,
    },
    recommendation: {
        alignItems: "center",
        marginRight: 4,
        borderRadius: 10,
        padding: 4,
    },
    image: {
        width: 120,
        height: 120,
    },
    addMoreText: {
        textAlign: "center",
    },
});
