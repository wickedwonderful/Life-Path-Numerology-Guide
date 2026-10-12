import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Sparkles, RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error inside Cosmic Path component tree:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#FAF7F2] dark:bg-[#141311] text-[#2C2723] dark:text-[#F5F2EC]">
          <div className="max-w-md w-full bg-white dark:bg-[#1E1C19] border border-[#EAE3D9] dark:border-[#342F2A] rounded-3xl p-8 text-center shadow-xl space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#C87A5E]/15 text-[#C87A5E] flex items-center justify-center">
              <Sparkles className="w-7 h-7 animate-spin" />
            </div>
            <h2 className="text-xl font-serif font-bold text-[#2C2723] dark:text-[#F5F2EC]">
              Aligning Cosmic Energy
            </h2>
            <p className="text-xs text-[#7A7369] dark:text-[#A69E92] leading-relaxed">
              A temporary disruption occurred while rendering this celestial view. Your saved records are secure.
            </p>
            {this.state.error?.message && (
              <div className="p-3 bg-stone-100 dark:bg-stone-900 rounded-xl text-[11px] text-stone-600 dark:text-stone-400 font-mono text-left overflow-x-auto max-h-24">
                {this.state.error.message}
              </div>
            )}
            <div className="pt-2">
              <button
                onClick={this.handleReset}
                className="w-full inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-[#2C2723] dark:bg-[#F5F2EC] text-white dark:text-[#2C2723] font-bold text-xs hover:opacity-90 transition-opacity shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Restore Sanctuary &amp; Reload</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
