/*
 * @Author: zhangzhen
 * @Date: 2022-10-26 14:07:10
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-10-26 14:12:53
 *
 */
/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare module '*.module.css' {
    const classes: {
        readonly [key: string]: string;
    };
    export default classes;
}

declare module '*.module.scss' {
    const content: {
        readonly [key: string]: string;
    };
    export default content;
}

declare module '*.module.sass' {
    const classes: {
        readonly [key: string]: string;
    };
    export default classes;
}

declare module '*.scss' {
    const classes: {
        [key: string]: string;
    };
    export default classes;
}

declare module '*.svg' {
    const content: string;

    export default content;
}

declare module '*.css';
