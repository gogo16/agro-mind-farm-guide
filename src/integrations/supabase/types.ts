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
      eu_market_prices: {
        Row: {
          begin_date: string
          created_at: string
          currency: string
          end_date: string
          id: string
          market_code: string
          market_name: string
          member_state_code: string
          member_state_name: string
          price: number
          product_code: string
          product_name: string
          reference_period: string
          stage_code: string
          stage_name: string
          unit: string
          updated_at: string
          week_number: number | null
        }
        Insert: {
          begin_date: string
          created_at?: string
          currency?: string
          end_date: string
          id?: string
          market_code: string
          market_name: string
          member_state_code: string
          member_state_name: string
          price: number
          product_code: string
          product_name: string
          reference_period: string
          stage_code: string
          stage_name: string
          unit: string
          updated_at?: string
          week_number?: number | null
        }
        Update: {
          begin_date?: string
          created_at?: string
          currency?: string
          end_date?: string
          id?: string
          market_code?: string
          market_name?: string
          member_state_code?: string
          member_state_name?: string
          price?: number
          product_code?: string
          product_name?: string
          reference_period?: string
          stage_code?: string
          stage_name?: string
          unit?: string
          updated_at?: string
          week_number?: number | null
        }
        Relationships: []
      }
      fields: {
        Row: {
          cod_parcela: string
          coordonate_gps: Json | null
          created_at: string
          culoare: string | null
          cultura: string | null
          data_insamantare: string | null
          data_recoltare: string | null
          data_stergerii: string | null
          id: string
          ingrasaminte_folosite: string | null
          istoric_activitati: Json | null
          nume_teren: string
          suprafata: number
          updated_at: string
          user_id: string
          varietate: string | null
        }
        Insert: {
          cod_parcela: string
          coordonate_gps?: Json | null
          created_at?: string
          culoare?: string | null
          cultura?: string | null
          data_insamantare?: string | null
          data_recoltare?: string | null
          data_stergerii?: string | null
          id?: string
          ingrasaminte_folosite?: string | null
          istoric_activitati?: Json | null
          nume_teren: string
          suprafata: number
          updated_at?: string
          user_id: string
          varietate?: string | null
        }
        Update: {
          cod_parcela?: string
          coordonate_gps?: Json | null
          created_at?: string
          culoare?: string | null
          cultura?: string | null
          data_insamantare?: string | null
          data_recoltare?: string | null
          data_stergerii?: string | null
          id?: string
          ingrasaminte_folosite?: string | null
          istoric_activitati?: Json | null
          nume_teren?: string
          suprafata?: number
          updated_at?: string
          user_id?: string
          varietate?: string | null
        }
        Relationships: []
      }
      inventory: {
        Row: {
          cantitate_status: string | null
          categorie_element: string
          created_at: string
          data_stergerii: string | null
          id: string
          locatia: string | null
          nume_element: string
          pret: number | null
          tip_tranzactie: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cantitate_status?: string | null
          categorie_element: string
          created_at?: string
          data_stergerii?: string | null
          id?: string
          locatia?: string | null
          nume_element: string
          pret?: number | null
          tip_tranzactie?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cantitate_status?: string | null
          categorie_element?: string
          created_at?: string
          data_stergerii?: string | null
          id?: string
          locatia?: string | null
          nume_element?: string
          pret?: number | null
          tip_tranzactie?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      price_history: {
        Row: {
          change_amount: number | null
          change_percent: number | null
          created_at: string
          currency: string
          data_source: string | null
          date: string
          id: string
          price: number
          product_code: string
          volume: number | null
        }
        Insert: {
          change_amount?: number | null
          change_percent?: number | null
          created_at?: string
          currency: string
          data_source?: string | null
          date: string
          id?: string
          price: number
          product_code: string
          volume?: number | null
        }
        Update: {
          change_amount?: number | null
          change_percent?: number | null
          created_at?: string
          currency?: string
          data_source?: string | null
          date?: string
          id?: string
          price?: number
          product_code?: string
          volume?: number | null
        }
        Relationships: []
      }
      product_mapping: {
        Row: {
          created_at: string
          eu_product_code: string
          eu_product_name: string
          id: string
          romanian_name: string
          romanian_symbol: string
        }
        Insert: {
          created_at?: string
          eu_product_code: string
          eu_product_name: string
          id?: string
          romanian_name: string
          romanian_symbol: string
        }
        Update: {
          created_at?: string
          eu_product_code?: string
          eu_product_name?: string
          id?: string
          romanian_name?: string
          romanian_symbol?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          county: string | null
          created_at: string
          farm_name: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          county?: string | null
          created_at?: string
          farm_name?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          county?: string | null
          created_at?: string
          farm_name?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      document_status: "verified" | "missing" | "expired" | "complete"
      inventory_type: "equipment" | "chemical" | "seeds" | "fuel" | "other"
      notification_priority: "high" | "medium" | "low"
      notification_type:
        | "task"
        | "weather"
        | "inventory"
        | "ai"
        | "financial"
        | "system"
      stock_level: "low" | "normal" | "high"
      sync_frequency: "daily" | "weekly" | "manual"
      task_priority: "high" | "medium" | "low"
      task_status: "pending" | "completed" | "in_progress"
      transaction_type: "income" | "expense"
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
    Enums: {
      document_status: ["verified", "missing", "expired", "complete"],
      inventory_type: ["equipment", "chemical", "seeds", "fuel", "other"],
      notification_priority: ["high", "medium", "low"],
      notification_type: [
        "task",
        "weather",
        "inventory",
        "ai",
        "financial",
        "system",
      ],
      stock_level: ["low", "normal", "high"],
      sync_frequency: ["daily", "weekly", "manual"],
      task_priority: ["high", "medium", "low"],
      task_status: ["pending", "completed", "in_progress"],
      transaction_type: ["income", "expense"],
    },
  },
} as const
