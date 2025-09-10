import { SafeRender } from '@/lib/safeRender';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const Marketplace = () => {
  const { data: businesses, isLoading } = useQuery({
    queryKey: ['businesses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      return data || [];
    }
  });

  if (isLoading) {
    return <div className="p-4">Loading businesses...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Business Marketplace</h2>
      {businesses?.map(business => (
        <Card key={business.id} className="p-4">
          <CardHeader className="text-lg font-medium">
            <SafeRender value={business.name} fallback="Unnamed Business" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Type: <SafeRender value={business.type} fallback="Not specified" />
            </p>
            <Button className="mt-2">Request Access</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};