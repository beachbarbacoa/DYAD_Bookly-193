import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export const Marketplace = () => {
  const [businesses, setBusinesses] = useState([])

  return (
    <div className="p-4">
      <div className="flex mb-4">
        <Input placeholder="Search businesses..." />
        <Button variant="outline">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {businesses.map(business => (
          <Card key={business.id}>
            <CardHeader>{business.name}</CardHeader>
            <CardContent>
              <p>Type: {business.type}</p>
              <p>Commission: {business.commission_type}</p>
              <Button>Request Access</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}