import { useNavigate } from 'react-router-dom';
// ... other imports

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  
  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // ... rest of your context logic
};