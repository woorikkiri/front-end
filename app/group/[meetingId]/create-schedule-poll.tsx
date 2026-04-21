import Header from '@/components/ui/Header';
import TextInput from '@/components/ui/TextInput';
import { Colors, Spacing, Typography } from '@/constants/theme';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateSchedulePollScreen() {
    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
            <Header title='일정조율 만들기' />
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* 타이틀 */}
                <View style={styles.titleSection}>
                    <Text style={styles.title}>조율을 만들고{"\n"}멤버들에게 공유해요</Text>
                    <Text style={styles.subTitle}>기간을 정하면 그 구간에서만 날짜를 선택할 수 있어요.</Text>
                </View>

                {/* 조율 제목 받는 곳 */}
                <TextInput>

                </TextInput>
                {/* 조율 기간 받는 곳 */}

                {/* 버튼 */}

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    container: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing['3xl'],
    },

    titleSection: {
        marginTop: Spacing.lg,
        marginBottom: Spacing['2xl'],
        alignItems: "flex-start",
        gap: Spacing.xs,
    },
    title: {
        fontSize: Typography['2xl'],
        fontWeight: "900",
        color: Colors.black,
    },
    subTitle: {
        fontSize: Typography.base,
        color: Colors.gray500,
    },
});