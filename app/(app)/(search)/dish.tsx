import { Text, View, StyleSheet } from "react-native";

// This screen (or maybe it will get replaced with a modal, will show all of the information for a dish)
export default function DishScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Individual Dish Screen</Text>
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
        fontSize: 20,
        fontWeight: "bold",
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: "80%",
    },
});
