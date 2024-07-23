import { useState } from "react";
import axios from "axios";
import { router } from "expo-router";

// Components and styles
import { Alert, Dimensions, StyleSheet } from "react-native";
import StarRating from "react-native-star-rating-widget";
import {
    Pressable,
    Image,
    SansSerifText,
    SafeAreaView,
    ScrollView,
    TextInput,
    View,
} from "@/components/Styled";
import { pickOrTake } from "@/components/ImagePicker";
import { spacing } from "@/constants/Spacing";

// Icons
import { FontAwesome6 } from "@expo/vector-icons";

// Contexts
import { API_URL } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function AddScreen() {
    const { theme } = useTheme();

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
            const result = await axios.post(
                `${API_URL}/api/dishes/dishes/`,
                formData
            );
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

    const imagePickerHandler = async () => {
        const uri = await pickOrTake();
        if (uri) {
            setImage(uri);
        }
    };

    return (
        <SafeAreaView>
            <ScrollView>
                <TextInput
                    placeholder="Name of Dish"
                    autoCapitalize="words"
                    autoCorrect={false}
                    onChangeText={(text: string) => setName(text)}
                    style={spacing.mt4}
                />
                {image && (
                    <Image
                        style={[styles.image, spacing.mt4]}
                        source={{ uri: image }}
                    />
                )}
                <Pressable onPress={imagePickerHandler} style={spacing.mt4}>
                    <SansSerifText size="h3" style={{ color: theme.c5 }}>
                        {image ? "Change Image" : "Add Image"}
                    </SansSerifText>
                </Pressable>
                <TextInput
                    placeholder="Cuisine"
                    autoCapitalize="words"
                    autoCorrect={false}
                    onChangeText={(text: string) => setCuisine(text)}
                    style={spacing.mt4}
                />
                <View
                    style={[
                        styles.ratingContainer,
                        spacing.mt4,
                        { backgroundColor: theme.c2 },
                    ]}
                >
                    <SansSerifText size="h3">Rating</SansSerifText>
                    <StarRating
                        rating={rating}
                        onChange={setRating}
                        color={theme.c6}
                    />
                </View>
                <View
                    style={[
                        styles.ratingContainer,
                        spacing.mt4,
                        { backgroundColor: theme.c2 },
                    ]}
                >
                    <SansSerifText size="h3">Time to Cook</SansSerifText>
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
                    style={[spacing.mt4, spacing.mt4]}
                >
                    <SansSerifText size="h2" style={{ color: theme.c5 }}>
                        Add Dish
                    </SansSerifText>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

const screenWidth = Dimensions.get("window").width;
const imageSize = screenWidth * 0.8;

const styles = StyleSheet.create({
    image: {
        width: imageSize,
        height: imageSize,
    },
    ratingContainer: {
        alignItems: "center",
        borderRadius: 10,
        minWidth: "80%",
        paddingHorizontal: "3%",
        paddingVertical: "3%",
    },
});
