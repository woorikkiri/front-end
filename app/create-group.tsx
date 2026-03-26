import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import Modal from "@/components/ui/modal";
import TextInput from "@/components/ui/TextInput";
import { Colors, Radius, Spacing, Typography } from "@/constants/theme";
import * as Clipboard from 'expo-clipboard';
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Share,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateGroupScreen() {
    const router = useRouter();

    const [groupName, setGroupName] = useState("");
    const [groupDescription, setGroupDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const [showInviteModal, setShowInviteModal] = useState(false); //이거
    const [inviteCode, setInviteCode] = useState(""); //이거

    const [errors, setErrors] = useState({
        groupName: "",
    })

    const validate = () => {
        const newErrors = { groupName: "" };
        if(!groupName.trim()) newErrors.groupName = "모임 이름을 입력해주세요.";
        setErrors(newErrors);
        return Object.values(newErrors).every((e) => e === "");
    }

    const handleConfirm = () => {
        if(!validate()) return;
        setLoading(true);
        setTimeout(() => {
            setShowInviteModal(false);
            setInviteCode("AB12-CD34");  // 임시 초대코드
            setShowInviteModal(true);     // ← true로 바꿔야 팝업 뜸!
        }, 1500);
    }

    return(
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

            <Header title="모임 생성" />
            <View style={styles.container}>
                <View style={styles.titleSection}>
                    <Text style={styles.title}>모임을 만들어보세요</Text>
                    <Text style={styles.subTitle}>친구를 초대하고 함께 활동해보세요!</Text>
                </View>

                <View style={styles.formSection}>
                    <TextInput
                        label="모임 이름"
                        placeholder="예: 고등학교 동창회"
                        required
                        value={groupName}
                        onChangeText={(v) => {
                            setGroupName(v);
                            setErrors({groupName: ""});
                        }}
                        error={errors.groupName}
                    />
                    <TextInput
                        label="모임 설명(선택)"
                        placeholder="모임에 대한 간단한 설명을 입력해주세요."
                        onChangeText={(v) => setGroupDescription(v)}
                    />
                </View>

                <View style={styles.buttonSection}>
                    {/* 생성하기 버튼 누르면 모임이 생성되었어요!
                     하면서 초대코드 뜨는 팝업창만들기 */}
                    <Button
                        label="생성하기"
                        onPress={handleConfirm}
                        loading={loading}
                    />
                </View>
            </View>
            {/* 초대코드 팝업 */}
            <Modal
                visible={showInviteModal}
                message="모임이 생성됐어요!"
                rightBtnText="확인"
                showLeftBtn={false}
                onLeftBtnPress={() => {}}
                onRightBtnPress={() => {
                    setShowInviteModal(false);
                    router.replace("/(tabs)/home");
                }}
                rightBtnVariant="primary"
            >
                {/* 초대코드 박스 */}
                <View style={styles.inviteBox}>
                    <Text style={styles.inviteCode}>{inviteCode}</Text>
                    {/* 복사 버튼 */}
                    <TouchableOpacity onPress={async () => {
                        await Clipboard.setStringAsync(inviteCode);
                    }}>
                        <Text style={styles.icon}>📋</Text>
                    </TouchableOpacity>
                    {/* 공유 버튼 */}
                    <TouchableOpacity onPress={async () => {
                        await Share.share({
                        message: `우리끼리 초대코드: ${inviteCode}`,
                        });
                    }}>
                        <Text style={styles.icon}>📤</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
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
    inviteBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.gray100,
        padding: Spacing.md,
        borderRadius: Radius.lg,
        gap: Spacing.sm,
        width: '100%',
    },
    inviteCode: {
        fontSize: Typography.lg,
        fontWeight: '700',
        color: Colors.black,
        flex: 1,
        textAlign: 'center',
        letterSpacing: 2,
    },
    icon: {
        fontSize: 20,
    },
});