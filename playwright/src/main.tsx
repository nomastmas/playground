import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './app.css';
import { AppProvider } from './contexts/AppContext.tsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <AppProvider>
    <App />
  </AppProvider>,
);
