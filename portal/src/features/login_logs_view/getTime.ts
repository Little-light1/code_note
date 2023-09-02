/*
 * @Author: Tomato.Bei
 * @Date: 2022-08-05 15:35:20
 * @Last Modified by:   Tomato.Bei
 * @Last Modified time: 2022-08-05 15:35:20
 */
const getDefaultTime = {
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

    addZero(val: any) {
        return val < 10 ? `0${val}` : val;
    },
};
export {getDefaultTime};
