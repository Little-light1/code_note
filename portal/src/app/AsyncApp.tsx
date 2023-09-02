import {LazyLoader} from '@gwaapp/ease';
import {asyncI18n} from './i18n';

const AsyncApp = LazyLoader(async () => {
    await asyncI18n();

    const App = await import('./App');

    // eslint-disable-next-line react/jsx-pascal-case
    return App;
});

export default AsyncApp;
