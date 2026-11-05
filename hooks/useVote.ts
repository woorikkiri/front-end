import { VoteItem } from '@/components/group/vote/VoteCard';
import { API } from '@/constants/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

export default function useVote(meetingId: number) {
    const { userToken } = useAuthStore();
    const [votes, setVotes] = useState<VoteItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [serverError, setServerError] = useState(false);

    const fetchVotes = async () => {
        try {
            const res = await fetch(API.getVotes(meetingId), {
                headers: { 'Authorization': `Bearer ${userToken}` },
            });
            if (!res.ok) { setServerError(true); return; }
            const data = await res.json();
            setVotes(data);
        } catch {
            setServerError(true);
        } finally {
            setLoading(false);
        }
    };

    const fetchVoteDetail = async (vote: VoteItem) => {
        const res = await fetch(API.getVote(vote.voteId), {
            headers: { 'Authorization': `Bearer ${userToken}` },
        });
        if (!res.ok) return null;
        const detail = await res.json();
        return detail;
    };

    const handleDelete = async (voteId: number) => {
        try {
            const res = await fetch(API.deleteVote(voteId), {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${userToken}` },
            });
            if (!res.ok) { setServerError(true); return false; }
            await fetchVotes();
            return true;
        } catch {
            setServerError(true);
            return false;
        }
    };

    const handleClose = async (voteId: number) => {
        try {
            const res = await fetch(API.closeVote(voteId), {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${userToken}` },
            });
            if (!res.ok) { setServerError(true); return false; }
            await fetchVotes();
            return true;
        } catch {
            setServerError(true);
            return false;
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchVotes();
        }, [])
    );

    return {
        votes,
        loading,
        serverError,
        setServerError,
        fetchVotes,
        fetchVoteDetail,
        handleDelete,
        handleClose,
    };
}