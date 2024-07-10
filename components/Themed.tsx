// Default components
import {
    Text as DefaultText,
    View as DefaultView,
    SafeAreaView as DefaultSafeAreaView,
    StyleSheet,
} from "react-native";

// Color imports
import Colors from "@/constants/Colors";
import { useColorScheme } from "../hooks/useColorScheme";

// Props
type ThemeProps = {
    lightColor?: string;
    darkColor?: string;
};
export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];
export type SafeAreaViewProps = ThemeProps & DefaultView["props"];

export function useThemeColor(
    props: { light?: string; dark?: string },
    colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
    const theme = useColorScheme() ?? "light";
    const colorFromProps = props[theme];

    if (colorFromProps) {
        return colorFromProps;
    } else {
        return Colors[theme][colorName];
    }
}

// Define styles for different text types
const typeStyles = StyleSheet.create({
    h1: {
        fontSize: 40,
        fontFamily: "adelia",
        lineHeight: "100%",
    },
    h2: {
        fontSize: 28,
        fontFamily: "louisgeorgecafe",
    },
    h3: {
        fontSize: 24,
        fontFamily: "louisgeorgecafe",
    },
    h4: {
        fontSize: 20,
        fontFamily: "louisgeorgecafe",
    },
    // Add more styles as needed
});

// Extend TextProps to include the type prop
interface ExtendedTextProps extends TextProps {
    type?: keyof typeof typeStyles;
}

// Custom components
export function View(props: ViewProps) {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const backgroundColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "background"
    );
    return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function SafeAreaView(props: SafeAreaViewProps) {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const backgroundColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "background"
    );
    return (
        <DefaultSafeAreaView
            style={[{ backgroundColor }, style]}
            {...otherProps}
        />
    );
}

export function Text(props: ExtendedTextProps) {
    const { style, lightColor, darkColor, type, ...otherProps } = props;
    const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
    const textStyle = [type ? typeStyles[type] : {}, { color }, style]; // Combine type style, color, and custom style

    return <DefaultText style={textStyle} {...otherProps} />;
}

// Add more components as we go
// PRESSABLE
