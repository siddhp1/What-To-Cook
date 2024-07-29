import { useCallback, useEffect, useState } from "react";
import { router, useFocusEffect } from "expo-router";

// Components and styles
import {
    Alert,
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
import { useDishes } from "@/contexts/DishContext";

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
    const { onGetRecommendations } = useDishes();

    const [quickDishes, setQuickDishes] = useState<Dish[]>([]);
    const [favoriteDishes, setFavoriteDishes] = useState<Dish[]>([]);
    const [oldestDishes, setOldestDishes] = useState<Dish[]>([]);

    // Refresh the page upon coming back, should be fine
    const refreshPage = useCallback(() => {
        getRecommendations();
    }, []);

    useFocusEffect(
        useCallback(() => {
            refreshPage();
            return () => {
                // Optional cleanup if needed
            };
        }, [refreshPage])
    );

    const getRecommendations = async () => {
        try {
            const dishes = await onGetRecommendations!();
            setFavoriteDishes(dishes.data.favoriteDishes);
            setQuickDishes(dishes.data.quickDishes);
            setOldestDishes(dishes.data.oldestDishes);
        } catch (e) {
            console.error("Unexpected error:", e);
            Alert.alert(
                "Error",
                "An unexpected error occurred. Please try again."
            );
        }
    };

    useEffect(() => {
        getRecommendations();
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
