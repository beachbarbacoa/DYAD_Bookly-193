import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root')!);
root.render(
  <div style={{
    width: '100vw',
    height: '100vh',
    backgroundColor: 'red',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '24px'
  }}>
    BASIC RENDER TEST
  </div>
);