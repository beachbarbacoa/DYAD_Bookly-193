import { supabase } from '@/integrations/supabase/client';

export const logError = async (error: any, context: string) => {
  console.error(`[${context}]`, error);
  
  try {
    await supabase
      .from('error_logs')
      .insert({
        error_message: error.message,
        error_stack: error.stack,
        context,
        created_at: new Date().toISOString()
      });
  } catch (loggingError) {
    console.error('Failed to log error:', loggingError);
  }
};