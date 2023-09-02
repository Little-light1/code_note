import enUS from 'antd/lib/locale-provider/en_US';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import esES from 'antd/lib/locale-provider/es_ES';
import easeEnUS from '@gwaapp/ease/dist/locale-provider/en_US.json';
import easeZhCN from '@gwaapp/ease/dist/locale-provider/zh_CN.json';
import easeEsES from '@gwaapp/ease/dist/locale-provider/es_ES.json';

export type Languages = 'zh' | 'en' | 'es';

export const Locals = {
    zh: '中文',
    en: 'English',
    es: 'español',
};

export const AntdLocals = {
    zh: zhCN,
    en: enUS,
    es: esES,
};

export const EaseLocals = {
    zh: easeZhCN,
    en: easeEnUS,
    es: easeEsES,
};

export interface ILocals {
    zh: string;
    en: string;
    es: string;
}
