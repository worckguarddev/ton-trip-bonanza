export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bonus_cards: {
        Row: {
          benefits: Json | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean | null
          price: number
          rarity: string
          title: string
          updated_at: string
        }
        Insert: {
          benefits?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          price: number
          rarity: string
          title: string
          updated_at?: string
        }
        Update: {
          benefits?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          price?: number
          rarity?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      bot_settings: {
        Row: {
          bot_token: string | null
          channel_id: string | null
          channel_name: string | null
          channel_url: string | null
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          bot_token?: string | null
          channel_id?: string | null
          channel_name?: string | null
          channel_url?: string | null
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          bot_token?: string | null
          channel_id?: string | null
          channel_name?: string | null
          channel_url?: string | null
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      referral_links: {
        Row: {
          created_at: string
          id: string
          processed: boolean
          referred_telegram_id: number
          referrer_telegram_id: number
          start_param: string
        }
        Insert: {
          created_at?: string
          id?: string
          processed?: boolean
          referred_telegram_id: number
          referrer_telegram_id: number
          start_param: string
        }
        Update: {
          created_at?: string
          id?: string
          processed?: boolean
          referred_telegram_id?: number
          referrer_telegram_id?: number
          start_param?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          bonus_amount: number | null
          created_at: string
          id: string
          referred_telegram_id: number
          referrer_telegram_id: number
          status: string
        }
        Insert: {
          bonus_amount?: number | null
          created_at?: string
          id?: string
          referred_telegram_id: number
          referrer_telegram_id: number
          status?: string
        }
        Update: {
          bonus_amount?: number | null
          created_at?: string
          id?: string
          referred_telegram_id?: number
          referrer_telegram_id?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_telegram_id_fkey"
            columns: ["referred_telegram_id"]
            isOneToOne: false
            referencedRelation: "telegram_users"
            referencedColumns: ["telegram_id"]
          },
          {
            foreignKeyName: "referrals_referrer_telegram_id_fkey"
            columns: ["referrer_telegram_id"]
            isOneToOne: false
            referencedRelation: "telegram_users"
            referencedColumns: ["telegram_id"]
          },
        ]
      }
      telegram_users: {
        Row: {
          bio: string | null
          created_at: string
          first_name: string
          id: string
          is_subscribed: boolean | null
          language_code: string | null
          last_name: string | null
          photo_url: string | null
          referrer_id: number | null
          start_param: string | null
          subscription_checked_at: string | null
          telegram_id: number
          updated_at: string
          username: string | null
          wallet_address: string | null
          wallet_chain: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          first_name: string
          id?: string
          is_subscribed?: boolean | null
          language_code?: string | null
          last_name?: string | null
          photo_url?: string | null
          referrer_id?: number | null
          start_param?: string | null
          subscription_checked_at?: string | null
          telegram_id: number
          updated_at?: string
          username?: string | null
          wallet_address?: string | null
          wallet_chain?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          first_name?: string
          id?: string
          is_subscribed?: boolean | null
          language_code?: string | null
          last_name?: string | null
          photo_url?: string | null
          referrer_id?: number | null
          start_param?: string | null
          subscription_checked_at?: string | null
          telegram_id?: number
          updated_at?: string
          username?: string | null
          wallet_address?: string | null
          wallet_chain?: string | null
        }
        Relationships: []
      }
      trips: {
        Row: {
          bonus_earned: number | null
          created_at: string
          departure_date: string
          description: string | null
          from_location: string
          id: string
          price: number | null
          return_date: string | null
          status: string
          title: string
          to_location: string
          updated_at: string
          user_telegram_id: number
        }
        Insert: {
          bonus_earned?: number | null
          created_at?: string
          departure_date: string
          description?: string | null
          from_location: string
          id?: string
          price?: number | null
          return_date?: string | null
          status?: string
          title: string
          to_location: string
          updated_at?: string
          user_telegram_id: number
        }
        Update: {
          bonus_earned?: number | null
          created_at?: string
          departure_date?: string
          description?: string | null
          from_location?: string
          id?: string
          price?: number | null
          return_date?: string | null
          status?: string
          title?: string
          to_location?: string
          updated_at?: string
          user_telegram_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "trips_user_telegram_id_fkey"
            columns: ["user_telegram_id"]
            isOneToOne: false
            referencedRelation: "telegram_users"
            referencedColumns: ["telegram_id"]
          },
        ]
      }
      user_balances: {
        Row: {
          bonus_points: number | null
          id: string
          rub_balance: number | null
          ton_balance: number | null
          total_earned: number | null
          total_spent: number | null
          updated_at: string
          user_telegram_id: number
        }
        Insert: {
          bonus_points?: number | null
          id?: string
          rub_balance?: number | null
          ton_balance?: number | null
          total_earned?: number | null
          total_spent?: number | null
          updated_at?: string
          user_telegram_id: number
        }
        Update: {
          bonus_points?: number | null
          id?: string
          rub_balance?: number | null
          ton_balance?: number | null
          total_earned?: number | null
          total_spent?: number | null
          updated_at?: string
          user_telegram_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_balances_user_telegram_id_fkey"
            columns: ["user_telegram_id"]
            isOneToOne: true
            referencedRelation: "telegram_users"
            referencedColumns: ["telegram_id"]
          },
        ]
      }
      user_cards: {
        Row: {
          blockchain_address: string | null
          card_id: string
          id: string
          is_rented: boolean | null
          is_withdrawn: boolean | null
          purchased_at: string
          rent_price: number | null
          rent_until: string | null
          user_telegram_id: number
        }
        Insert: {
          blockchain_address?: string | null
          card_id: string
          id?: string
          is_rented?: boolean | null
          is_withdrawn?: boolean | null
          purchased_at?: string
          rent_price?: number | null
          rent_until?: string | null
          user_telegram_id: number
        }
        Update: {
          blockchain_address?: string | null
          card_id?: string
          id?: string
          is_rented?: boolean | null
          is_withdrawn?: boolean | null
          purchased_at?: string
          rent_price?: number | null
          rent_until?: string | null
          user_telegram_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_cards_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "bonus_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_cards_user_telegram_id_fkey"
            columns: ["user_telegram_id"]
            isOneToOne: false
            referencedRelation: "telegram_users"
            referencedColumns: ["telegram_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_user_if_not_exists: {
        Args: {
          telegram_id_param: number
          first_name_param: string
          last_name_param?: string
          username_param?: string
        }
        Returns: string
      }
      process_referral_bonus: {
        Args: { referrer_id: number; purchase_amount: number }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
