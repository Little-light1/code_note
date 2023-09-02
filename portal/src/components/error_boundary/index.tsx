import React, { Component } from 'react';

class ErrorBoundary extends Component<any, {
  hasError: boolean;
}> {
  constructor(props: any) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      hasError: true
    });
  }

  render() {
    const {
      children
    } = this.props;
    const {
      hasError
    } = this.state;

    if (hasError) {
      return <h2>页面出错了404</h2>;
    }

    return children;
  }

}

export default ErrorBoundary;