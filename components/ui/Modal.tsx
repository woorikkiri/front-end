// 화면 위에 떠오르는 팝업
import Button from "@/components/ui/Button";
import { Colors, Radius, Spacing, Typography } from "@/constants/theme";
import {
    Modal as RNModal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export type ButtonVariant = 'primary' | 'danger' | 'warning' | 'cancel';

interface ModalProps {
    visible: boolean;
    message: string;
    showLeftBtn?: boolean;
    leftBtnText?: string;
    rightBtnText: string;
    onLeftBtnPress: () => void;
    onRightBtnPress: () => void;
    onBackDropPress?: () => void;
    leftBtnVariant?: ButtonVariant;
    rightBtnVariant?: ButtonVariant;
    children?: React.ReactNode;
}

export default function Modal({
    visible,
    message,
    showLeftBtn = true,  // 기본값 true
    rightBtnText,
    onRightBtnPress,
    leftBtnText = '취소',
    onLeftBtnPress,
    onBackDropPress,
    leftBtnVariant = 'cancel',
    rightBtnVariant = 'danger',
    children,
}: ModalProps) {
    return (
        <RNModal
            visible={visible}
            transparent={true}
            animationType='fade'
            onRequestClose={onBackDropPress}
        >
            <View style={styles.overlay}>
                <TouchableOpacity
                    style={StyleSheet.absoluteFillObject}
                    activeOpacity={1}
                    onPress={onBackDropPress}
                />

                <View style={styles.modalBox}>
                    <Text style={styles.modalText}>{message}</Text>
                    {children}
                    <View style={{ flexDirection: 'row', gap: Spacing.sm, width: '100%' }}>
                        {/* showLeftBtn이 true일 때만 보여줌 */}
                        {showLeftBtn && (
                            <Button
                                label={leftBtnText}
                                onPress={onLeftBtnPress || onBackDropPress}
                                variant={leftBtnVariant}
                                style={{ flex: 1 }}
                            />
                        )}
                        <Button
                            label={rightBtnText}
                            onPress={onRightBtnPress}
                            variant={rightBtnVariant}
                            style={{ flex: 1 }}
                        />
                    </View>
                </View>
            </View>
        </RNModal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalBox: {
        width: '80%',
        padding: Spacing.xl,
        backgroundColor: Colors.white,
        borderRadius: Radius.xl,
        alignItems: 'center',
        gap: Spacing.lg,
    },
    modalText: {
        fontSize: Typography.base,
        fontWeight: '600',
        color: Colors.black,
        textAlign: 'center',
    },
})