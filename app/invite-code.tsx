import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import ServerErrorModal from "@/components/ui/ServerErrorModal";
import TextInput from "@/components/ui/TextInput";
import { API } from "@/constants/api";
import { Colors, Spacing, Typography } from "@/constants/theme";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function InviteCodeScreen() {
    const router = useRouter();
    const { userToken } = useAuthStore();

    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState({
        code: "",
    });

    const [serverErrorModal, setServerErrorModal] = useState(false);

    {/* 유효성 검사 */ }
    {/* 초대코드 = 8자리 영대문자+숫자 */ }
    const validate = () => {
        const newErrors = {
            code: "",
        };
        if (!code) {
            newErrors.code = "코드를 입력해주세요.";
        }
        if (code && !/^[A-Z0-9]{8}$/.test(code)) {
            newErrors.code = "올바른 초대 코드 형식이 아닙니다.";
        }

        setErrors(newErrors);
        return Object.values(newErrors).every((e) => e === "");
    }

    {/* 확인 버튼 눌렀을 때*/ }
    const handleJoin = async () => {
        if (!validate()) return;
        setLoading(true);
        console.log(code);

        try {
            const response = await fetch(API.joinMeeting, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userToken}`,
                },
                body: JSON.stringify({
                    inviteCode: code,
                }),
            });
            // 실패
            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData);
                switch (errorData.code) {
                    case 'MEETING_NOT_FOUND':
                        setErrors({ code: '유효하지 않은 초대코드입니다.' });
                        break;
                    case 'ALREDEAY_JOINED':
                        setErrors({ code: '이미 참여 중인 모임입니다.' });
                        break;
                    default:
                        setServerErrorModal(true);
                        break;
                }
                return;
            }
            // 성공 처리
            router.replace('/(tabs)/home');

        } catch (error) {
            // 네트워크 오류
            setServerErrorModal(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

            <Header title="초대 코드 입력" />
            <View style={styles.container}>
                <View style={styles.titleSection}>
                    <Text style={styles.title}>친구가 보낸 초대 코드를 입력해주세요</Text>
                    <Text style={styles.subTitle}>코드를 입력하면 바로 해당 모임에 참여할 수 있습니다.</Text>
                </View>

                <View style={styles.formSection}>
                    <TextInput
                        label="초대 코드"
                        placeholder="예: AB12CD34"
                        value={code}
                        onChangeText={(v) => {
                            setCode(v.toUpperCase().replace(/[^A-Z0-9]/g, ""));
                            setErrors({ code: "" });
                        }}
                        error={errors.code}
                        autoCapitalize="characters"
                    />
                </View>

                <View style={styles.buttonSection}>
                    <Button
                        label="확인"
                        onPress={handleJoin}
                        loading={loading}
                    />
                </View>
            </View>
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