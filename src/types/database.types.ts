export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      business_concierge_relationships: {
        Row: {
          business_id: string
          commission_rate: number
          concierge_id: string
          created_at: string
          id: string
          is_active: boolean
          is_approved: boolean
        }
        Insert: {
          business_id: string
          commission_rate?: number
          concierge_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_approved?: boolean
        }
        Update: {
          business_id?: string
          commission_rate?: number
          concierge_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_approved?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "business_concierge_relationships_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_concierge_relationships_concierge_id_fkey"
            columns: ["concierge_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_form_configs: {
        Row: {
          business_id: string
          created_at: string
          display_order: number
          field_label: string
          field_name: string
          field_options: Json | null
          field_type: Database["public"]["Enums"]["form_field_type"]
          id: string
          is_active: boolean
          is_required: boolean
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          display_order?: number
          field_label: string
          field_name: string
          field_options?: Json | null
          field_type: Database["public"]["Enums"]["form_field_type"]
          id?: string
          is_active?: boolean
          is_required?: boolean
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          display_order?: number
          field_label?: string
          field_name?: string
          field_options?: Json | null
          field_type?: Database["public"]["Enums"]["form_field_type"]
          id?: string
          is_active?: boolean
          is_required?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_form_configs_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_hours: {
        Row: {
          business_id: string
          close_time: string
          created_at: string | null
          day: string
          id: string
          open_time: string
          updated_at: string | null
        }
        Insert: {
          business_id: string
          close_time: string
          created_at?: string | null
          day: string
          id?: string
          open_time: string
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          close_time?: string
          created_at?: string | null
          day?: string
          id?: string
          open_time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_hours_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_pricing: {
        Row: {
          business_id: string
          created_at: string
          currency: string
          default_commission_type: Database["public"]["Enums"]["commission_type"]
          default_commission_value: number
          id: string
          is_active: boolean
          reservation_fee: number
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          currency?: string
          default_commission_type?: Database["public"]["Enums"]["commission_type"]
          default_commission_value?: number
          id?: string
          is_active?: boolean
          reservation_fee?: number
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          currency?: string
          default_commission_type?: Database["public"]["Enums"]["commission_type"]
          default_commission_value?: number
          id?: string
          is_active?: boolean
          reservation_fee?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_pricing_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_telegram_configs: {
        Row: {
          business_id: string
          created_at: string
          id: string
          is_active: boolean
          notification_types: Json
          operator_name: string
          telegram_chat_id: string
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          notification_types?: Json
          operator_name: string
          telegram_chat_id: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          notification_types?: Json
          operator_name?: string
          telegram_chat_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_telegram_configs_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          address: string | null
          booking_window_days: number | null
          business_type: Database["public"]["Enums"]["business_type"] | null
          charge_amount: number | null
          created_at: string
          credit_card_policy: string | null
          currency: string | null
          default_concierge_commission: number | null
          description: string | null
          email: string
          external_calendar_sync: boolean | null
          id: string
          is_active: boolean
          is_listed: boolean | null
          max_party_size: number | null
          min_party_size_for_card: number | null
          name: string
          phone: string | null
          requires_credit_card: boolean
          stripe_account_id: string | null
          timezone: string | null
          type: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          address?: string | null
          booking_window_days?: number | null
          business_type?: Database["public"]["Enums"]["business_type"] | null
          charge_amount?: number | null
          created_at?: string
          credit_card_policy?: string | null
          currency?: string | null
          default_concierge_commission?: number | null
          description?: string | null
          email: string
          external_calendar_sync?: boolean | null
          id?: string
          is_active?: boolean
          is_listed?: boolean | null
          max_party_size?: number | null
          min_party_size_for_card?: number | null
          name: string
          phone?: string | null
          requires_credit_card?: boolean
          stripe_account_id?: string | null
          timezone?: string | null
          type: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          address?: string | null
          booking_window_days?: number | null
          business_type?: Database["public"]["Enums"]["business_type"] | null
          charge_amount?: number | null
          created_at?: string
          credit_card_policy?: string | null
          currency?: string | null
          default_concierge_commission?: number | null
          description?: string | null
          email?: string
          external_calendar_sync?: boolean | null
          id?: string
          is_active?: boolean
          is_listed?: boolean | null
          max_party_size?: number | null
          min_party_size_for_card?: number | null
          name?: string
          phone?: string | null
          requires_credit_card?: boolean
          stripe_account_id?: string | null
          timezone?: string | null
          type?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      commission_transactions: {
        Row: {
          business_id: string
          calculated_amount: number
          commission_type: Database["public"]["Enums"]["commission_type"]
          commission_value: number
          concierge_id: string
          created_at: string
          id: string
          is_paid: boolean
          paid_at: string | null
          payment_reference: string | null
          payout_reference: string | null
          processed_at: string | null
          reservation_fee: number
          reservation_id: string
          updated_at: string
        }
        Insert: {
          business_id: string
          calculated_amount: number
          commission_type: Database["public"]["Enums"]["commission_type"]
          commission_value: number
          concierge_id: string
          created_at?: string
          id?: string
          is_paid?: boolean
          paid_at?: string | null
          payment_reference?: string | null
          payout_reference?: string | null
          processed_at?: string | null
          reservation_fee?: number
          reservation_id: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          calculated_amount?: number
          commission_type?: Database["public"]["Enums"]["commission_type"]
          commission_value?: number
          concierge_id?: string
          created_at?: string
          id?: string
          is_paid?: boolean
          paid_at?: string | null
          payment_reference?: string | null
          payout_reference?: string | null
          processed_at?: string | null
          reservation_fee?: number
          reservation_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "commission_transactions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_transactions_concierge_id_fkey"
            columns: ["concierge_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_transactions_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      concierge_applications: {
        Row: {
          application_message: string | null
          applied_at: string
          business_id: string
          commission_type: Database["public"]["Enums"]["commission_type"]
          commission_value: number
          concierge_id: string
          created_at: string
          id: string
          responded_at: string | null
          responded_by: string | null
          response_message: string | null
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
        }
        Insert: {
          application_message?: string | null
          applied_at?: string
          business_id: string
          commission_type?: Database["public"]["Enums"]["commission_type"]
          commission_value?: number
          concierge_id: string
          created_at?: string
          id?: string
          responded_at?: string | null
          responded_by?: string | null
          response_message?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Update: {
          application_message?: string | null
          applied_at?: string
          business_id?: string
          commission_type?: Database["public"]["Enums"]["commission_type"]
          commission_value?: number
          concierge_id?: string
          created_at?: string
          id?: string
          responded_at?: string | null
          responded_by?: string | null
          response_message?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "concierge_applications_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concierge_applications_concierge_id_fkey"
            columns: ["concierge_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concierge_applications_responded_by_fkey"
            columns: ["responded_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_logs: {
        Row: {
          business_id: string | null
          created_at: string | null
          error: string | null
          id: string
          notification_type: string
          reservation_id: string | null
          status: string
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          error?: string | null
          id?: string
          notification_type: string
          reservation_id?: string | null
          status: string
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          error?: string | null
          id?: string
          notification_type?: string
          reservation_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_logs_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_logs_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      operators: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          name: string
          telegram_chat_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          name: string
          telegram_chat_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          name?: string
          telegram_chat_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      referrers: {
        Row: {
          commission_rate: number
          created_at: string
          email: string
          id: string
          is_active: boolean
          name: string
          phone: string | null
          qr_code_token: string
          total_bookings: number
          total_commission: number
          updated_at: string
        }
        Insert: {
          commission_rate?: number
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          name: string
          phone?: string | null
          qr_code_token?: string
          total_bookings?: number
          total_commission?: number
          updated_at?: string
        }
        Update: {
          commission_rate?: number
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          name?: string
          phone?: string | null
          qr_code_token?: string
          total_bookings?: number
          total_commission?: number
          updated_at?: string
        }
        Relationships: []
      }
      reservation_custom_data: {
        Row: {
          created_at: string
          field_name: string
          field_value: string | null
          id: string
          reservation_id: string
        }
        Insert: {
          created_at?: string
          field_name: string
          field_value?: string | null
          id?: string
          reservation_id: string
        }
        Update: {
          created_at?: string
          field_name?: string
          field_value?: string | null
          id?: string
          reservation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservation_custom_data_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      reservation_files: {
        Row: {
          created_at: string
          field_name: string
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id: string
          reservation_id: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          field_name: string
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id?: string
          reservation_id: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          field_name?: string
          file_name?: string
          file_size?: number
          file_type?: string
          file_url?: string
          id?: string
          reservation_id?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservation_files_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservation_files_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          business_id: string | null
          commission_amount: number | null
          concierge_id: string | null
          created_at: string
          customer_id: string | null
          date: string
          denial_reason: string | null
          diners: number
          email: string
          external_booking_reference: string | null
          form_version: number | null
          id: string
          name: string
          payment_status: string | null
          phone: string | null
          pickup: string
          processed_at: string | null
          processed_by: string | null
          reservation_fee: number | null
          seating: string
          status: string
          telegram_message_id: string | null
          time: string
          updated_at: string
        }
        Insert: {
          business_id?: string | null
          commission_amount?: number | null
          concierge_id?: string | null
          created_at?: string
          customer_id?: string | null
          date: string
          denial_reason?: string | null
          diners: number
          email: string
          external_booking_reference?: string | null
          form_version?: number | null
          id?: string
          name: string
          payment_status?: string | null
          phone?: string | null
          pickup: string
          processed_at?: string | null
          processed_by?: string | null
          reservation_fee?: number | null
          seating: string
          status?: string
          telegram_message_id?: string | null
          time: string
          updated_at?: string
        }
        Update: {
          business_id?: string | null
          commission_amount?: number | null
          concierge_id?: string | null
          created_at?: string
          customer_id?: string | null
          date?: string
          denial_reason?: string | null
          diners?: number
          email?: string
          external_booking_reference?: string | null
          form_version?: number | null
          id?: string
          name?: string
          payment_status?: string | null
          phone?: string | null
          pickup?: string
          processed_at?: string | null
          processed_by?: string | null
          reservation_fee?: number | null
          seating?: string
          status?: string
          telegram_message_id?: string | null
          time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_concierge_id_fkey"
            columns: ["concierge_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          business_id: string | null
          business_role: Database["public"]["Enums"]["business_role"] | null
          commission_rate: number | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          is_active: boolean
          last_login_at: string | null
          last_name: string | null
          notification_preferences: Json | null
          organization_name: string | null
          phone: string | null
          qr_code_token: string | null
          stripe_customer_id: string | null
          total_bookings: number | null
          total_commission_earned: number | null
          updated_at: string
        }
        Insert: {
          business_id?: string | null
          business_role?: Database["public"]["Enums"]["business_role"] | null
          commission_rate?: number | null
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          is_active?: boolean
          last_login_at?: string | null
          last_name?: string | null
          notification_preferences?: Json | null
          organization_name?: string | null
          phone?: string | null
          qr_code_token?: string | null
          stripe_customer_id?: string | null
          total_bookings?: number | null
          total_commission_earned?: number | null
          updated_at?: string
        }
        Update: {
          business_id?: string | null
          business_role?: Database["public"]["Enums"]["business_role"] | null
          commission_rate?: number | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          last_name?: string | null
          notification_preferences?: Json | null
          organization_name?: string | null
          phone?: string | null
          qr_code_token?: string | null
          stripe_customer_id?: string | null
          total_bookings?: number | null
          total_commission_earned?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_commission: {
        Args: {
          p_business_id: string
          p_concierge_id: string
          p_reservation_id: string
        }
        Returns: number
      }
      check_auth_status: {
        Args: Record<PropertyKey, never>
        Returns: {
          email: string
          exists_in_auth: boolean
          has_profile: boolean
          is_confirmed: boolean
          password_match: boolean
        }[]
      }
      create_test_user: {
        Args: {
          email: string
          first_name: string
          last_name: string
          password: string
          role: string
        }
        Returns: undefined
      }
      verify_user_password: {
        Args: { password: string; user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      application_status: "pending" | "approved" | "denied" | "suspended"
      business_role: "admin" | "staff"
      business_type: "restaurant" | "tour_operator"
      commission_type: "percentage" | "fixed_amount" | "store_credit"
      form_field_type:
        | "text"
        | "email"
        | "phone"
        | "date"
        | "time"
        | "number"
        | "select"
        | "textarea"
        | "file_upload"
        | "credit_card_scan"
      user_role: "business_owner" | "concierge"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      application_status: ["pending", "approved", "denied", "suspended"],
      business_role: ["admin", "staff"],
      business_type: ["restaurant", "tour_operator"],
      commission_type: ["percentage", "fixed_amount", "store_credit"],
      form_field_type: [
        "text",
        "email",
        "phone",
        "date",
        "time",
        "number",
        "select",
        "textarea",
        "file_upload",
        "credit_card_scan",
      ],
      user_role: ["business_owner", "concierge"],
    },
  },
} as const
