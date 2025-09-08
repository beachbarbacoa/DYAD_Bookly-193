import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"
import { showError, showSuccess } from "@/utils/toast"
import { supabase } from "@/integrations/supabase/client"

export const SignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    companyName: '',
    role: 'concierge'
  })
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            company_name: formData.companyName,
            role: formData.role
          }
        }
      })

      if (error) throw error
      
      // Create user profile after successful signup
      if (data.user) {
        await supabase.from('user_profiles').insert({
          id: data.user.id,
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          business_role: formData.role === 'business' ? 'owner' : null,
          company_name: formData.companyName
        })
      }

      showSuccess('Sign up successful! Please check your email to confirm your account.')
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        companyName: '',
        role: 'concierge'
      })
    } catch (error) {
      showError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center">Create an Account</h2>
        <form className="space-y-6" onSubmit={handleSignUp}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              type="text"
              required
              value={formData.companyName}
              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div>
            <Label>Account Type</Label>
            <div className="flex space-x-4 mt-2">
              <Button
                type="button"
                variant={formData.role === 'concierge' ? 'default' : 'outline'}
                onClick={() => setFormData({...formData, role: 'concierge'})}
              >
                Concierge
              </Button>
              <Button
                type="button"
                variant={formData.role === 'business' ? 'default' : 'outline'}
                onClick={() => setFormData({...formData, role: 'business'})}
              >
                Business
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>
        <div className="text-center text-sm">
          Already have an account?{' '}
          <Link to="/" className="text-blue-500 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}