import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { supabase } from "@/integrations/supabase/client"
import { useQuery } from "@tanstack/react-query"

type ConciergeApplication = {
  id: string
  concierge_id: string
  concierge_name: string
  status: 'pending' | 'approved' | 'rejected'
  commission_type: 'percentage' | 'fixed' | 'credit'
  commission_value: number
  application_message: string
}

export const ConciergeManagement = ({ userRole }: { userRole: 'owner' | 'employee' }) => {
  const [newCommissionType, setNewCommissionType] = useState<'percentage' | 'fixed' | 'credit'>('percentage')
  const [newCommissionValue, setNewCommissionValue] = useState(10)

  const { data: applications, refetch } = useQuery({
    queryKey: ['conciergeApplications'],
    queryFn: async () => {
      const { data } = await supabase
        .from('concierge_applications')
        .select(`
          id,
          concierge_id,
          user_profiles:concierge_id (first_name, last_name),
          status,
          commission_type,
          commission_value,
          application_message
        `)
        .eq('business_id', 'current_business_id') // Replace with actual business ID
      return data?.map(app => ({
        ...app,
        concierge_name: `${app.user_profiles?.first_name} ${app.user_profiles?.last_name}`
      })) as ConciergeApplication[]
    }
  })

  const handleApprove = async (applicationId: string) => {
    await supabase
      .from('concierge_applications')
      .update({ status: 'approved' })
      .eq('id', applicationId)
    refetch()
  }

  const handleReject = async (applicationId: string) => {
    await supabase
      .from('concierge_applications')
      .update({ status: 'rejected' })
      .eq('id', applicationId)
    refetch()
  }

  const handleUpdateCommission = async (conciergeId: string) => {
    if (userRole !== 'owner') return
    
    await supabase
      .from('concierge_applications')
      .update({
        commission_type: newCommissionType,
        commission_value: newCommissionValue
      })
      .eq('concierge_id', conciergeId)
      .eq('business_id', 'current_business_id')
    refetch()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Concierge Management</h2>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Concierge</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Message</TableHead>
              {userRole === 'owner' && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications?.map(app => (
              <TableRow key={app.id}>
                <TableCell>{app.concierge_name}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs ${
                    app.status === 'approved' ? 'bg-green-100 text-green-800' :
                    app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {app.status}
                  </span>
                </TableCell>
                <TableCell>
                  {app.commission_type === 'percentage' ? `${app.commission_value}%` :
                   app.commission_type === 'fixed' ? `$${app.commission_value}` :
                   'Store credit'}
                </TableCell>
                <TableCell className="max-w-xs truncate">{app.application_message}</TableCell>
                {userRole === 'owner' && app.status === 'pending' && (
                  <TableCell className="space-x-2">
                    <Button size="sm" onClick={() => handleApprove(app.id)}>Approve</Button>
                    <Button size="sm" variant="outline" onClick={() => handleReject(app.id)}>Reject</Button>
                  </TableCell>
                )}
                {userRole === 'owner' && app.status === 'approved' && (
                  <TableCell className="space-x-2">
                    <select 
                      value={newCommissionType}
                      onChange={(e) => setNewCommissionType(e.target.value as any)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                      <option value="credit">Store Credit</option>
                    </select>
                    <input
                      type="number"
                      value={newCommissionValue}
                      onChange={(e) => setNewCommissionValue(Number(e.target.value))}
                      className="border rounded px-2 py-1 w-20 text-sm"
                    />
                    <Button size="sm" onClick={() => handleUpdateCommission(app.concierge_id)}>
                      Update
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}