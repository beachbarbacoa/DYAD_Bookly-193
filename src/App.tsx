import { Routes, Route } from 'react-router-dom';
import { TestComponent } from '@/components/TestComponent';
import { TestPage } from '@/pages/TestPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<TestComponent />} />
      <Route path="/test" element={<TestPage />} />
    </Routes>
  );
}

export default App;