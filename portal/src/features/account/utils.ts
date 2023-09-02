// 随机产生8位数密码(用大写字母、小写字母、数字、符号四种中至少包含三种且必须包含数字和符号)
export const passWordClick = () => {
    function randomPassword(length: number) {
        length = Number(length); // Limit length

        if (length < 6) {
            length = 6;
        } else if (length > 16) {
            length = 16;
        }

        const passwordArray = [
            'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            'abcdefghijklmnopqrstuvwxyz',
            '1234567890',
            '!@#$%&*()',
        ];
        const password = [];
        let n = 0;

        for (let i = 0; i < length; i += 1) {
            if (password.length < length - 4) {
                const arrayRandom = Math.floor(Math.random() * 4);
                const passwordItem = passwordArray[arrayRandom];
                const item =
                    passwordItem[
                        Math.floor(Math.random() * passwordItem.length)
                    ];
                password.push(item);
            } else {
                const newItem = passwordArray[n];
                const lastItem =
                    newItem[Math.floor(Math.random() * newItem.length)];
                const spliceIndex = Math.floor(Math.random() * password.length);
                password.splice(spliceIndex, 0, lastItem);
                n += 1;
            }
        }

        return password.join('');
    }

    return randomPassword(8);
};
