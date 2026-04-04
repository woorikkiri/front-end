import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import TextInput from "@/components/ui/TextInput";
import { Colors, Spacing, Typography } from "@/constants/theme";
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
    
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState({
        code: "",
    });

    {/* 유효성 검사 */}
    {/* 초대코드 = 8자리 영대문자+숫자 */}
    const validate = () => {
        const newErrors = {
            code: "",
        };
        if(!code) {
            newErrors.code = "코드를 입력해주세요.";
        }
        if(code && !/^[A-Z0-9]{8}$/.test(code)) {
            newErrors.code = "올바른 초대 코드 형식이 아닙니다.";
        }

        setErrors(newErrors);
        return Object.values(newErrors).every((e) => e === "");
    }
    
    {/* 확인 버튼 눌렀을 때*/}
    const handleConfirm = async () => {
        if(!validate()) return;
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.replace("/(tabs)/home");
        }, 1500);
    }

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
                            setErrors({code: ""});
                        }}
                        error={errors.code}
                        autoCapitalize="characters"
                    />
                </View>

                <View style={styles.buttonSection}>
                    <Button
                        label="확인"
                        onPress={handleConfirm}
                        loading={loading}
                    />
                </View>
            </View>
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