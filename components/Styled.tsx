import { useState } from "react";

// Components
import {
    Text as DefaultText,
    Pressable as DefaultPressable,
    PressableProps as DefaultPressableProps,
    PressableStateCallbackType,
    TextInput as DefaultTextInput,
    TextInputProps as DefaultTextInputProps,
    SafeAreaView as DefaultSafeAreaView,
    ScrollView as DefaultScrollView,
    View as DefaultView,
    StyleProp,
    ViewStyle,
    TextStyle,
} from "react-native";
import {
    Image as DefaultImage,
    ImageProps as DefaultImageProps,
} from "expo-image";

// Contexts
import { useTheme } from "@/contexts/ThemeContext";

// ----- TEXT -----
type SansSerifTextSize = "h1" | "h2" | "h3" | "h4" | "p";
type SerifTextSize = "h1" | "h2" | "h3";

export type TextProps = DefaultText["props"];

interface ExtendedSansSerifTextProps extends TextProps {
    size?: SansSerifTextSize;
}
interface ExtendedSerifTextProps extends TextProps {
    size?: SerifTextSize;
}

const sansSerifTextStyles = {
    h1: { fontSize: 24, fontFamily: "LouisGeorgeCafe" },
    h2: { fontSize: 20, fontFamily: "LouisGeorgeCafeBold" },
    h3: { fontSize: 20, fontFamily: "LouisGeorgeCafe" },
    h4: { fontSize: 18, fontFamily: "LouisGeorgeCafeBold" },
    p: { fontSize: 10, fontFamily: "LouisGeorgeCafe" },
};

const serifTextStyles = {
    h1: { fontSize: 40, fontFamily: "Adelia", lineHeight: "100%" },
    h2: { fontSize: 36, fontFamily: "Adelia", lineHeight: "100%" },
    h3: { fontSize: 20, fontFamily: "Adelia", lineHeight: 40 },
};

export function SansSerifText(props: ExtendedSansSerifTextProps) {
    const { theme } = useTheme();
    const { style, size, ...otherProps } = props;
    const sizeStyle = size ? sansSerifTextStyles[size] : {};

    return (
        <DefaultText
            style={[{ color: theme.c4 }, sizeStyle, style]}
            {...otherProps}
        />
    );
}

export function SerifText(props: ExtendedSerifTextProps) {
    const { theme } = useTheme();
    const { style, size, ...otherProps } = props;
    const sizeStyle = size ? serifTextStyles[size] : {};

    return (
        <DefaultText
            style={[{ color: theme.c4 }, sizeStyle, style]}
            {...otherProps}
        />
    );
}

// ----- IMAGE -----
export function Image(props: DefaultImageProps) {
    const { style, ...otherProps } = props;
    return (
        <DefaultImage style={[{ borderRadius: 10 }, style]} {...otherProps} />
    );
}

// ----- INPUT -----
export type PressableProps = DefaultPressableProps & {
    style?:
        | StyleProp<ViewStyle>
        | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>);
};

export function Pressable(props: PressableProps) {
    const { style, ...otherProps } = props;
    const { theme } = useTheme();

    return (
        <DefaultPressable
            style={
                ((state: PressableStateCallbackType) => [
                    {
                        backgroundColor: theme.c2,
                        minWidth: "80%",
                        paddingVertical: "3%",
                        paddingHorizontal: "3%",
                        borderRadius: 10,
                        alignItems: "center",
                    },
                    typeof style === "function" ? style(state) : style,
                ]) as StyleProp<ViewStyle>
            }
            {...otherProps}
        />
    );
}

export type TextInputProps = DefaultTextInputProps & {
    style?:
        | StyleProp<TextStyle>
        | ((state: { focused: boolean }) => StyleProp<TextStyle>);
};

export function TextInput(props: TextInputProps) {
    const { style, onFocus, onBlur, ...otherProps } = props;
    const { theme } = useTheme();
    const [focused, setFocused] = useState(false);

    const handleFocus = (e: any) => {
        setFocused(true);
        if (onFocus) {
            onFocus(e);
        }
    };

    const handleBlur = (e: any) => {
        setFocused(false);
        if (onBlur) {
            onBlur(e);
        }
    };

    const resolvedStyle =
        typeof style === "function" ? style({ focused }) : style;

    return (
        <DefaultTextInput
            style={[
                {
                    fontFamily: "LouisGeorgeCafe",
                    fontSize: 20,
                    color: theme.c4,
                    borderRadius: 10,
                    backgroundColor: theme.c2,
                    minWidth: "80%",
                    paddingVertical: "3%",
                    paddingHorizontal: "3%",
                },
                resolvedStyle,
            ]}
            placeholderTextColor={theme.c3}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...otherProps}
        />
    );
}

// ----- VIEWS -----
export type SafeAreaViewProps = DefaultSafeAreaView["props"];
export type ScrollViewProps = DefaultScrollView["props"];
export type ViewProps = DefaultView["props"];

export function SafeAreaView(props: ViewProps) {
    const { style, ...otherProps } = props;
    const { theme } = useTheme();

    return (
        <DefaultSafeAreaView
            style={[
                { flex: 1, alignItems: "center", backgroundColor: theme.c1 },
                style,
            ]}
            {...otherProps}
        />
    );
}

export function ScrollView(props: ViewProps) {
    const { style, ...otherProps } = props;
    return (
        <DefaultScrollView
            style={style}
            contentContainerStyle={{ alignItems: "center", minWidth: "100%" }}
            {...otherProps}
        />
    );
}

// Look at this one after
export function View(props: ViewProps) {
    const { style, ...otherProps } = props;
    return <DefaultView style={style} {...otherProps} />;
}
