import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import isDev from '@/common/utils/isDev';
import showSystemInfo from '@/common/utils/systemLog';
import App from './app/AsyncApp';
import reportWebVitals from './reportWebVitals';

showSystemInfo();

const domNode = document.getElementById('root') as Element;
const root = createRoot(domNode);
root.render(
    <StrictMode>
        <App />
    </StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
if (isDev) {
    reportWebVitals(console.log);
}
