import React from 'react';

export const handleFormItemLabel = (title: string) => (
    <div
        title={title}
        style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        }}
    >
        {title}
    </div>
);
