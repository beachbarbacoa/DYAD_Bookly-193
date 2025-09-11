import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Copy, QrCode } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import QRCode from "react-qr-code";

export const AffiliateLink = () => {
  const { businessId } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: business } = useQuery({
    queryKey: ['business', businessId],
    queryFn: async () => {
      const { data } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', businessId)
        .single();
      return data;
    }
  });

  const affiliateLink = `${window.location.origin}/reserve/${businessId}?affiliate=${user?.id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(affiliateLink);
    toast({
      title: "Copied!",
      description: "Affiliate link copied to clipboard",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{business?.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Affiliate Link</h2>
          <div className="flex items-center gap-2">
            <Input value={affiliateLink} readOnly className="flex-1" />
            <Button variant="outline" size="icon" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Business Information</h3>
            <p>{business?.description}</p>
            <p>Phone: {business?.phone}</p>
            <p>Email: {business?.email}</p>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-white rounded-lg">
            <QRCode 
              value={affiliateLink} 
              size={200} 
              level="H" 
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Scan this QR code to access your affiliate link
          </p>
        </div>
      </div>
    </div>
  );
};