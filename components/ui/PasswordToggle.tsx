import { Colors } from '@/constants/theme';
import { Eye, EyeOff } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

interface PasswordToggleProps {
    show: boolean;
    onToggle: () => void;
}

export default function PasswordToggle({ show, onToggle }: PasswordToggleProps) {
    return (
        <TouchableOpacity onPress={onToggle} hitSlop={8}>
            {show
                ? <Eye size={20} color={Colors.gray500} />
                : <EyeOff size={20} color={Colors.gray500} />
            }
        </TouchableOpacity>
    );
}
