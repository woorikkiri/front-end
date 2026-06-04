import Button from '@/components/ui/Button';
import Header from '@/components/ui/Header';
import ServerErrorModal from '@/components/ui/ServerErrorModal';
import TextInput from '@/components/ui/TextInput';
import { API } from '@/constants/api';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { router, useLocalSearchParams } from 'expo-router';
import { Megaphone, Square, SquareCheck } from 'lucide-react-native';
import { useState } from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreatePostScreen() {
    // ───── 라우터 / 인증 ─────
    const { meetingId } = useLocalSearchParams();
    const { userToken } = useAuthStore();

    // ───── 상태 ─────
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isNotice, setIsNotice] = useState(false);
    const [loading, setLoading] = useState(false);
    const [serverErrorModal, setServerErrorModal] = useState(false);

    // ───── 에러 상태 ─────
    const [titleError, setTitleError] = useState('');
    const [contentError, setContentError] = useState('');

    // ───── 게시글 등록 ─────
    const handleCreatePost = async () => {
        let isValid = true;

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

        try {
            const response = await fetch(API.createPost(Number(meetingId)), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                },
                body: JSON.stringify({
                    title,
                    content,
                    notice: isNotice,
                    imageUrl: null,
                })
            });
            if (!response.ok) {
                setServerErrorModal(true);
                return;
            }
            router.back();

        } catch (error) {
            setServerErrorModal(true);
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
                    <Megaphone size={22} color={Colors.primary} style={styles.checkboxIcon}/>
                    <Text style={styles.checkboxText}>공지사항으로 올리기</Text>
                    {isNotice
                        ? <SquareCheck size={22} color={Colors.primary} style={{ marginLeft: 'auto' }} />
                        : <Square size={22} color={Colors.gray500} style={{ marginLeft: 'auto' }} />
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
                        onPress={handleCreatePost}
                        loading={loading}
                        style={{ flex: 1 }}
                        fullWidth={false}
                    />
                </View>
            </ScrollView>
            
            {/* 서버 오류 모달 */}
            <ServerErrorModal
                visible={serverErrorModal}
                onClose={() => setServerErrorModal(false)}
            />
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
        fontSize: Typography.base,
        fontWeight: '700',
    },
    buttonSection: {
        flexDirection: 'row',
        gap: Spacing.base,
    },

});
