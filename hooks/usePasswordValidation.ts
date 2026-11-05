import { useState } from 'react';

export default function usePasswordValidation() {
    const [errors, setErrors] = useState({
        password: '',
        confirmPassword: '',
    });

    const setError = (field: keyof typeof errors, message: string) => {
        setErrors(prev => ({ ...prev, [field]: message }));
    };

    // 비밀번호 유효성 검사
    const validatePassword = (password: string) => {
        if (!password.trim()) {
            setError('password', '비밀번호를 입력해주세요.');
            return false;
        }
        if (password.length < 8) {
            setError('password', '비밀번호는 8자리 이상이어야 합니다.');
            return false;
        }
        if (password.length > 32) {
            setError('password', '비밀번호는 32자리 이하여야 합니다.');
            return false;
        }
        if (!/[a-z]/.test(password)) {
            setError('password', '영문 소문자를 포함해주세요.');
            return false;
        }
        if (!/[A-Z]/.test(password)) {
            setError('password', '영문 대문자를 포함해주세요.');
            return false;
        }
        if (!/[0-9]/.test(password)) {
            setError('password', '숫자를 포함해주세요.');
            return false;
        }
        if (!/[!@#$%^&*]/.test(password)) {
            setError('password', '특수문자를 포함해주세요.');
            return false;
        }
        setError('password', '');
        return true;
    };

    // 비밀번호 확인 유효성 검사
    const validateConfirmPassword = (password: string, confirmPassword: string) => {
        if (!confirmPassword.trim()) {
            setError('confirmPassword', '비밀번호 확인을 입력해주세요.');
            return false;
        }
        if (password !== confirmPassword) {
            setError('confirmPassword', '비밀번호가 일치하지 않습니다.');
            return false;
        }
        setError('confirmPassword', '');
        return true;
    };

    return {
        errors,
        validatePassword,
        validateConfirmPassword,
        setError,
    };
}