const ApplyModal = ({ businessId }: { businessId: string }) => {
  const [message, setMessage] = useState('')
  const [commissionType, setCommissionType] = useState<'percentage'|'fixed'>('percentage')
  const [commissionValue, setCommissionValue] = useState(10)

  const handleApply = async () => {
    await supabase.from('concierge_applications').insert({
      business_id: businessId,
      concierge_id: user.id,
      commission_type: commissionType,
      commission_value: commissionValue,
      application_message: message
    })
  }
}