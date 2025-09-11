import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Index from '@/pages/Index';
import { DebugMount } from '@/components/DebugMount';

function App() {
  return (
    <>
      <DebugMount />
      <Routes>
        <Route path="/" element={<Index />} />
        {/* Keep other routes */}
      </Routes>
      <Toaster />
    </>
  );
}

export default App;