/*
 * @Author: Tomato.Bei
 * @Date: 2022-08-05 15:34:13
 * @Last Modified by:   Tomato.Bei
 * @Last Modified time: 2022-08-05 15:34:13
 */
const getDefaultTime = {
    addZero(val: any) {
        return val < 10 ? `0${val}` : val;
    },

    defaultTime() {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return [
            `${year}-${this.addZero(month)}-${this.addZero(day)} 00:00:00`,
            `${year}-${this.addZero(month)}-${this.addZero(day)} 23:59:59`,
        ];
    },
};
export {getDefaultTime};
