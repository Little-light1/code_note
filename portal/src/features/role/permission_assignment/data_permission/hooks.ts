import {useCallback} from 'react';

export function useHelper() {
    const filterTable = useCallback((item, searchStr) => {
        const {leafTypeName = '', name = '', deviceModel = ''} = item;

        if (
            String(name).indexOf(searchStr) >= 0 ||
            String(leafTypeName).indexOf(searchStr) >= 0 ||
            String(deviceModel).indexOf(searchStr) >= 0
        ) {
            return true;
        }

        return false;
    }, []);
    return {
        filterTable,
    };
}
