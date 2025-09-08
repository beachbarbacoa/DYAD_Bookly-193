import { AuthProvider } from '@/context/AuthContext'; // Now using named export
// ... rest of your imports

function App() {
  return (
    <BrowserRouter>
      <AuthProvider> {/* Now using the named export */}
        {/* ... rest of your app */}
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;