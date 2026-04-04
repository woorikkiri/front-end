import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

interface PasswordToggleProps {
    show: boolean;
    onToggle: () => void;
}

export default function PasswordToggle({ show, onToggle }: PasswordToggleProps) {
    return (
        <TouchableOpacity onPress={onToggle} hitSlop={8}>
            <Ionicons
                name={show ? "eye-outline" : "eye-off-outline"}
                size={20}
                color={Colors.gray500}
            />
        </TouchableOpacity>
    );
}
