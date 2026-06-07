export const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const kstNow = new Date(now.getTime() - 9 * 60 * 60 * 1000); // 9시간 빼기
    const date = new Date(dateString);
    const diff = kstNow.getTime() - date.getTime(); // 밀리초 차이

    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    return `${days}일 전`;
};

export const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}:00`;
};

export const formatFinalScheduleMeta = (
    startDate: string,
    endDate: string,
) => {
    const formattedStart = startDate.replace(/-/g, '.');
    const [, endMonth, endDay] = endDate.split('-');
    const formattedEnd = `${endMonth}.${endDay}`;

    return startDate === endDate
        ? formattedStart
        : `${formattedStart} ~ ${formattedEnd}`;
};

export const getDaysUntilDeadline = (deadlineAt: string) => {
    const now = new Date();
    const deadline = new Date(deadlineAt);
    const diff = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diff <= 0) return '마감됨';
    if (diff === 1) return '내일 마감';
    return `${diff}일 뒤 마감`;
};