import React, {FC, useMemo, useState} from 'react';
import {Input, InputProps} from 'antd';
import {
    emailEncryption,
    IDCardEncryption,
    phoneEncryption,
} from '@/common/utils/reg'; // 脱敏类型

export enum EncryptInputType {
    Phone,
    // 手机号
    IDCard,
    // 身份证
    Email, // 邮箱
}
interface EncryptInputProps extends Omit<InputProps, 'type' | 'onChange'> {
    type: EncryptInputType;
    value?: string;
    onChange?: (value: string) => void;
}
/**
 * 脱敏处理输入框组件
 * @param props
 * @returns
 */

const EncryptInput: FC<EncryptInputProps> = (props) => {
    const {value, onChange, type, ...args} = props; // 是否已经首次清除内容

    const [hasClear, setHasClear] = useState(false); // 显示文本

    const getDisplayValue = useMemo(() => {
        if (!value || hasClear) {
            return value;
        }

        if (type === EncryptInputType.Phone) {
            return phoneEncryption(value);
        }

        if (type === EncryptInputType.Email) {
            return emailEncryption(value);
        }

        if (type === EncryptInputType.IDCard) {
            return IDCardEncryption(value);
        }

        return value;
    }, [hasClear, type, value]);

    const onInputChange = (e: any) => {
        onChange && onChange(e.target.value || '');
    };

    const onInputFocus = () => {
        if (!hasClear) {
            onChange && onChange('');
        }

        setHasClear(true);
    };

    return (
        <Input
            {...args}
            value={getDisplayValue}
            onChange={onInputChange}
            onFocus={onInputFocus}
        />
    );
};

export default EncryptInput;
