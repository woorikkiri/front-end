import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import Modal from "@/components/ui/Modal";
import ServerErrorModal from "@/components/ui/ServerErrorModal";
import TextInput from "@/components/ui/TextInput";
import { API } from "@/constants/api";
import { Colors, Spacing, Typography } from "@/constants/theme";
import { useAuthStore } from '@/store/useAuthStore';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    StatusBar,
    StyleSheet,
    Text,
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
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [serverErrorModal, setServerErrorModal] = useState(false);

    // ───── 에러 상태 ─────
    const [errors, setErrors] = useState({ meetingName: "" });

    // ───── 데이터 fetch ─────
    useEffect(() => {
        const fetchMeeting = async () => {
            // API 호출해서 기존 데이터 가져오기
            try {
                const response = await fetch(API.getMeeting(Number(meetingId)), {
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
            } catch (e) {
                setServerErrorModal(true);
            }
        };
        fetchMeeting();
    }, []);

    // ───── 유효성 검사 ─────
    const validate = () => {
        const newErrors = { meetingName: "" };
        if (!meetingName.trim()) newErrors.meetingName = "모임 이름을 입력해주세요.";
        setErrors(newErrors);
        return Object.values(newErrors).every((e) => e === "");
    }

    // ───── 모임 수정 ─────
    const handleUpdateMeeting = async () => {
        if (!validate()) return;
        setLoading(true);

        try {
            const response = await fetch(API.updateMeeting(Number(meetingId)), {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userToken}`,
                },
                body: JSON.stringify({
                    meetingName,
                    description,
                }),
            });

            // 실패
            if (!response.ok) {
                setServerErrorModal(true);
                return;
            }
            // 성공
            setShowModal(true);

        } catch (e) {
            // 네트워크 오류
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
    )
}

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
    formSection: {
        gap: Spacing.base,
        marginBottom: Spacing.lg,
    },
    buttonSection: {
        gap: Spacing.sm,
    },

});