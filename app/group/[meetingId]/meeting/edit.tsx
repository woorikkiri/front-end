import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import Modal from "@/components/ui/Modal";
import ServerErrorModal from "@/components/ui/ServerErrorModal";
import TextInput from "@/components/ui/TextInput";
import { API } from "@/constants/api";
import { Colors, Radius, Spacing, Typography } from "@/constants/theme";
import { useAuthStore } from '@/store/useAuthStore';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from "expo-router";
import { Camera, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditMeetingScreen() {
    // ───── 라우터 / 인증 ─────
    const router = useRouter();
    const { userToken } = useAuthStore();
    const { meetingId } = useLocalSearchParams();

    // ───── 상태 ─────
    const [meetingName, setMeetingName] = useState("");
    const [description, setDescription] = useState("");
    const [imageUri, setImageUri] = useState<string | null>(null); // 현재 보여줄 이미지 URI
    const [newImageFile, setNewImageFile] = useState<{ uri: string; name: string; type: string } | null>(null); // 새로 선택한 파일
    const [imageDeleted, setImageDeleted] = useState(false); // X 눌러서 삭제했는지 여부
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [serverErrorModal, setServerErrorModal] = useState(false);

    // ───── 에러 상태 ─────
    const [errors, setErrors] = useState({ meetingName: "" });

    // ───── 데이터 fetch ─────
    useEffect(() => {
        const fetchMeeting = async () => {
            try {
                const response = await fetch(API.getMeetingDetail(Number(meetingId)), {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${userToken}`,
                    },
                });
                if (!response.ok) {
                    setServerErrorModal(true);
                    return;
                }
                const data = await response.json();
                setMeetingName(data.meetingName);
                setDescription(data.description || "");
                setImageUri(data.imageUrl || null); // 기존 이미지 URL 세팅
            } catch (e) {
                setServerErrorModal(true);
            }
        };
        fetchMeeting();
    }, []);

    // ───── 이미지 선택 ─────
    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1], // 정사각형으로 크롭
            quality: 0.8,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            const uri = asset.uri;
            const name = uri.split('/').pop() ?? 'image.jpg';
            const type = asset.mimeType ?? 'image/jpeg';

            setImageUri(uri);
            setNewImageFile({ uri, name, type });
            setImageDeleted(false);
        }
    };

    // ───── 이미지 삭제 ─────
    const handleDeleteImage = () => {
        setImageUri(null);
        setNewImageFile(null);
        setImageDeleted(true); // 삭제됐음을 표시 → 저장 시 file 안 보냄
    };

    // ───── 유효성 검사 ─────
    const validate = () => {
        const newErrors = { meetingName: "" };
        if (!meetingName.trim()) newErrors.meetingName = "모임 이름을 입력해주세요.";
        setErrors(newErrors);
        return Object.values(newErrors).every((e) => e === "");
    };

    // ───── 모임 수정 ─────
    const handleUpdateMeeting = async () => {
        if (!validate()) return;
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('meetingName', meetingName);
            formData.append('description', description);
            formData.append('deleteImage', String(imageDeleted));

            if (newImageFile) {
                formData.append('file', {
                    uri: newImageFile.uri,
                    name: newImageFile.name,
                    type: newImageFile.type,
                } as any);
            }

            const response = await fetch(API.updateMeeting(Number(meetingId)), {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${userToken}`,
                },
                body: formData,
            });

            if (!response.ok) {
                setServerErrorModal(true);
                return;
            }
            setShowModal(true);

        } catch (e) {
            setServerErrorModal(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

            <Header title="모임 수정" />
            <View style={styles.container}>
                <View style={styles.titleSection}>
                    <Text style={styles.title}>모임 정보를 수정해요</Text>
                    <Text style={styles.subTitle}>모임명과 모임 설명을 수정할 수 있어요.</Text>
                </View>

                {/* 이미지 영역 */}
                <View style={styles.imageSection}>
                    <View style={styles.imageWrapper}>
                        {/* 이미지 or 기본 원형 */}
                        {imageUri ? (
                            <Image source={{ uri: imageUri }} style={styles.image} />
                        ) : (
                            <View style={styles.imagePlaceholder} />
                        )}

                        {/* 카메라 아이콘 버튼 */}
                        <TouchableOpacity
                            style={styles.cameraButton}
                            onPress={handlePickImage}
                            activeOpacity={0.8}
                        >
                            <Camera size={14} color={Colors.white} />
                        </TouchableOpacity>

                        {/* X 버튼 - 이미지 있을 때만 표시 */}
                        {imageUri && (
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={handleDeleteImage}
                                activeOpacity={0.8}
                            >
                                <X size={12} color={Colors.white} />
                            </TouchableOpacity>
                        )}
                    </View>
                    <Text style={styles.imageHint}>이미지를 변경할 수 있어요</Text>
                </View>

                <View style={styles.formSection}>
                    <TextInput
                        label="모임 이름"
                        placeholder="예: 고등학교 동창회"
                        required
                        value={meetingName}
                        onChangeText={(v) => {
                            setMeetingName(v);
                            setErrors({ meetingName: "" });
                        }}
                        error={errors.meetingName}
                    />
                    <TextInput
                        label="모임 설명(선택)"
                        placeholder="모임에 대한 간단한 설명을 입력해주세요."
                        value={description}
                        onChangeText={(v) => setDescription(v)}
                    />
                </View>

                <View style={styles.buttonSection}>
                    <Button
                        label="저장"
                        onPress={handleUpdateMeeting}
                        loading={loading}
                    />
                </View>
            </View>

            {/* 수정 완료 팝업 */}
            <Modal
                visible={showModal}
                message="모임이 수정됐어요!"
                rightBtnText="확인"
                showLeftBtn={false}
                onLeftBtnPress={() => { }}
                onRightBtnPress={() => {
                    setShowModal(false);
                    router.back();
                }}
                rightBtnVariant="primary"
            />

            {/* 서버 오류 모달 */}
            <ServerErrorModal
                visible={serverErrorModal}
                onClose={() => setServerErrorModal(false)}
            />
        </SafeAreaView>
    );
}

const IMAGE_SIZE = 90;

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    container: {
        paddingHorizontal: Spacing['2xl'],
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

    // ───── 이미지 영역 ─────
    imageSection: {
        alignItems: 'center',
        marginBottom: Spacing['2xl'],
        gap: Spacing.sm,
    },
    imageWrapper: {
        position: 'relative',
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
    },
    image: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        borderRadius: Radius.full,
    },
    imagePlaceholder: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        borderRadius: Radius.full,
        backgroundColor: Colors.primaryLight,
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 28,
        height: 28,
        borderRadius: Radius.full,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.white,
    },
    deleteButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 22,
        height: 22,
        borderRadius: Radius.full,
        backgroundColor: Colors.gray500,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.white,
    },
    imageHint: {
        fontSize: Typography.sm,
        color: Colors.gray500,
    },

    // ───── 폼 영역 ─────
    formSection: {
        gap: Spacing.base,
        marginBottom: Spacing.lg,
    },
    buttonSection: {
        gap: Spacing.sm,
    },
});
