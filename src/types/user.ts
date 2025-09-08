export type UserRole = 'admin' | 'business_owner' | 'employee' | 'concierge' | 'customer';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  businessId?: string; // For employees/business owners
  affiliateCode?: string; // For concierges
}