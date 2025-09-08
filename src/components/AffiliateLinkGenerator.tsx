const AffiliateLinkGenerator = ({ businessId, conciergeId }) => {
  const link = `https://bookly.com/reserve/${businessId}?affiliate=${conciergeId}`
  
  return (
    <div>
      <QRCode value={link} />
      <p>Or share this link: {link}</p>
    </div>
  )
}