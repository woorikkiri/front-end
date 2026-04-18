import Button from '@/components/ui/Button';
import Header from '@/components/ui/Header';
import TextInput from '@/components/ui/TextInput';
import { API } from '@/constants/api';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreatePostScreen() {
    const { meetingId } = useLocalSearchParams();
    
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [isNotice, setIsNotice] = useState(false);

    const [titleError, setTitleError] = useState('');
    const [contentError, setContentError] = useState('');

    let isValid = true;

    const handleSubmit = async () => {
        if (!title) {
            setTitleError('제목을 입력하세요');
            isValid = false;
        }
        if (!content) {
            setContentError('내용을 입력하세요');
            isValid = false;

        }
        if (!isValid) return;

        setLoading(true);
        {/* API 연동 - 게시글 등록하기 */}
        try {
            // API 호출
            await fetch(API.createPost(Number(meetingId)), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                content,
                notice: isNotice,
                imageUrl: null,
            })
        });
            router.back();  // 성공하면 이동
        } catch (error) {
            // 에러 처리
            // modal로 할껀지 이걸로 할건지 정해야할듯.
            Alert.alert('오류', '게시글 등록에 실패했습니다.');
        } finally {
            setLoading(false);  // 무조건 로딩 끝
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
            <Header title="게시글 작성" />
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ gap: Spacing.xl }}
            >
                <TextInput
                    label="제목"
                    placeholder="제목을 입력하세요"
                    error={titleError}
                    value={title}
                    onChangeText={(v) => {
                        setTitle(v);
                        setTitleError('');
                    }}
                />
                <TextInput
                    label="내용"
                    placeholder="내용을 입력하세요"
                    multiline
                    style={{ height: 200, textAlignVertical: 'top' }}
                    error={contentError}
                    value={content}
                    onChangeText={(v) => {
                        setContent(v);
                        setContentError('');
                    }}
                />

                {/* 공지사항 올리는 check박스 */}
                <TouchableOpacity style={styles.checkboxContainer} onPress={() => setIsNotice(!isNotice)}>
                    <Ionicons name="pin" size={24} color={Colors.primary} style={styles.checkboxIcon} />
                    <Text style={styles.checkboxText}>공지사항으로 올리기</Text>
                    {isNotice
                        ? <Ionicons name="checkbox" size={24} color={Colors.primary} style={{ marginLeft: 'auto' }} />
                        : <Ionicons name="square-outline" size={24} color={Colors.gray500} style={{ marginLeft: 'auto' }} />
                    }
                </TouchableOpacity>

                {/* 등록, 취소 버튼 */}
                <View style={styles.buttonSection}>
                    <Button
                        label="취소"
                        onPress={() => router.back()}
                        variant="cancel"
                        style={{ flex: 1 }}
                        fullWidth={false}
                    />

                    <Button
                        label="등록"
                        onPress={handleSubmit}
                        loading={loading}
                        style={{ flex: 1 }}
                        fullWidth={false}
                    />
                </View>
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
        paddingTop: Spacing['xl'],
        paddingHorizontal: Spacing['lg'],
        paddingBottom: Spacing['5xl'],
    },
    checkboxContainer: {
        backgroundColor: Colors.gray100,
        borderRadius: Radius.lg,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Spacing.lg,
        marginBottom: Spacing.lg,
    },
    checkboxIcon: {
        marginRight: Spacing.sm,
    },
    checkboxText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonSection: {
        flexDirection: 'row',
        gap: Spacing.base,
    },

});
