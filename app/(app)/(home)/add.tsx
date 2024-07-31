import { useState } from "react";
import { router } from "expo-router";

// Components and styles
import {
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
} from "react-native";
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
import { useTheme } from "@/contexts/ThemeContext";
import { useDishes } from "@/contexts/DishContext";

export default function AddScreen() {
    const { theme } = useTheme();
    const { onAddDish } = useDishes();

    const [name, setName] = useState<string>("");
    const [image, setImage] = useState<string | null>(null);
    const [cuisine, setCuisine] = useState<string>("");
    const [rating, setRating] = useState<number>(0);
    const [timeToMake, setTimeToMake] = useState<number>(0);

    const createDish = async () => {
        // Check that fields are filled
        if (!name || !image || !cuisine || !rating || !timeToMake) {
            Alert.alert("Error", "Please fill out all fields");
            return;
        }

        const newDish = {
            name: name,
            image: image,
            cuisine: cuisine,
            rating: rating,
            time_to_make: timeToMake,
        };

        try {
            const result = await onAddDish!(newDish);
            console.log(result.status);
            router.back();
        } catch (e) {
            console.error("Unexpected error:", e);
            Alert.alert(
                "Error",
                "An unexpected error occurred. Please try again."
            );
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
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
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
                        style={[spacing.mt4, spacing.mb4]}
                    >
                        <SansSerifText size="h2" style={{ color: theme.c5 }}>
                            Add Dish
                        </SansSerifText>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
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
