import { Text, View, StyleSheet } from "react-native";

export default function SearchScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tab Two (All foods)</Text>
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
