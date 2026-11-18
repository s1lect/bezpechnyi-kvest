import { Component, type ErrorInfo, type ReactNode } from 'react';

interface State {
  error: Error | null;
}

/** Якщо квест зламався, учень бачить зрозуміле повідомлення, а не порожній екран. */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[Безпечний квест]', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="container page" role="alert">
        <h1>Щось пішло не так</h1>
        <p className="lead">Сторінка не завантажилася. Оновіть її або поверніться на карту. Ваш прогрес збережено.</p>
        <div className="hero__actions">
          <button className="btn btn--signal" onClick={() => window.location.reload()}>
            Оновити сторінку
          </button>
          <a className="btn btn--ghost" href="#/" onClick={() => this.setState({ error: null })}>
            До карти
          </a>
        </div>
      </div>
    );
  }
}
