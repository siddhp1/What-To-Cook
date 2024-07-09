import { View, Text, StyleSheet } from "react-native";

export default function SettingsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.content}>Settings</Text>
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
    content: {
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
