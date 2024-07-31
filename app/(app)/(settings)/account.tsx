import { useEffect, useState, useLayoutEffect, useRef } from "react";
import { useNavigation } from "expo-router";

// Components and styles
import { Alert, Pressable as DefaultPressable, StyleSheet } from "react-native";
import {
    Pressable,
    SansSerifText,
    SafeAreaView,
    TextInput,
    View,
} from "@/components/Styled";
import { spacing } from "@/constants/Spacing";

// Contexts
import { useTheme } from "@/contexts/ThemeContext";
import { Account, useAuth } from "@/contexts/AuthContext";

// Icons
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";

export default function DishScreen() {
    const { theme } = useTheme();
    const { onGetAccount, onEditAccount, onDelete } = useAuth();

    const [email, setEmail] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    // const [password, setPassword] = useState("");
    // const [confirmPassword, setConfirmPassword] = useState("");

    // Screen state
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
            editAccount();
        }
    }, [viewMode]);

    useEffect(() => {
        getAccount();
    }, []);

    const getAccount = async () => {
        try {
            const account = await onGetAccount!();
            setEmail(account.email);
            setFirstName(account.firstName);
            setLastName(account.lastName);
        } catch (e) {
            console.error("Unexpected error:", e);
            Alert.alert(
                "Error",
                "An unexpected error occurred. Please try again."
            );
        }
    };

    const editAccount = async () => {
        // Check that all fields are filled
        if (!email || !firstName || !lastName) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }
        const updatedAccount: Account = {
            email: email,
            firstName: firstName,
            lastName: lastName,
        };
        try {
            const result = await onEditAccount!(updatedAccount);
            console.log(result);
        } catch (e) {
            console.error("Unexpected error:", e);
            Alert.alert(
                "Error",
                "An unexpected error occurred. Please try again."
            );
        }
    };

    const onDeletePressed = () => {
        Alert.alert(
            "Are You Sure?",
            "This action is irreversible.",
            [
                {
                    text: "Delete Account",
                    onPress: () => (onDelete || (() => {}))(),
                },
                {
                    text: "Cancel",
                    style: "cancel",
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {viewMode ? (
                <View>
                    <View style={[styles.horizontal, spacing.mt4, spacing.mb4]}>
                        <SansSerifText size="h2">Name:</SansSerifText>
                        <SansSerifText size="h3">{firstName}</SansSerifText>
                        <SansSerifText size="h3">{lastName}</SansSerifText>
                    </View>
                    <View style={styles.horizontal}>
                        <SansSerifText size="h2">Email:</SansSerifText>
                        <SansSerifText size="h3">{email}</SansSerifText>
                    </View>
                </View>
            ) : (
                <View>
                    <View style={[styles.splitInputContainer, spacing.mt4]}>
                        <TextInput
                            autoCapitalize="words"
                            autoComplete="given-name"
                            autoCorrect={false}
                            value={firstName}
                            onChangeText={(text: string) => setFirstName(text)}
                            style={styles.splitInput}
                        />
                        <TextInput
                            autoCapitalize="words"
                            autoComplete="family-name"
                            autoCorrect={false}
                            value={lastName}
                            onChangeText={(text: string) => setLastName(text)}
                            style={styles.splitInput}
                        />
                    </View>
                    <TextInput
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect={false}
                        value={email}
                        onChangeText={(text: string) => setEmail(text)}
                        style={spacing.mt4}
                    />
                </View>
            )}
            <Pressable
                onPress={onDeletePressed}
                style={[spacing.mt4, spacing.mb4]}
            >
                <SansSerifText size="h2" style={{ color: theme.c5 }}>
                    Delete Account
                </SansSerifText>
            </Pressable>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "space-between",
    },
    horizontal: {
        flexDirection: "row",
        gap: 8,
    },
    splitInputContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        minWidth: "80%",
    },
    splitInput: {
        minWidth: "38%",
    },
    switchViewModeButton: {
        marginRight: 8,
    },
});
