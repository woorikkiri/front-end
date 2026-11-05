import Button from '@/components/ui/Button';
import Header from '@/components/ui/Header';
import ServerErrorModal from '@/components/ui/ServerErrorModal';
import TextInput from '@/components/ui/TextInput';
import { API } from '@/constants/api';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { Camera, Megaphone, Square, SquareCheck, X } from 'lucide-react-native';
import { useState } from 'react';
import {
    Image,
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

    // ───── 이미지 상태 ─────
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [newImageFile, setNewImageFile] = useState<{ uri: string; name: string; type: string } | null>(null);

    // ───── 에러 상태 ─────
    const [titleError, setTitleError] = useState('');
    const [contentError, setContentError] = useState('');

    // ───── 이미지 선택 ─────
    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            const uri = asset.uri;
            const name = uri.split('/').pop() ?? 'image.jpg';
            const type = asset.mimeType ?? 'image/jpeg';

            setImageUri(uri);
            setNewImageFile({ uri, name, type });
        }
    };

    // ───── 이미지 삭제 ─────
    const handleDeleteImage = () => {
        setImageUri(null);
        setNewImageFile(null);
    };

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
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('notice', String(isNotice));

            if (newImageFile) {
                formData.append('file', {
                    uri: newImageFile.uri,
                    name: newImageFile.name,
                    type: newImageFile.type,
                } as any);
            }

            const response = await fetch(API.createPost(Number(meetingId)), {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${userToken}`
                },
                body: formData,
            });
            if (!response.ok) {
                setServerErrorModal(true);
                return;
            }
            router.back();

        } catch (error) {
            setServerErrorModal(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
            <Header title="게시글 작성" />
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
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

                {/* 이미지 영역 */}
                <View style={styles.imageSection}>
                    <Text style={styles.imageLabel}>사진 (선택)</Text>
                    {imageUri ? (
                        <View style={styles.imageWrapper}>
                            <Image source={{ uri: imageUri }} style={styles.image} />
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={handleDeleteImage}
                                activeOpacity={0.8}
                            >
                                <X size={14} color={Colors.white} />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage} activeOpacity={0.7}>
                            <Camera size={24} color={Colors.gray500} />
                            <Text style={styles.imagePickerText}>사진 추가</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* 공지사항 올리는 check박스 */}
                <TouchableOpacity style={styles.checkboxContainer} onPress={() => setIsNotice(!isNotice)}>
                    <Megaphone size={22} color={Colors.primary} style={styles.checkboxIcon} />
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

            <ServerErrorModal
                visible={serverErrorModal}
                onClose={() => setServerErrorModal(false)}
            />
        </SafeAreaView>
    );
}

const IMAGE_SIZE = 100;

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    container: {
        paddingTop: Spacing.xl,
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing['5xl'],
    },

    // ───── 이미지 ─────
    imageSection: {
        gap: Spacing.sm,
    },
    imageLabel: {
        fontSize: Typography.sm,
        fontWeight: '600',
        color: Colors.gray900,
    },
    imageWrapper: {
        position: 'relative',
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
    },
    image: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        borderRadius: Radius.lg,
    },
    deleteButton: {
        position: 'absolute',
        top: -6,
        right: -6,
        width: 22,
        height: 22,
        borderRadius: Radius.full,
        backgroundColor: Colors.gray500,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.white,
    },
    imagePicker: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        borderRadius: Radius.lg,
        borderWidth: 1.5,
        borderColor: Colors.border,
        borderStyle: 'dashed',
        backgroundColor: Colors.gray100,
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.xs,
    },
    imagePickerText: {
        fontSize: Typography.sm,
        color: Colors.gray500,
        fontWeight: '600',
    },

    // ───── 공지 체크박스 ─────
    checkboxContainer: {
        backgroundColor: Colors.gray100,
        borderRadius: Radius.lg,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkboxIcon: {
        marginRight: Spacing.sm,
    },
    checkboxText: {
        fontSize: Typography.base,
        fontWeight: '700',
    },

    // ───── 버튼 ─────
    buttonSection: {
        flexDirection: 'row',
        gap: Spacing.base,
    },
});
