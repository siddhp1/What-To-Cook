import { useEffect, useState, useLayoutEffect, useRef } from "react";
import { useNavigation, useLocalSearchParams } from "expo-router";

// Components and styles
import {
    Alert,
    Dimensions,
    StyleSheet,
    Pressable as DefaultPressable,
} from "react-native";
import StarRating from "react-native-star-rating-widget";
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
import { pickOrTake } from "@/components/ImagePicker";
import { spacing } from "@/constants/Spacing";

// Contexts
import { useTheme } from "@/contexts/ThemeContext";
import { useDishes } from "@/contexts/DishContext";

// Icons
import { StarIcon } from "react-native-star-rating-widget";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";

export default function DishScreen() {
    const { theme } = useTheme();
    const { onGetDish, onEditDish, onDeleteDish } = useDishes();

    const { id } = useLocalSearchParams<{ id: string }>();
    const dishId = parseInt(id ?? "", 10);

    // States for text input fields
    const [name, setName] = useState<string>("");
    const [image, setImage] = useState<string | null>(null);
    const [cuisine, setCuisine] = useState<string>("");
    const [dateLastMade, setDateLastMade] = useState<string>("");
    const [rating, setRating] = useState<number>(0);
    const [timeToMake, setTimeToMake] = useState<number>(0);

    // Screen state
    const [loading, setLoading] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<boolean>(true);
    const isFirstRender = useRef(true);

    // Customize header for this page
    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <DefaultPressable
                    onPress={switchViewMode}
                    style={styles.switchViewModeButton}
                >
                    {viewMode ? (
                        <FontAwesome6 name="edit" size={22} color={theme.c5} />
                    ) : (
                        <FontAwesome name="save" size={22} color={theme.c5} />
                    )}
                </DefaultPressable>
            ),
        });
    }, [navigation, viewMode]);

    const imagePickerHandler = async () => {
        const uri = await pickOrTake();
        if (uri) {
            setImage(uri);
        }
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

    useEffect(() => {
        const getDishes = async () => {
            try {
                const dish = await onGetDish!(dishId);
                if (dish) {
                    setName(dish.name);
                    setImage(dish.image);
                    setCuisine(dish.cuisine);
                    setDateLastMade(dish.date_last_made);
                    setRating(dish.rating / 2);
                    setTimeToMake(dish.time_to_make);
                }
            } catch (e) {
                console.error("Unexpected error:", e);
                Alert.alert(
                    "Error",
                    "An unexpected error occurred. Please try again."
                );
            }
        };
        getDishes();
    }, []);

    const editDish = async () => {
        // CURRENTLY SENDING ALL INFORMATION AGAIN, CHANGE LATER

        const modifiedDish = {
            id: dishId,
            image: image ?? undefined,
            name: name,
            cuisine: cuisine,
            rating: rating,
            time_to_make: timeToMake,
        };

        try {
            const result = await onEditDish!(modifiedDish);
            console.log(result);
        } catch (e) {
            console.error("Unexpected error:", e);
            Alert.alert(
                "Error",
                "An unexpected error occurred. Please try again."
            );
        }
    };

    const deleteDish = async () => {
        try {
            const result = await onDeleteDish!(dishId);
            console.log(result.status);
            navigation.goBack();
        } catch (e) {
            console.error("Unexpected error:", e);
            Alert.alert(
                "Error",
                "An unexpected error occurred. Please try again."
            );
        }
    };

    return (
        <SafeAreaView>
            <ScrollView>
                {viewMode ? (
                    <>
                        <View>
                            <SerifText size="h2">{name}</SerifText>
                        </View>
                        {image && (
                            <Image
                                style={styles.image}
                                source={{ uri: image }}
                            />
                        )}
                        <View style={[styles.attributeContainer, spacing.mt4]}>
                            <SansSerifText size="h3">
                                Cuisine: {cuisine}
                            </SansSerifText>
                        </View>
                        <View style={[styles.attributeContainer, spacing.mt4]}>
                            <SansSerifText size="h3">
                                Last Made: {dateLastMade}
                            </SansSerifText>
                        </View>
                        <View style={[styles.attributeContainer, spacing.mt4]}>
                            <SansSerifText
                                size="h3"
                                style={styles.attributeText}
                            >
                                Rating: {rating}
                            </SansSerifText>
                            <StarIcon
                                index={0}
                                type="full"
                                size={28}
                                color={theme.c6}
                            />
                        </View>
                        <View
                            style={[
                                styles.attributeContainer,
                                spacing.mt4,
                                spacing.mb4,
                            ]}
                        >
                            <SansSerifText
                                size="h3"
                                style={styles.attributeText}
                            >
                                Time to Make: {timeToMake}
                            </SansSerifText>
                            <FontAwesome6
                                name="clock"
                                size={24}
                                color={theme.c4}
                            />
                        </View>
                    </>
                ) : (
                    <>
                        <SansSerifText
                            size="h3"
                            style={[spacing.mt2, spacing.mb1]}
                        >
                            Name
                        </SansSerifText>
                        <TextInput
                            value={name}
                            autoCapitalize="words"
                            autoCorrect={false}
                            onChangeText={(text: string) => setName(text)}
                        />
                        {image && (
                            <Pressable
                                style={[styles.imageButton, spacing.mt4]}
                                onPress={imagePickerHandler}
                            >
                                <View style={styles.imageContainer}>
                                    <Image
                                        style={styles.image}
                                        source={{ uri: image }}
                                    />
                                    <View
                                        style={[
                                            styles.imageOverlay,
                                            styles.image,
                                        ]}
                                    />
                                    <FontAwesome6
                                        name="edit"
                                        size={48}
                                        color={theme.c5}
                                        style={styles.imageEditIcon}
                                    />
                                </View>
                            </Pressable>
                        )}
                        <SansSerifText
                            size="h3"
                            style={[spacing.mt2, spacing.mb1]}
                        >
                            Cuisine
                        </SansSerifText>
                        <TextInput
                            value={cuisine}
                            autoCapitalize="words"
                            autoCorrect={false}
                            onChangeText={(text: string) => setCuisine(text)}
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
                            <SansSerifText size="h3">
                                Time to Make
                            </SansSerifText>
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
                                style={styles.starRatingStyle}
                                starStyle={styles.starStyle}
                            />
                        </View>
                        <Pressable
                            onPress={deleteDish}
                            style={[spacing.mt4, spacing.mb4]}
                        >
                            <SansSerifText
                                size="h3"
                                style={{ color: theme.c5 }}
                            >
                                Delete Dish
                            </SansSerifText>
                        </Pressable>
                    </>
                )}
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
    imageButton: {
        paddingHorizontal: 0,
        paddingVertical: 0,
    },
    imageContainer: {
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
    },
    imageOverlay: {
        position: "absolute",
        borderRadius: 10,
        backgroundColor: "rgba(255, 255, 255, 0.5)",
    },
    imageEditIcon: {
        position: "absolute",
    },
    ratingContainer: {
        alignItems: "center",
        borderRadius: 10,
        minWidth: "80%",
        paddingHorizontal: "3%",
        paddingVertical: "3%",
    },
    starRatingStyle: {
        marginTop: 5,
        marginBottom: 2,
    },
    starStyle: {
        marginHorizontal: 7,
    },
    attributeContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        minWidth: "80%",
    },
    // FIX THIS AT SOME POINT
    attributeText: {
        marginRight: 8,
    },
    switchViewModeButton: {
        marginRight: 8,
    },
});
