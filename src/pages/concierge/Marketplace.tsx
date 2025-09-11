import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { showSuccess, showError } from "@/utils/toast";

export const Marketplace = () => {
  const { user } = useAuth();

  const { data: businesses, refetch } = useQuery({
    queryKey: ['businesses'],
    queryFn: async () => {
      const { data } = await supabase
        .from('businesses')
        .select('*, concierge_applications!left(status)')
        .eq('is_active', true)
        .eq('is_listed', true);
      return data || [];
    }
  });

  const { mutate: requestAccess } = useMutation({
    mutationFn: async (businessId: string) => {
      const { error } = await supabase
        .from('concierge_applications')
        .insert({
          business_id: businessId,
          concierge_id: user?.id,
          status: 'pending'
        });
      if (error) throw error;
    },
    onSuccess: () => {
      showSuccess('Access requested successfully');
      refetch();
    },
    onError: () => showError('Failed to request access')
  });

  const getButtonState = (business: any) => {
    if (!business.concierge_applications) return 'request';
    if (business.concierge_applications.status === 'pending') return 'pending';
    if (business.concierge_applications.status === 'approved') return 'approved';
    return 'request';
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Business Marketplace</h2>
      {businesses?.map(business => (
        <div key={business.id} className="p-4 border rounded-lg">
          <h3 className="text-lg font-medium">{business.name}</h3>
          <p className="text-sm text-gray-600 mb-2">
            {business.description || 'No description available'}
          </p>
          {getButtonState(business) === 'request' && (
            <Button onClick={() => requestAccess(business.id)}>
              Request Access
            </Button>
          )}
          {getButtonState(business) === 'pending' && (
            <Button variant="outline" disabled>
              Awaiting Approval
            </Button>
          )}
          {getButtonState(business) === 'approved' && (
            <Button variant="secondary">
              View Affiliate Link
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};