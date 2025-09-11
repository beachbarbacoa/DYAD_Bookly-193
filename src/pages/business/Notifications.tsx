import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Notifications = () => {
  const { data: requests } = useQuery({
    queryKey: ['conciergeRequests'],
    queryFn: async () => {
      const { data } = await supabase
        .from('concierge_applications')
        .select(`
          *,
          concierge:concierge_id (first_name, last_name, email)
        `)
        .eq('business_id', 'current_business_id')
        .eq('status', 'pending');
      return data || [];
    }
  });

  const { mutate: approveRequest } = useMutation({
    mutationFn: async (requestId: string) => {
      const { error } = await supabase
        .from('concierge_applications')
        .update({ status: 'approved' })
        .eq('id', requestId);
      if (error) throw error;
    },
    onSuccess: () => showSuccess('Request approved'),
    onError: () => showError('Failed to approve request')
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Notifications</h2>
      
      <div className="space-y-4">
        <h3 className="font-medium">Pending Concierge Requests</h3>
        {requests?.length === 0 ? (
          <p className="text-sm text-muted-foreground">No pending requests</p>
        ) : (
          requests?.map(request => (
            <div key={request.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    {request.concierge.first_name} {request.concierge.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {request.concierge.email}
                  </p>
                  <p className="text-sm mt-2">{request.application_message}</p>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => approveRequest(request.id)}
                >
                  Approve
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Existing notification settings */}
    </div>
  );
};