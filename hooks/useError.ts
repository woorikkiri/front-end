// hooks/useError.ts

import Toast from 'react-native-toast-message';

export default function useError() {
    const showError = (message: string) => {
        Toast.show({
            type: 'error',
            text1: message,
        });
    };

    return { showError };
}