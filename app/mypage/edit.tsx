import Button from '@/components/ui/Button';
import Header from '@/components/ui/Header';
import TextInput from '@/components/ui/TextInput';
import { API } from "@/constants/api";
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useAuthStore } from "@/store/useAuthStore";
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditScreen() {
    const router = useRouter();
    const { userToken } = useAuthStore();
    const [image, setImage] = useState<string | null>(null);
    const [nickname, setNickname] = useState("");
    const [errors, setErrors] = useState({
        nickname: '',
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(API.getMe, {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                    }
                });
                const data = await response.json();
                setNickname(data.nickname);
                setImage(data.profileImageUrl);
            } catch (e) {
                console.error('프로필 불러오기 실패', e);
            }
        };
        fetchUser();
    }, []);

    // 이미지 선택
    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],  // 정사각형으로 자르기
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    // 유효성 검사
    const validate = () => {
        if (!nickname.trim()) {
            setErrors({ nickname: '닉네임을 입력해주세요.' });
            return false;
        }

        setErrors({ nickname: '' });
        return true;
    };

    // 저장 버튼 핸들러
    const handleSave = async () => {
        if (!validate()) return;
        try {
            await fetch(API.updateMe, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nickname }),
            });
            router.back();
        } catch (e) {
            console.error('프로필 수정 실패', e);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

            <Header title='프로필' />
            <View style={styles.container}>
                <View style={styles.profileSection}>
                    <TouchableOpacity
                        style={styles.profileImage}
                        onPress={handlePickImage}
                    >
                        {image ? (
                            <Image source={{ uri: image }} style={styles.profileImage} />
                        ) : (
                            <Ionicons name="person" size={40} color={Colors.gray300} />
                        )}

                        {/* 카메라 버튼 */}
                        <View style={styles.cameraButton}>
                            <Ionicons name="camera-outline" size={20} color={Colors.white} />
                        </View>
                    </TouchableOpacity>

                    <Text style={styles.infoText}>프로필 이미지를 변경할 수 있어요.</Text>
                </View>

                <View style={styles.formSection}>
                    <TextInput
                        label='닉네임'
                        placeholder='닉네임을 입력해주세요.'
                        value={nickname}
                        onChangeText={(v) => setNickname(v)}
                        error={errors.nickname}
                        rightElement={nickname.length > 0 ? <Ionicons name="close-circle" size={20} color={Colors.gray300} onPress={() => setNickname('')} /> : undefined}
                        required
                    />
                </View>

                <View style={styles.buttonSection}>
                    <Button
                        label='저장'
                        onPress={handleSave}
                    />
                </View>
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
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing['3xl'],
    },
    profileSection: {
        alignSelf: 'center',
        alignItems: 'center',
        marginBottom: Spacing['2xl'],
    },
    profileImage: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: Colors.gray200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoText: {
        fontSize: Typography.sm,
        color: Colors.gray500,
        lineHeight: 20,
        marginTop: Spacing.base,
    },
    formSection: {
        gap: Spacing.base,
    },
    buttonSection: {
        gap: Spacing.sm,
        marginTop: Spacing.lg,
    },
})