import { useEffect, useState } from "react";

import { Text, View, StyleSheet, SafeAreaView } from "react-native";

import axios from "axios";

import { Image } from "expo-image";

import { useTheme } from "@/contexts/ThemeContext";
import { API_URL } from "@/contexts/AuthContext";

type Dish = {
    id: number;
    name: string;
    cuisine: string;
    rating: string;
    date_last_made: string;
    image: string;
};

export default function SearchScreen() {
    const [dishes, setDishes] = useState<Dish[]>([]);

    useEffect(() => {
        const getDishes = async () => {
            try {
                const result = await axios.get(`${API_URL}/api/dishes/`);
                console.log(result.status);
                console.log(result.data);
                setDishes(result.data);
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
            }
        };
        getDishes();
    }, []);

    const { theme } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.c1 }]}>
            <Text
                style={[
                    styles.heading,
                    {
                        color: theme.c4,
                    },
                ]}
            >
                Here's Everything You Have Ever Made.
            </Text>

            {/* List of dishes here, no pagination yet */}
            {dishes
                ? dishes.map((dish: Dish, index: number) => (
                      <View
                          style={[
                              styles.dishContainer,
                              { backgroundColor: theme.c2 },
                          ]}
                          key={index}
                      >
                          <Image style={styles.thumbnail} source={dish.image} />
                          <View style={{}}>
                              <Text
                                  style={[
                                      styles.heading,
                                      {
                                          color: theme.c4,
                                      },
                                  ]}
                              >
                                  {dish.name}
                              </Text>
                              <Text
                                  style={[
                                      styles.heading,
                                      {
                                          color: theme.c4,
                                      },
                                  ]}
                              >
                                  {dish.cuisine}
                              </Text>
                              <Text
                                  style={[
                                      styles.heading,
                                      {
                                          color: theme.c4,
                                      },
                                  ]}
                              >
                                  {dish.date_last_made}
                              </Text>
                          </View>
                      </View>
                  ))
                : null}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    heading: {
        fontFamily: "LouisGeorgeCafe",
        fontSize: 24,
    },
    dishContainer: {
        marginBottom: "4%",
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
        borderRadius: 10,
        minWidth: "80%",
    },
    thumbnail: {
        width: 100,
        height: 100,
    },
});
