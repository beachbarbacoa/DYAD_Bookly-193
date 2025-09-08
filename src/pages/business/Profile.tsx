import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { supabase } from "@/integrations/supabase/client"
import { useQuery, useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { showSuccess, showError } from "@/utils/toast"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/context/AuthContext"

export const Profile = ({ userRole }: { userRole: 'owner' | 'employee' }) => {
  const { user } = useAuth()
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatarUrl: ''
  })

  const { data: profile } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user?.id)
        .single()
      return data
    },
    enabled: !!user?.id,
    onSuccess: (data) => {
      if (data) {
        setProfileData({
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          email: data.email || '',
          phone: data.phone || '',
          avatarUrl: data.avatar_url || ''
        })
      }
    }
  })

  const { mutate: updateProfile } = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          phone: profileData.phone
        })
        .eq('id', user?.id)
      if (error) throw error
    },
    onSuccess: () => showSuccess('Profile updated successfully'),
    onError: () => showError('Failed to update profile')
  })

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user?.id) return

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        upsert: true
      })

    if (uploadError) {
      showError('Avatar upload failed')
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id)

    if (updateError) {
      showError('Failed to update avatar')
    } else {
      setProfileData({...profileData, avatarUrl: publicUrl})
      showSuccess('Avatar updated successfully')
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Profile</h2>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="space-y-4">
          <div className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-2">
              <AvatarImage src={profileData.avatarUrl} />
              <AvatarFallback>
                {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            <Label htmlFor="avatar-upload" className="cursor-pointer text-blue-500">
              Change Avatar
            </Label>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input 
                value={profileData.firstName}
                onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
              />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input 
                value={profileData.lastName}
                onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
              />
            </div>
          </div>

          <div>
            <Label>Email</Label>
            <Input 
              value={profileData.email}
              onChange={(e) => setProfileData({...profileData, email: e.target.value})}
              disabled={true}
            />
          </div>

          <div>
            <Label>Phone</Label>
            <Input 
              value={profileData.phone}
              onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
            />
          </div>

          {userRole === 'owner' && (
            <div className="pt-4">
              <Label>Business Role</Label>
              <p className="text-sm text-muted-foreground">Owner</p>
            </div>
          )}
        </div>
      </div>

      <Button onClick={() => updateProfile()}>Update Profile</Button>
    </div>
  )
}