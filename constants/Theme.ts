import {
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";

const LightTheme = {
    ...NavigationDefaultTheme.colors,
    c1: "#FFFCF2",
    c2: "#CCC5B9",
    c3: "#403D39",
    c4: "#252422",
    c5: "#c44536",
    c6: "#fdd835",
};

const DarkTheme = {
    ...NavigationDarkTheme.colors,
    c1: "#252422",
    c2: "#403D39",
    c3: "#CCC5B9",
    c4: "#FFFCF2",
    c5: "#c44536",
    c6: "#fdd835",
};

export { LightTheme, DarkTheme };
