import Header from '@/components/ui/Header';
import { Colors, Spacing } from '@/constants/theme';
import { useRouter } from "expo-router";
import {
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

            <Header title='프로필'/>
            <View style={styles.container}>
                
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    container: {
        paddingTop: Spacing['2xl'],
        paddingHorizontal: Spacing['lg'],
        paddingBottom: Spacing['3xl'],
    }
})