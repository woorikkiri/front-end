// components/ui/ServerErrorModal.tsx
import Modal from "@/components/ui/Modal";

interface ServerErrorModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function ServerErrorModal({ visible, onClose }: ServerErrorModalProps) {
    return (
        <Modal
            visible={visible}
            message={"서버 오류가 발생했습니다.\n잠시 후 다시 시도해주세요."}
            showLeftBtn={false}
            rightBtnText="확인"
            rightBtnVariant="primary"
            onRightBtnPress={onClose}
            onLeftBtnPress={() => {}}
        />
    );
}