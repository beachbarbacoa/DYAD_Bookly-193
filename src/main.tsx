import { createRoot } from 'react-dom/client';
import App from './App';  // Default import
import './globals.css';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);