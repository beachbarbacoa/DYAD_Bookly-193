export const Marketplace = () => {
  const [businesses, setBusinesses] = useState([]);

  // Add proper data handling
  useEffect(() => {
    const fetchBusinesses = async () => {
      const { data } = await supabase.from('businesses').select('*');
      setBusinesses(data || []); // Ensure array even if null
    };
    fetchBusinesses();
  }, []);

  return (
    <div className="p-4">
      {/* ... */}
      {businesses.map(business => (
        <Card key={business.id}>
          <CardHeader>{business.name || 'Unnamed Business'}</CardHeader> {/* Fallback */}
          <CardContent>
            <p>Type: {business.type || 'N/A'}</p> {/* Fallback */}
            <Button>Request Access</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}