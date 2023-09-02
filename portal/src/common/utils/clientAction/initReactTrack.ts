/*
 * @Author: zhangyu
 * @Date: 2022-08-15 16:23:27
 * @LastEditors: zhangyu
 * @LastEditTime: 2022-09-05 09:46:51
 * @Description:
 *
 */
import React from 'react';
import {ActionType} from './types';

interface InitReactTrack {
    onClickAction?: (message: any) => void;
}

const getReactFCInitializer = ({onClickAction}: InitReactTrack) => {
    const originalCreateElement = React.createElement;

    const propsWithTrackEvents = function (type: string, props: any) {
        const newProps = Object.assign(props);
        const reactClick = props.onClick;

        if (!Object.isFrozen(newProps)) {
            newProps.onClick = (e: any) => {
                // 默认门户oc
                onClickAction &&
                    onClickAction({
                        action: 'click',
                        system: 'oc',
                        ...props.action,
                    } as ActionType);
                reactClick && reactClick(e);
            };

            if (typeof Object.freeze === 'function') {
                Object.freeze(newProps);
            }
        }

        return newProps;
    };

    React.createElement = function (...args: any): any {
        const newArgs = args;
        const type = args[0];
        const props = args[1] || {};

        if (props.onClick && props.action) {
            newArgs[1] = propsWithTrackEvents(type, props);
        } // 未设置maxlength的input，设置默认maxlength为200

        if (
            ['input'].includes(type) &&
            props &&
            !props.hasOwnProperty('maxLength')
        ) {
            newArgs[1] = {
                ...props,
                ...{
                    maxLength: 200,
                },
            };
        }

        // eslint-disable-next-line prefer-spread
        return originalCreateElement.apply(null, newArgs);
    };
};

export default function initReactTrack({onClickAction}: InitReactTrack) {
    getReactFCInitializer({
        onClickAction,
    });
} // export default function initActionLogger({onClickAction}: {onClickAction?: (e: any) => void}) {
//     initReactTrack({onClickAction});
// }
