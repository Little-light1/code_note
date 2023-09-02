import React from 'react';

const vaiables = [
    {
        title: '验证码',
        className: 'icon-portal-verificationCode',
    },
];

const IconfontDemo = () => (
    <div
        style={{
            height: '100%',
        }}
    >
        {vaiables.map(({className, title}) => (
            <span className={`iconfont ${className}`} key={title} />
        ))}
    </div>
);

export default IconfontDemo;
