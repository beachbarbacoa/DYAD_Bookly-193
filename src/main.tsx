import { createRoot } from 'react-dom/client';
import App from './App';  // This imports the default export
import './globals.css';

createRoot(document.getElementById('root')!).render(<App />);