import {useTranslation} from 'react-i18next';

export function useLang() {
    const {i18n} = useTranslation();
    const {language} = i18n;

    document.getElementsByTagName('html')[0].lang = language || 'zh';
}
