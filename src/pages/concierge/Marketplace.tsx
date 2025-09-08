import { SafeRender } from '@/lib/safeRender';

export const Marketplace = () => {
  // ... existing code

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Business Marketplace</h2>
      {businesses.map(business => (
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
}