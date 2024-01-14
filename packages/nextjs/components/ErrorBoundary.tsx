"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import logger from "~~/services/logger.service";
import { notification } from "~~/utils/scaffold-eth";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    notification.error("An error occured");
    logger.error({ error, errorInfo });
  }

  public render() {
    return this.props.children;
  }
}

export default ErrorBoundary;
