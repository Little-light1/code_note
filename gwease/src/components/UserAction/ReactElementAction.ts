/*
 * @Author: sun.t
 * @Date: 2022-11-22 09:46:38
 * @Last Modified by: sun.t
 * @Last Modified time: 2022-11-22 11:27:25
 */
import React from 'react';
import {InitReactTrack, ElementProps, DefaultAction} from './types';

class ReactElementAction {
    defaultAction: DefaultAction | undefined;

    constructor({onClick, defaultAction = {}}: InitReactTrack) {
        this.getReactFCInitializer({
            onClick,
        });

        this.defaultAction = defaultAction;
    }

    getReactFCInitializer({onClick}: InitReactTrack) {
        const originalCreateElement = React.createElement;

        const propsWithTrackEvents = (type: string, props: ElementProps) => {
            const newProps = Object.assign(props);
            const reactClick = props.onClick;

            if (!Object.isFrozen(newProps)) {
                newProps.onClick = (e: any) => {
                    onClick &&
                        onClick({
                            action: 'click',
                            // system: 'oc', // 默认系统
                            ...this.defaultAction,
                            ...props.action,
                        });
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
            }

            // 未设置maxlength的input，设置默认maxlength为200
            // if (['input'].includes(type) && props && !props.hasOwnProperty('maxLength')) {
            //     newArgs[1] = {
            //         ...props,
            //         ...{
            //             maxLength: 200,
            //         },
            //     };
            // }

            // eslint-disable-next-line prefer-spread
            return originalCreateElement.apply(null, newArgs);
        };
    }
}

export default ReactElementAction;
