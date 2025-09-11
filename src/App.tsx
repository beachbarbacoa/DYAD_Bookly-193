import { Routes, Route } from 'react-router-dom';
import { RootErrorBoundary } from '@/components/RootErrorBoundary';
import { AuthErrorBoundary } from '@/components/AuthErrorBoundary';
import { Index } from '@/pages/Index';
import { Login } from '@/pages/Login';
import { SignUp } from '@/pages/SignUp';
import { NotFound } from '@/pages/NotFound'; // This one was already a default export

function App() {
  return (
    <RootErrorBoundary>
      <AuthErrorBoundary>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthErrorBoundary>
    </RootErrorBoundary>
  );
}

export default App;