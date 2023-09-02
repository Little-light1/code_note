import React, { FC } from "react";

interface HeaderWrapperProps {
  className: string;
}

const HeaderWrapper: FC<HeaderWrapperProps> = ({ children, className }) => <thead className={className}>{children}</thead>;

export default HeaderWrapper;
