import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { LightTheme, DarkTheme } from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";

// Create a context for themes
type ThemeContextType = {
    theme: typeof LightTheme | typeof DarkTheme;
};

const ThemeContext = createContext<ThemeContextType>({
    theme: LightTheme,
});

// Custom Theme Provider component
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const colorScheme = useColorScheme();

    // Set theme to current color scheme
    const [theme, setTheme] = useState(
        colorScheme === "dark" ? DarkTheme : LightTheme
    );

    // Update theme if color scheme changes
    useEffect(() => {
        setTheme(colorScheme === "dark" ? DarkTheme : LightTheme);
    }, [colorScheme]);

    return (
        <ThemeContext.Provider value={{ theme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom useTheme hook to access the current theme
export const useTheme = () => useContext(ThemeContext);
