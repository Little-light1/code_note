/*
 * @Author: zhangzhen
 * @Date: 2022-06-22 08:49:22
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-09-19 14:48:19
 *
 */
import React, {
    FC,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {useExternal} from 'ahooks';
import {Status} from 'ahooks/lib/useExternal';
import {SkinMap} from '@/common/init/configs';

export interface Skin {
    path: string;
    title: string;
    key: string;
}
export type SetSkin = React.Dispatch<React.SetStateAction<Skin>>;
interface Context {
    skins: Skin[];
    status: Status;
    setSkin?: SetSkin;
    register?: (id: string, handler: (skin: Skin) => void) => void;
}
interface Handlers {
    [key: string]: (skin: Skin) => void;
}
const SkinContext = React.createContext<Context>({} as any);

const SkinProvider: FC = ({children}) => {
    const [skins] = useState(Object.values(SkinMap));
    const [skin, setSkin] = useState(SkinMap.default);
    const handlers = useRef<Handlers>({});
    const status = useExternal(skin?.path);

    const register = useCallback((id: string, handler) => {
        if (typeof id === 'undefined') {
            throw new Error('skin changed handler id is required');
        }

        handlers.current[id] = handler;
    }, []);

    const value = useMemo(
        () => ({status, skins, setSkin, register}),
        [register, skins, status],
    );

    useEffect(() => {
        Object.keys(handlers.current).forEach((id) => {
            const handler = handlers.current[id];

            try {
                handler(skin);
            } catch (error) {
                console.error(`skin handler error ${id}`);
            }
        });
    }, [skin]);
    return (
        <SkinContext.Provider value={value}>{children}</SkinContext.Provider>
    );
};

function useSkin() {
    const context = React.useContext(SkinContext);

    if (context === undefined) {
        throw new Error(`useSkin must be used within a SkinProvider`);
    }

    return context;
}

export {SkinProvider, useSkin};
