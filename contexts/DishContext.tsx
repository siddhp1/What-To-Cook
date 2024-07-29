import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import axios from "axios";
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
    loading?: boolean;
    onAddDish?: (dish: Partial<Dish>) => Promise<any>;
    onGetDish?: (id: number) => Promise<Dish | null>;
    onGetDishes?: (searchTerm: string, sortOrder: number) => Promise<Dish[]>;
    onEditDish?: (dish: Partial<Dish>) => Promise<any>;
    onDeleteDish?: (id: number) => Promise<any>;
    onGetRecommendations?: () => Promise<any>;
    onSyncDishes?: () => Promise<any>;
}

const DISHES_KEY = "@dishes";
import { API_URL } from "./AuthContext";

const DishContext = createContext<DishProps>({});

export const DishProvider = ({ children }: { children: ReactNode }) => {
    const { authState } = useAuth();

    const [loading, setLoading] = useState<boolean>(false);

    // Add Dish // Image (CREATE)
    const addDish = async (dish: Partial<Dish>) => {
        setLoading(true);

        let formData = new FormData();
        formData.append("name", dish.name!);
        formData.append("cuisine", dish.cuisine!);
        formData.append(
            "rating",
            (dish.rating! < 1 ? 2 : dish.rating! * 2).toString()
        );
        formData.append(
            "time_to_make",
            (dish.time_to_make! < 1 ? 1 : dish.time_to_make!).toString()
        );
        formData.append("date_last_made", new Date().toJSON().slice(0, 10));

        // Image
        const uriParts = dish.image!.split(".");
        const fileType = uriParts[uriParts.length - 1];
        const fileName = `photo.${fileType}`;
        formData.append("image", {
            uri: dish.image!,
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

            // THIS CAN PROBABLY BE CONDENSED

            // Add dish to context and local storage
            const newDish: Dish = {
                id,
                name,
                cuisine,
                rating,
                time_to_make,
                date_last_made,
                image,
            };

            // Add to local storage
            const storedDishesJson = await AsyncStorage.getItem(DISHES_KEY);
            const currentDishes = storedDishesJson
                ? JSON.parse(storedDishesJson)
                : [];
            const updatedDishes = [...currentDishes, newDish];
            await AsyncStorage.setItem(
                DISHES_KEY,
                JSON.stringify(updatedDishes)
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
        } finally {
            setLoading(false);
        }
    };

    // Get Dish/Dishes // Image (READ)
    const getDishes = async (searchTerm: string, sortOrder: number) => {
        if (loading) {
            return [];
        }

        try {
            // Retrieve dishes from AsyncStorage
            const storedDishesJson = await AsyncStorage.getItem(DISHES_KEY);
            const storedDishes: Dish[] = storedDishesJson
                ? JSON.parse(storedDishesJson)
                : [];

            let filteredDishes = storedDishes;

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
        try {
            // Retrieve dishes from AsyncStorage
            const storedDishesJson = await AsyncStorage.getItem(DISHES_KEY);
            const storedDishes: Dish[] = storedDishesJson
                ? JSON.parse(storedDishesJson)
                : [];

            // Find the dish with the given id
            const dish = storedDishes.find((dish) => dish.id === id);
            return dish || null;
        } catch (error) {
            console.error("Error retrieving dish:", error);
            return null;
        }
    };

    // Edit Dish // Image (UPDATE)
    const editDish = async (dish: Partial<Dish>) => {
        setLoading(true);

        let formData = new FormData();
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

            // Get updated dish from server response
            const updatedDish: Dish = result.data;

            // Update local storage
            const storedDishesJson = await AsyncStorage.getItem(DISHES_KEY);
            const storedDishes: Dish[] = storedDishesJson
                ? JSON.parse(storedDishesJson)
                : [];
            const updatedDishes = storedDishes.map((d) =>
                d.id === updatedDish.id ? updatedDish : d
            );
            await AsyncStorage.setItem(
                DISHES_KEY,
                JSON.stringify(updatedDishes)
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
        } finally {
            setLoading(false);
        }
    };

    // Remove Dish // Image (DELETE)
    const deleteDish = async (id: number): Promise<any> => {
        setLoading(true);
        try {
            const result = await axios.delete(
                `${API_URL}/api/dishes/dishes/${id}/`
            );

            // Remove dish from AsyncStorage
            const storedDishesJson = await AsyncStorage.getItem(DISHES_KEY);
            if (storedDishesJson) {
                const storedDishes: Dish[] = JSON.parse(storedDishesJson);
                const updatedDishes = storedDishes.filter(
                    (dish) => dish.id !== id
                );
                await AsyncStorage.setItem(
                    DISHES_KEY,
                    JSON.stringify(updatedDishes)
                );
            }

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
        } finally {
            setLoading(false);
        }
    };

    // Recommendations
    const getDishesByIds = async (ids: number[]): Promise<Dish[]> => {
        try {
            // Retrieve stored dishes from AsyncStorage
            const storedDishesJson = await AsyncStorage.getItem(DISHES_KEY);
            if (!storedDishesJson) {
                return [];
            }

            const storedDishes: Dish[] = JSON.parse(storedDishesJson);

            // Filter dishes based on provided IDs
            return storedDishes.filter((dish) => ids.includes(dish.id));
        } catch (error) {
            console.error("Error retrieving dishes from AsyncStorage:", error);
            return [];
        }
    };

    const getRecommendations = async () => {
        try {
            const result = await axios.get(
                `${API_URL}/api/dishes/recommendations/`
            );
            const favoriteIds = result.data.favorite_dishes.map(
                (dish: { id: number }) => dish.id
            );
            const oldestIds = result.data.oldest_dishes.map(
                (dish: { id: number }) => dish.id
            );
            const quickIds = result.data.quick_dishes.map(
                (dish: { id: number }) => dish.id
            );

            const favoriteDishes = await getDishesByIds(favoriteIds);
            const oldestDishes = await getDishesByIds(oldestIds);
            const quickDishes = await getDishesByIds(quickIds);

            return {
                status: result.status,
                data: {
                    favoriteDishes,
                    oldestDishes,
                    quickDishes,
                },
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

    // Syncing
    const syncDishes = async () => {
        try {
            // Fetch latest data from the server
            const result = await axios.get(`${API_URL}/api/dishes/dishes/`);
            const serverDishes: Dish[] = result.data;

            // Retrieve existing data from local storage
            const storedDishesJson = await AsyncStorage.getItem(DISHES_KEY);
            let localDishes: Dish[] = [];
            if (storedDishesJson) {
                localDishes = JSON.parse(storedDishesJson);
            }

            // Compare server data with local data
            const localDishIds = localDishes.map((dish) => dish.id);
            const serverDishIds = serverDishes.map((dish) => dish.id);

            // Find dishes that are in the server but not in local storage
            const dishesToAdd = serverDishes.filter(
                (dish) => !localDishIds.includes(dish.id)
            );

            // Find dishes that are in local storage but not in the server
            const dishesToRemove = localDishes.filter(
                (dish) => !serverDishIds.includes(dish.id)
            );

            // Find dishes that are in both but need updating
            const dishesToUpdate = serverDishes.filter((dish) => {
                const localDish = localDishes.find((d) => d.id === dish.id);
                return (
                    localDish &&
                    JSON.stringify(localDish) !== JSON.stringify(dish)
                );
            });

            // Update local storage to match server data
            // Add new dishes
            if (dishesToAdd.length > 0) {
                const updatedLocalDishes = [...localDishes, ...dishesToAdd];
                await AsyncStorage.setItem(
                    DISHES_KEY,
                    JSON.stringify(updatedLocalDishes)
                );
            }

            // Remove dishes
            if (dishesToRemove.length > 0) {
                const updatedLocalDishes = localDishes.filter(
                    (dish) => !dishesToRemove.some((d) => d.id === dish.id)
                );
                await AsyncStorage.setItem(
                    DISHES_KEY,
                    JSON.stringify(updatedLocalDishes)
                );
            }

            // Update dishes
            if (dishesToUpdate.length > 0) {
                const updatedLocalDishes = localDishes.map((dish) => {
                    const updatedDish = dishesToUpdate.find(
                        (d) => d.id === dish.id
                    );
                    return updatedDish ? updatedDish : dish;
                });
                await AsyncStorage.setItem(
                    DISHES_KEY,
                    JSON.stringify(updatedLocalDishes)
                );
            }

            // Fetch recommendations after syncing
            await getRecommendations();

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

    useEffect(() => {
        if (authState?.authenticated) {
            syncDishes();
        }
    }, [authState]);

    const value = {
        loading,
        onAddDish: addDish,
        onGetDish: getDish,
        onGetDishes: getDishes,
        onEditDish: editDish,
        onDeleteDish: deleteDish,
        onGetRecommendations: getRecommendations,
        onSyncDishes: syncDishes,
    };

    return (
        <DishContext.Provider value={value}>{children}</DishContext.Provider>
    );
};

export const useDishes = () => {
    return useContext(DishContext);
};
