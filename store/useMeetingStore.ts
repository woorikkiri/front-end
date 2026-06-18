import { create } from 'zustand';

interface MeetingStore {
    meetingId: number | null;
    myRole: 'HOST' | 'MEMBER' | null;
    setMeeting: (meetingId: number, role: 'HOST' | 'MEMBER') => void;
    clearMeeting: () => void;  // 모임 나갈 때
}
export const useMeetingStore = create<MeetingStore>((set) => ({
    meetingId: null,
    myRole: null,
    setMeeting: (meetingId, role) => set({ meetingId, myRole: role }),
    clearMeeting: () => set({ meetingId: null, myRole: null }),
}));
