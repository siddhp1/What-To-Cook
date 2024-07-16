import { useState } from "react";
import axios from "axios";

import { router } from "expo-router";

import {
    View,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    Pressable,
    Alert,
    StyleSheet,
    Dimensions,
} from "react-native";
import StarRating from "react-native-star-rating-widget";

import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";

import { useTheme } from "@/contexts/ThemeContext";

// Get api url from the context
import { API_URL } from "@/contexts/AuthContext";

import { FontAwesome6 } from "@expo/vector-icons";

export default function AddScreen() {
    // Fields
    const [name, setName] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [cuisine, setCuisine] = useState("");
    const [rating, setRating] = useState<number>(0);
    const [timeToMake, setTimeToMake] = useState<number>(0);

    // Api request
    const createDish = async () => {
        // Check that fields are filled
        if (!name || !image || !cuisine || !rating || !timeToMake) {
            Alert.alert("Error", "Please fill out all fields");
            return;
        }

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
        formData.append("date_last_made", new Date().toJSON().slice(0, 10)); // TypeScript compatibility

        // Append image
        const uriParts = image.split(".");
        const fileType = uriParts[uriParts.length - 1];
        const fileName = `photo.${fileType}`;
        formData.append("image", {
            uri: image,
            name: fileName,
            type: `image/${fileType}`,
        } as any); // TypeScript compatibility

        try {
            const result = await axios.post(`${API_URL}/api/dishes/`, formData);
            console.log(result.status);
            router.back();
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

    // Theme
    const { theme } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.c1 }]}>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <TextInput
                    placeholder="Name of Dish"
                    placeholderTextColor={theme.c3}
                    autoCapitalize="words"
                    autoCorrect={false}
                    onChangeText={(text: string) => setName(text)}
                    style={[
                        styles.fullInput,
                        { color: theme.c4, backgroundColor: theme.c2 },
                    ]}
                />
                {/* Image */}
                {/* Conditionally render image */}
                {image && (
                    <Image
                        style={styles.image}
                        source={{ uri: image }}
                        contentFit="contain"
                    />
                )}
                <Pressable
                    onPress={pickOrTake}
                    style={[styles.button, { backgroundColor: theme.c2 }]}
                >
                    <Text style={[styles.text, { color: theme.c5 }]}>
                        {/* Change text depending on whether or not there already is an image */}
                        {image ? "Change Image" : "Add Image"}
                    </Text>
                </Pressable>

                <TextInput
                    placeholder="Cuisine"
                    placeholderTextColor={theme.c3}
                    autoCapitalize="words"
                    autoCorrect={false}
                    onChangeText={(text: string) => setCuisine(text)}
                    style={[
                        styles.fullInput,
                        { color: theme.c4, backgroundColor: theme.c2 },
                    ]}
                />

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

                <View
                    style={[
                        styles.ratingContainer,
                        { backgroundColor: theme.c2 },
                    ]}
                >
                    <Text style={[styles.text, { color: theme.c4 }]}>
                        Time to Cook
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

                <Pressable
                    onPress={createDish}
                    style={[
                        styles.button,
                        { backgroundColor: theme.c2, marginBottom: "4%" },
                    ]}
                >
                    <Text style={[styles.text, { color: theme.c5 }]}>
                        Add Dish
                    </Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

const screenWidth = Dimensions.get("window").width;
const imageSize = screenWidth * 0.8;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollViewContainer: {
        alignItems: "center",
    },
    ratingContainer: {
        minWidth: "80%",
        alignItems: "center",
        marginTop: "4%",
        paddingVertical: "3%",
        paddingHorizontal: "3%",
        borderRadius: 10,
    },
    text: {
        textAlign: "center",
        fontFamily: "LouisGeorgeCafe",
        fontSize: 20,
    },
    button: {
        marginTop: "4%",
        minWidth: "80%",
        paddingVertical: "3%",
        paddingHorizontal: "8%",
        borderRadius: 10,
    },
    image: {
        marginTop: "4%",
        width: imageSize,
        height: imageSize,
        borderRadius: 10,
    },
    fullInput: {
        marginTop: "4%",
        minWidth: "80%",
        paddingVertical: "3%",
        paddingHorizontal: "3%",
        borderRadius: 10,
        fontFamily: "LouisGeorgeCafe",
        fontSize: 20,
    },
});
