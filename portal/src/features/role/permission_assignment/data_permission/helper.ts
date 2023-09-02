import _ from 'lodash';
import {utils} from '@components/tree';

const {tree2Flat} = utils;
export const memoTree2Flat: any = _.memoize((code: string, props: any) =>
    tree2Flat(props),
);
