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