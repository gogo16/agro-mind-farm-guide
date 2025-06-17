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
      apia_documents: {
        Row: {
          document_data: Json
          document_type: string
          file_url: string | null
          generated_at: string
          id: string
          status: string | null
          submission_date: string | null
          user_id: string
        }
        Insert: {
          document_data?: Json
          document_type: string
          file_url?: string | null
          generated_at?: string
          id?: string
          status?: string | null
          submission_date?: string | null
          user_id: string
        }
        Update: {
          document_data?: Json
          document_type?: string
          file_url?: string | null
          generated_at?: string
          id?: string
          status?: string | null
          submission_date?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "apia_documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
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
      field_photos: {
        Row: {
          activity: string | null
          created_at: string
          crop_stage: string | null
          date: string
          field_id: string
          id: string
          image_url: string
          notes: string | null
          user_id: string
          weather_conditions: string | null
        }
        Insert: {
          activity?: string | null
          created_at?: string
          crop_stage?: string | null
          date: string
          field_id: string
          id?: string
          image_url: string
          notes?: string | null
          user_id: string
          weather_conditions?: string | null
        }
        Update: {
          activity?: string | null
          created_at?: string
          crop_stage?: string | null
          date?: string
          field_id?: string
          id?: string
          image_url?: string
          notes?: string | null
          user_id?: string
          weather_conditions?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "field_photos_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "field_photos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fields: {
        Row: {
          color: string | null
          coordinates: Json | null
          costs: number | null
          created_at: string
          crop: string | null
          harvest_date: string | null
          id: string
          inputs: string | null
          location: string | null
          name: string
          parcel_code: string | null
          planting_date: string | null
          size: number
          soil_data: Json | null
          status: string | null
          updated_at: string
          user_id: string
          work_type: string | null
        }
        Insert: {
          color?: string | null
          coordinates?: Json | null
          costs?: number | null
          created_at?: string
          crop?: string | null
          harvest_date?: string | null
          id?: string
          inputs?: string | null
          location?: string | null
          name: string
          parcel_code?: string | null
          planting_date?: string | null
          size: number
          soil_data?: Json | null
          status?: string | null
          updated_at?: string
          user_id: string
          work_type?: string | null
        }
        Update: {
          color?: string | null
          coordinates?: Json | null
          costs?: number | null
          created_at?: string
          crop?: string | null
          harvest_date?: string | null
          id?: string
          inputs?: string | null
          location?: string | null
          name?: string
          parcel_code?: string | null
          planting_date?: string | null
          size?: number
          soil_data?: Json | null
          status?: string | null
          updated_at?: string
          user_id?: string
          work_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fields_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_transactions: {
        Row: {
          amount: number
          budget_category: string | null
          category: string | null
          created_at: string
          date: string
          description: string
          field_id: string | null
          id: string
          roi_impact: number | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Insert: {
          amount: number
          budget_category?: string | null
          category?: string | null
          created_at?: string
          date: string
          description: string
          field_id?: string | null
          id?: string
          roi_impact?: number | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Update: {
          amount?: number
          budget_category?: string | null
          category?: string | null
          created_at?: string
          date?: string
          description?: string
          field_id?: string | null
          id?: string
          roi_impact?: number | null
          type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory: {
        Row: {
          condition: string | null
          created_at: string
          current_value: number | null
          expiration_date: string | null
          id: string
          last_used: string | null
          location: string | null
          name: string
          next_maintenance: string | null
          purchase_cost: number | null
          purpose: string | null
          quantity: string
          stock_level: Database["public"]["Enums"]["stock_level"] | null
          type: Database["public"]["Enums"]["inventory_type"]
          unit: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          condition?: string | null
          created_at?: string
          current_value?: number | null
          expiration_date?: string | null
          id?: string
          last_used?: string | null
          location?: string | null
          name: string
          next_maintenance?: string | null
          purchase_cost?: number | null
          purpose?: string | null
          quantity: string
          stock_level?: Database["public"]["Enums"]["stock_level"] | null
          type: Database["public"]["Enums"]["inventory_type"]
          unit?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          condition?: string | null
          created_at?: string
          current_value?: number | null
          expiration_date?: string | null
          id?: string
          last_used?: string | null
          location?: string | null
          name?: string
          next_maintenance?: string | null
          purchase_cost?: number | null
          purpose?: string | null
          quantity?: string
          stock_level?: Database["public"]["Enums"]["stock_level"] | null
          type?: Database["public"]["Enums"]["inventory_type"]
          unit?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          priority: Database["public"]["Enums"]["notification_priority"] | null
          read_at: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          priority?: Database["public"]["Enums"]["notification_priority"] | null
          read_at?: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          priority?: Database["public"]["Enums"]["notification_priority"] | null
          read_at?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      property_documents: {
        Row: {
          created_at: string
          document_type: string
          field_id: string | null
          file_name: string | null
          file_url: string | null
          id: string
          issue_date: string | null
          name: string
          notes: string | null
          status: Database["public"]["Enums"]["document_status"] | null
          upload_date: string | null
          user_id: string
          valid_until: string | null
        }
        Insert: {
          created_at?: string
          document_type: string
          field_id?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          issue_date?: string | null
          name: string
          notes?: string | null
          status?: Database["public"]["Enums"]["document_status"] | null
          upload_date?: string | null
          user_id: string
          valid_until?: string | null
        }
        Update: {
          created_at?: string
          document_type?: string
          field_id?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          issue_date?: string | null
          name?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["document_status"] | null
          upload_date?: string | null
          user_id?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_documents_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reports_analytics: {
        Row: {
          file_url: string | null
          generated_at: string
          id: string
          parameters: Json | null
          report_data: Json
          report_name: string
          report_type: string
          status: string | null
          user_id: string
        }
        Insert: {
          file_url?: string | null
          generated_at?: string
          id?: string
          parameters?: Json | null
          report_data?: Json
          report_name: string
          report_type: string
          status?: string | null
          user_id: string
        }
        Update: {
          file_url?: string | null
          generated_at?: string
          id?: string
          parameters?: Json | null
          report_data?: Json
          report_name?: string
          report_type?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          ai_suggested: boolean | null
          category: string | null
          completed_at: string | null
          created_at: string
          date: string
          description: string | null
          due_date: string | null
          due_time: string | null
          duration: number | null
          estimated_duration: string | null
          field_id: string | null
          field_name: string | null
          id: string
          priority: Database["public"]["Enums"]["task_priority"] | null
          status: Database["public"]["Enums"]["task_status"] | null
          time: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_suggested?: boolean | null
          category?: string | null
          completed_at?: string | null
          created_at?: string
          date: string
          description?: string | null
          due_date?: string | null
          due_time?: string | null
          duration?: number | null
          estimated_duration?: string | null
          field_id?: string | null
          field_name?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["task_priority"] | null
          status?: Database["public"]["Enums"]["task_status"] | null
          time?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_suggested?: boolean | null
          category?: string | null
          completed_at?: string | null
          created_at?: string
          date?: string
          description?: string | null
          due_date?: string | null
          due_time?: string | null
          duration?: number | null
          estimated_duration?: string | null
          field_id?: string | null
          field_name?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["task_priority"] | null
          status?: Database["public"]["Enums"]["task_status"] | null
          time?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          ai_suggestions_enabled: boolean | null
          created_at: string
          dashboard_layout: Json | null
          id: string
          notification_preferences: Json | null
          updated_at: string
          user_id: string
          weather_sync_frequency:
            | Database["public"]["Enums"]["sync_frequency"]
            | null
        }
        Insert: {
          ai_suggestions_enabled?: boolean | null
          created_at?: string
          dashboard_layout?: Json | null
          id?: string
          notification_preferences?: Json | null
          updated_at?: string
          user_id: string
          weather_sync_frequency?:
            | Database["public"]["Enums"]["sync_frequency"]
            | null
        }
        Update: {
          ai_suggestions_enabled?: boolean | null
          created_at?: string
          dashboard_layout?: Json | null
          id?: string
          notification_preferences?: Json | null
          updated_at?: string
          user_id?: string
          weather_sync_frequency?:
            | Database["public"]["Enums"]["sync_frequency"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      work_history: {
        Row: {
          cost: number | null
          created_at: string
          date: string
          description: string | null
          duration: number | null
          field_id: string
          id: string
          user_id: string
          weather_conditions: string | null
          work_type: string
          worker: string | null
        }
        Insert: {
          cost?: number | null
          created_at?: string
          date: string
          description?: string | null
          duration?: number | null
          field_id: string
          id?: string
          user_id: string
          weather_conditions?: string | null
          work_type: string
          worker?: string | null
        }
        Update: {
          cost?: number | null
          created_at?: string
          date?: string
          description?: string | null
          duration?: number | null
          field_id?: string
          id?: string
          user_id?: string
          weather_conditions?: string | null
          work_type?: string
          worker?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "work_history_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
