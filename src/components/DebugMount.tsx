import { useEffect } from 'react';
import { showSuccess } from '@/utils/toast';

export const DebugMount = () => {
  useEffect(() => {
    console.log('DebugMount: Component mounted');
    showSuccess('Application mounted successfully');
    return () => console.log('DebugMount: Component unmounted');
  }, []);

  return null;
};