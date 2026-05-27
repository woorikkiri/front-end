import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

interface AuthStore {
    userToken: string | null;
    userId: number | null;
    login: (token: string, userId: number) => Promise<void>; 
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
    userToken: null,
    userId: null,
    login: async (token, userId) => {
        await AsyncStorage.setItem('accessToken', token);
        await AsyncStorage.setItem('userId', String(userId));
        set({ userToken: token, userId });
    },
    logout: async () => {
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('userId');
        set({ userToken: null, userId: null });
    },

}));
