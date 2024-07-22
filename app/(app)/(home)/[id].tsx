// Core
import { useEffect, useState, useLayoutEffect, useRef } from "react";

// Api
import axios from "axios";

// Router
import { useNavigation, useLocalSearchParams } from "expo-router";

// Components
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import {
    Alert,
    Dimensions,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import StarRating, { StarIcon } from "react-native-star-rating-widget";

// Contexts
import { useTheme } from "@/contexts/ThemeContext";
import { API_URL } from "@/contexts/AuthContext";

// Icons
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";

export default function DishScreen() {
    // Get id from the search params
    const { id } = useLocalSearchParams<{ id: string }>();
    const dishId = parseInt(id ?? "", 10);

    // States for text input fields
    const [name, setName] = useState<string>("");
    const [image, setImage] = useState<string | null>(null);
    const [cuisine, setCuisine] = useState<string>("");
    const [dateLastMade, setDateLastMade] = useState<string>("j");
    const [rating, setRating] = useState<number>(0);
    const [timeToMake, setTimeToMake] = useState<number>(0);

    // Screen state
    const [loading, setLoading] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<boolean>(true);
    const isFirstRender = useRef(true);

    // Theme
    const { theme } = useTheme();

    // Header
    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerStyle: {
                backgroundColor: theme.c1,
            },
            title: "Dish Information",
            headerTitleStyle: {
                ...styles.title,
                color: theme.c4,
            },
            headerLeft: () => (
                <Pressable onPress={() => navigation.goBack()}>
                    <Text style={{ ...styles.link, color: theme.c5 }}>
                        {/* Replace with an actual icon */}
                        &lt; Back
                    </Text>
                </Pressable>
            ),
            headerRight: () => (
                // Call a function for this
                <Pressable onPress={switchViewMode}>
                    {viewMode ? (
                        <FontAwesome6 name="edit" size={24} color={theme.c5} />
                    ) : (
                        <FontAwesome name="save" size={24} color={theme.c5} />
                    )}
                </Pressable>
            ),
        });
    }, [navigation, theme, viewMode]);

    // Ask the user if they want to take a photo or select from camera roll
    const pickOrTake = async () => {
        Alert.alert(
            "Upload Photo",
            "Choose an option",
            [
                {
                    text: "Take Photo",
                    onPress: () => takePhoto(),
                },
                {
                    text: "Choose from Library",
                    onPress: () => pickImage(),
                },
                {
                    text: "Cancel",
                    style: "cancel",
                },
            ],
            { cancelable: true }
        );
    };

    const pickImage = async () => {
        const permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permission.granted) {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                aspect: [1, 1],
                quality: 1,
                selectionLimit: 1,
                allowsEditing: true,
            });

            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        }
        return;
    };

    const takePhoto = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();

        if (permission.granted) {
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                aspect: [1, 1],
                quality: 1,
                selectionLimit: 1,
                allowsEditing: true,
            });

            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        }
        return;
    };

    // Switch modes and stuff
    const switchViewMode = () => {
        setViewMode(!viewMode);
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (viewMode) {
            editDish();
        }
    }, [viewMode]);

    // Get dish information on page load
    useEffect(() => {
        getDish();
    }, []);

    // Get dish information
    // See if loading state is necessary
    const getDish = async () => {
        setLoading(true);

        try {
            const result = await axios.get(
                `${API_URL}/api/dishes/dishes/${id}/`
            );

            setName(result.data.name);
            setImage(result.data.image);
            setCuisine(result.data.cuisine);
            setDateLastMade(result.data.date_last_made);
            setRating(result.data.rating / 2);
            setTimeToMake(result.data.time_to_make);

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

    const editDish = async () => {
        // Check that fields are filled
        if (!name || !image || !cuisine || !rating || !timeToMake) {
            Alert.alert("Error", "Please fill out all fields");
            return;
        }

        // Check WHAT HAS CHANGED

        // Create formdata object
        let formData = new FormData();

        // Append data
        formData.append("name", name);
        formData.append("cuisine", cuisine);
        if (rating < 1) {
            setRating(2);
        }
        formData.append("rating", (rating * 2).toString());
        if (timeToMake < 1) {
            setTimeToMake(1);
        }
        formData.append("time_to_make", timeToMake.toString());
        formData.append("date_last_made", dateLastMade.toString());

        // Append image
        const uriParts = image.split(".");
        const fileType = uriParts[uriParts.length - 1];
        const fileName = `photo.${fileType}`;
        formData.append("image", {
            uri: image,
            name: fileName,
            type: `image/${fileType}`,
        } as any); // TypeScript compatibility

        console.log(formData);

        try {
            const result = await axios.put(
                `${API_URL}/api/dishes/dishes/${id}/`,
                formData
            );
            console.log(result.status);
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

    const deleteDish = async () => {
        setLoading(true);
        try {
            const result = await axios.delete(
                `${API_URL}/api/dishes/dishes/${id}/`
            );
            console.log(result.data);
            navigation.goBack();
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
        <SafeAreaView style={[styles.container, { backgroundColor: theme.c1 }]}>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                {viewMode ? (
                    <View>
                        <Text style={[styles.name, { color: theme.c4 }]}>
                            {name}
                        </Text>
                    </View>
                ) : (
                    <>
                        <Text
                            style={[
                                styles.text,
                                { color: theme.c4, marginTop: "2%" },
                            ]}
                        >
                            Name
                        </Text>
                        <TextInput
                            value={name}
                            autoCapitalize="words"
                            autoCorrect={false}
                            onChangeText={(text: string) => setName(text)}
                            style={[
                                styles.fullInput,
                                { color: theme.c4, backgroundColor: theme.c2 },
                            ]}
                        />
                    </>
                )}

                {image ? (
                    viewMode ? (
                        <Image
                            style={styles.image}
                            source={{ uri: image }}
                            contentFit="contain"
                        />
                    ) : (
                        <Pressable
                            style={{ marginTop: "4%" }}
                            onPress={pickOrTake}
                        >
                            <View
                                style={{
                                    position: "relative",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Image
                                    style={styles.image}
                                    source={{ uri: image }}
                                    contentFit="contain"
                                />
                                <View
                                    style={[
                                        styles.image,
                                        {
                                            position: "absolute",
                                            backgroundColor:
                                                "rgba(255, 255, 255, 0.5)", // Adjust color and opacity as needed
                                        },
                                    ]}
                                />
                                <FontAwesome6
                                    name="edit"
                                    size={48}
                                    color={theme.c4}
                                    style={{ position: "absolute" }}
                                />
                            </View>
                        </Pressable>
                    )
                ) : null}

                {viewMode ? (
                    <View style={styles.attributeContainer}>
                        <Text style={[styles.text, { color: theme.c4 }]}>
                            Cuisine: {cuisine}
                        </Text>
                    </View>
                ) : (
                    <>
                        <Text
                            style={[
                                styles.text,
                                { color: theme.c4, marginTop: "2%" },
                            ]}
                        >
                            Cuisine
                        </Text>
                        <TextInput
                            value={cuisine}
                            autoCapitalize="words"
                            autoCorrect={false}
                            onChangeText={(text: string) => setCuisine(text)}
                            style={[
                                styles.fullInput,
                                { color: theme.c4, backgroundColor: theme.c2 },
                            ]}
                        />
                    </>
                )}

                {viewMode ? (
                    <View style={styles.attributeContainer}>
                        <Text style={[styles.text, { color: theme.c4 }]}>
                            Last Made: {dateLastMade}
                        </Text>
                    </View>
                ) : null}

                {viewMode ? (
                    <View style={styles.attributeContainer}>
                        <Text
                            style={[
                                styles.text,
                                { color: theme.c4, marginRight: 2 },
                            ]}
                        >
                            Rating: {rating}
                        </Text>
                        <StarIcon
                            index={0}
                            type="full"
                            size={28}
                            color="#fdd835"
                        />
                    </View>
                ) : (
                    <View
                        style={[
                            styles.ratingContainer,
                            { backgroundColor: theme.c2 },
                        ]}
                    >
                        <Text style={[styles.text, { color: theme.c4 }]}>
                            Rating
                        </Text>
                        <StarRating rating={rating} onChange={setRating} />
                    </View>
                )}

                {viewMode ? (
                    <View style={styles.attributeContainer}>
                        <Text
                            style={[
                                styles.text,
                                { color: theme.c4, marginRight: 4 },
                            ]}
                        >
                            Time to Make: {timeToMake}
                        </Text>
                        <FontAwesome6 name="clock" size={24} color={theme.c4} />
                    </View>
                ) : (
                    <View
                        style={[
                            styles.ratingContainer,
                            { backgroundColor: theme.c2 },
                        ]}
                    >
                        <Text style={[styles.text, { color: theme.c4 }]}>
                            Time to Make
                        </Text>
                        <StarRating
                            rating={timeToMake}
                            onChange={setTimeToMake}
                            enableHalfStar={false}
                            color={theme.c4}
                            emptyColor={theme.c3}
                            StarIconComponent={({ color }) => (
                                <FontAwesome6
                                    name="clock"
                                    size={28}
                                    color={color}
                                />
                            )}
                            style={{ marginTop: 5, marginBottom: 2 }}
                            starStyle={{ marginHorizontal: 7 }}
                        />
                    </View>
                )}

                {viewMode ? null : (
                    <Pressable
                        onPress={deleteDish}
                        style={[styles.button, { backgroundColor: theme.c2 }]}
                    >
                        <Text style={[styles.text, { color: theme.c5 }]}>
                            Delete Dish
                        </Text>
                    </Pressable>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const screenWidth = Dimensions.get("window").width;
const imageSize = screenWidth * 0.8;

const styles = StyleSheet.create({
    // Containers
    container: {
        flex: 1,
    },
    scrollViewContainer: {
        alignItems: "center",
    },

    // Header
    title: {
        fontFamily: "LouisGeorgeCafeBold",
        fontSize: 20,
    },
    link: {
        fontFamily: "LouisGeorgeCafe",
        fontSize: 20,
    },

    // Dish
    name: {
        lineHeight: "100%",
        fontFamily: "Adelia",
        fontSize: 36,
    },
    text: {
        // textAlign: "center",
        fontFamily: "LouisGeorgeCafe",
        fontSize: 20,
    },

    ratingContainer: {
        alignItems: "center",
        borderRadius: 10,
        marginTop: "4%",
        minWidth: "80%",
        paddingHorizontal: "3%",
        paddingVertical: "3%",
    },

    attributeContainer: {
        justifyContent: "center",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 10,
        marginTop: "4%",
        minWidth: "80%",
    },

    button: {
        alignItems: "center",
        borderRadius: 10,
        marginVertical: "4%",
        minWidth: "80%",
        paddingHorizontal: "8%",
        paddingVertical: "3%",
    },

    image: {
        width: imageSize,
        height: imageSize,
        borderRadius: 10,
    },

    fullInput: {
        marginTop: "1%",
        minWidth: "80%",
        paddingVertical: "3%",
        paddingHorizontal: "3%",
        borderRadius: 10,
        fontFamily: "LouisGeorgeCafe",
        fontSize: 20,
    },
});
