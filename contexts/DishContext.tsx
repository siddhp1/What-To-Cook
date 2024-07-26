import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useAuth } from "./AuthContext";

export type Dish = {
    id: number;
    name: string;
    cuisine: string;
    rating: number;
    time_to_make: number;
    date_last_made: string;
    image: string;
};

interface DishProps {
    dishes?: Dish[];
    loading?: boolean;

    // Add functions here
    onAddDish?: (
        name: string,
        cuisine: string,
        rating: number,
        time_to_make: number,
        image: string
    ) => Promise<any>;
    onGetDish?: (id: number) => Promise<Dish | null>;
    onGetDishes?: (searchTerm: string, sortOrder: number) => Promise<Dish[]>;
    onEditDish?: (dish: Partial<Dish>) => Promise<any>;
    onDeleteDish?: (id: number) => Promise<any>;
}

const DISHES_KEY = "@dishes";
const IMAGE_DIR = FileSystem.documentDirectory + "images/";
import { API_URL } from "./AuthContext";

const DishContext = createContext<DishProps>({});

export const DishProvider = ({ children }: { children: ReactNode }) => {
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Add Dish // Image (CREATE)

    // MAYBE CONVERT THIS INTO PASSING IN ONE PARTIAL DISH
    const addDish = async (
        name: string,
        cuisine: string,
        rating: number,
        timeToMake: number,
        image: string
    ) => {
        let formData = new FormData();

        // Append data
        formData.append("name", name);
        formData.append("cuisine", cuisine);
        if (rating < 1) {
            rating = 2;
        }
        formData.append("rating", (rating * 2).toString());
        if (timeToMake < 1) {
            timeToMake = 1;
        }
        formData.append("time_to_make", timeToMake.toString());
        formData.append("date_last_made", new Date().toJSON().slice(0, 10));

        // Append image
        const uriParts = image.split(".");
        const fileType = uriParts[uriParts.length - 1];
        const fileName = `photo.${fileType}`;
        formData.append("image", {
            uri: image,
            name: fileName,
            type: `image/${fileType}`,
        } as any);

        try {
            const result = await axios.post(
                `${API_URL}/api/dishes/dishes/`,
                formData
            );

            const {
                id,
                name,
                cuisine,
                rating,
                time_to_make,
                date_last_made,
                image,
            } = result.data;

            const newDish: Dish = {
                id,
                name,
                cuisine,
                rating,
                time_to_make,
                date_last_made,
                image,
            };

            // add to context
            setDishes([...dishes, newDish]);
            return {
                status: result.status,
            };
        } catch (e) {
            if (axios.isAxiosError(e) && e.response) {
                return {
                    error: true,
                    status: e.response.status,
                    data: e.response.data || "An error occurred.",
                };
            } else {
                return {
                    error: true,
                    status: null,
                    data: "An unexpected error occurred.",
                };
            }
        }

        // Add to local storage
        // Add image to file system
    };

    // Get Dish/Dishes // Image (READ)
    const getDishes = async (searchTerm: string, sortOrder: number) => {
        try {
            // Assuming `dishes` is an array of dish objects available in the context
            let filteredDishes = dishes;

            // Filter dishes based on searchTerm
            if (searchTerm) {
                const lowerCaseSearchTerm = searchTerm.toLowerCase();
                filteredDishes = filteredDishes.filter(
                    (dish) =>
                        dish.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                        dish.cuisine.toLowerCase().includes(lowerCaseSearchTerm)
                );
            }

            // Determine the ordering based on sortOrder
            const getOrderingFunction = (
                key: string,
                isDescending: boolean = false
            ) => {
                return (a: any, b: any) => {
                    if (a[key] < b[key]) return isDescending ? 1 : -1;
                    if (a[key] > b[key]) return isDescending ? -1 : 1;
                    return 0;
                };
            };

            switch (sortOrder) {
                case 0:
                    filteredDishes.sort(
                        getOrderingFunction("date_last_made", true)
                    );
                    break;
                case 1:
                    filteredDishes.sort(getOrderingFunction("date_last_made"));
                    break;
                case 2:
                    filteredDishes.sort(getOrderingFunction("cuisine"));
                    break;
                case 3:
                    filteredDishes.sort(getOrderingFunction("cuisine", true));
                    break;
                case 4:
                    filteredDishes.sort(getOrderingFunction("name"));
                    break;
                case 5:
                    filteredDishes.sort(getOrderingFunction("name", true));
                    break;
                default:
                    filteredDishes.sort(
                        getOrderingFunction("date_last_made", true)
                    );
                    break;
            }

            return filteredDishes;
        } catch (error) {
            console.error("Error processing dishes:", error);
            return [];
        }
    };
    const getDish = async (id: number): Promise<Dish | null> => {
        if (!dishes || dishes.length === 0) {
            return null;
        }
        const dish = dishes.find((dish) => dish.id === id);
        return dish || null;
    };

    // Edit Dish // Image (UPDATE)
    const editDish = async (dish: Partial<Dish>) => {
        // Convert to formdata here
        let formData = new FormData();

        // Append data
        if (dish.name) formData.append("name", dish.name);
        if (dish.cuisine) formData.append("cuisine", dish.cuisine);
        if (dish.rating !== undefined) {
            let rating = dish.rating < 1 ? 2 : dish.rating * 2;
            formData.append("rating", rating.toString());
        }
        if (dish.time_to_make !== undefined) {
            let timeToMake = dish.time_to_make < 1 ? 1 : dish.time_to_make;
            formData.append("time_to_make", timeToMake.toString());
        }
        if (dish.date_last_made) {
            formData.append("date_last_made", dish.date_last_made);
        } else {
            formData.append(
                "date_last_made",
                new Date().toISOString().slice(0, 10)
            );
        }

        // Append image if it exists
        if (dish.image) {
            const uriParts = dish.image.split(".");
            const fileType = uriParts[uriParts.length - 1];
            const fileName = `photo.${fileType}`;
            formData.append("image", {
                uri: dish.image,
                name: fileName,
                type: `image/${fileType}`,
            } as any);
        }

        try {
            const result = await axios.patch(
                `${API_URL}/api/dishes/dishes/${dish.id}/`,
                formData
            );

            // Update local context
            const updatedDish = result.data;
            setDishes((prevDishes: Dish[]) =>
                prevDishes.map((d) =>
                    d.id === updatedDish.id ? updatedDish : d
                )
            );

            return {
                status: result.status,
            };
        } catch (e) {
            if (axios.isAxiosError(e) && e.response) {
                return {
                    error: true,
                    status: e.response.status,
                    data: e.response.data || "An error occurred.",
                };
            } else {
                return {
                    error: true,
                    status: null,
                    data: "An unexpected error occurred.",
                };
            }
        }
    };

    // Remove Dish // Image (DELETE)
    const deleteDish = async (id: number): Promise<any> => {
        try {
            const result = await axios.delete(
                `${API_URL}/api/dishes/dishes/${id}/`
            );
            console.log(result.data);
            setDishes((prevDishes) =>
                prevDishes.filter((dish) => dish.id !== id)
            );
            return {
                status: result.status,
            };
        } catch (e) {
            if (axios.isAxiosError(e) && e.response) {
                console.log(e.response.data);
                return {
                    error: true,
                    status: e.response.status,
                    data: e.response.data || "An error occurred.",
                };
            } else {
                return {
                    error: true,
                    status: null,
                    data: "An unexpected error occurred.",
                };
            }
        }
    };

    // Clear local storage

    // Sync Dishes

    const { authState } = useAuth();
    useEffect(() => {
        const syncDishes = async () => {
            try {
                const result = await axios.get(`${API_URL}/api/dishes/dishes/`);
                console.log(result.status);
                console.log(result.data);
                setDishes(result.data);
                return {
                    status: result.status,
                };
            } catch (e) {
                if (axios.isAxiosError(e) && e.response) {
                    console.log(e.response.data);
                    return {
                        error: true,
                        status: e.response.status,
                        data: e.response.data || "An error occurred.",
                    };
                } else {
                    return {
                        error: true,
                        status: null,
                        data: "An unexpected error occurred.",
                    };
                }
            }
        };

        if (authState?.authenticated) {
            syncDishes();
        }
    }, [authState]);

    const value = {
        dishes,
        loading,
        onAddDish: addDish,
        onGetDish: getDish,
        onGetDishes: getDishes,
        onEditDish: editDish,
        onDeleteDish: deleteDish,
        // syncDishes,
        // clearLocalStorage,
    };

    return (
        <DishContext.Provider value={value}>{children}</DishContext.Provider>
    );
};

export const useDishes = () => {
    return useContext(DishContext);
};
