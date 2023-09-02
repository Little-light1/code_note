import React, { FC } from "react";

const Wrapper: FC<any> = ({ className, ...props }) => <tbody {...props} className={`ease-table-tbody ${className}`} />;

export default Wrapper;
