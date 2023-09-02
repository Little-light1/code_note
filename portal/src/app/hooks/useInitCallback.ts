import {Runtime} from '@gwaapp/ease';
import type {Tab} from '@/features/index/header/tabs/types';
import {onLocationChange} from '../actions';

const useInitCallback = (runtime: Runtime) => {
    const {dispatch} = runtime.store;
    return {
        onLocationChange: (tab: Tab, prevTab?: Tab | null) =>
            dispatch(
                onLocationChange({
                    tab,
                    prevTab,
                }),
            ),
    };
};

export default useInitCallback;
