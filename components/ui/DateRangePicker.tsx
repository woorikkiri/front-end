import { Spacing } from '@/constants/theme';
import { useState } from 'react';
import {
    View
} from 'react-native';

interface DateRangePickerProps {
    startDate: string | null;
    endDate: string | null;
    onStartChange: (date: string) => void;
    onEndChange: (date: string) => void;
    minDate?: string;
}

export default function DateRangePicker({
    startDate,
    endDate,
    onStartChange,
    onEndChange,
    minDate,
}: DateRangePickerProps) {
    const [showCalendar, setShowCalendar] = useState(false);
    const [selecting, setSelecting] = useState<'start' | 'end' | null>(null);

    return (
        <View>
            {/* 1. 시작/종료 버튼 두 개 */}
            <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
                {/* 시작 버튼 */}
                
                {/* 종료 버튼 */}
                
            </View>

            {/* 2. 캘린더 (showCalendar가 true일 때만) */}
            
        </View>
    );
}