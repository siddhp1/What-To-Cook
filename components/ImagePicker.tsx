import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return null;

    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [1, 1],
        quality: 1,
        selectionLimit: 1,
        allowsEditing: true,
    });

    return result.canceled ? null : result.assets[0].uri;
};

const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return null;

    let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [1, 1],
        quality: 1,
        selectionLimit: 1,
        allowsEditing: true,
    });

    return result.canceled ? null : result.assets[0].uri;
};

const pickOrTake = async (): Promise<string | null> => {
    return new Promise((resolve) => {
        Alert.alert(
            "Upload Photo",
            "Choose an option",
            [
                {
                    text: "Take Photo",
                    onPress: async () => {
                        const uri = await takePhoto();
                        resolve(uri);
                    },
                },
                {
                    text: "Choose from Library",
                    onPress: async () => {
                        const uri = await pickImage();
                        resolve(uri);
                    },
                },
                {
                    text: "Cancel",
                    onPress: () => resolve(null),
                    style: "cancel",
                },
            ],
            { cancelable: true, onDismiss: () => resolve(null) }
        );
    });
};

export { pickOrTake };
