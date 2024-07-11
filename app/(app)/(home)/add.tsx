import { View, Text, StyleSheet } from "react-native";

// Screen to add a dish
export default function AddScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add Dish Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        color: "#ffffff",
        fontFamily: "GaMaamli",
        fontSize: 20,
        fontWeight: "bold",
    },
});
