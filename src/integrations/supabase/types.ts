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
      field_photos: {
        Row: {
          caption: string | null
          created_at: string
          date_taken: string
          field_id: string
          id: string
          photo_url: string
          user_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          date_taken?: string
          field_id: string
          id?: string
          photo_url: string
          user_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          date_taken?: string
          field_id?: string
          id?: string
          photo_url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "field_photos_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "fields"
            referencedColumns: ["id"]
          },
        ]
      }
      fields: {
        Row: {
          area: number
          color: string
          coordinates_lat: number | null
          coordinates_lng: number | null
          costs: number | null
          created_at: string
          crop: string
          harvest_date: string | null
          id: string
          inputs: string | null
          last_activity: string | null
          location: string
          name: string
          notes: string | null
          parcel_code: string
          planting_date: string | null
          roi: number | null
          soil_type: string | null
          status: string
          updated_at: string
          user_id: string
          variety: string | null
          work_type: string | null
        }
        Insert: {
          area: number
          color?: string
          coordinates_lat?: number | null
          coordinates_lng?: number | null
          costs?: number | null
          created_at?: string
          crop: string
          harvest_date?: string | null
          id?: string
          inputs?: string | null
          last_activity?: string | null
          location: string
          name: string
          notes?: string | null
          parcel_code: string
          planting_date?: string | null
          roi?: number | null
          soil_type?: string | null
          status?: string
          updated_at?: string
          user_id: string
          variety?: string | null
          work_type?: string | null
        }
        Update: {
          area?: number
          color?: string
          coordinates_lat?: number | null
          coordinates_lng?: number | null
          costs?: number | null
          created_at?: string
          crop?: string
          harvest_date?: string | null
          id?: string
          inputs?: string | null
          last_activity?: string | null
          location?: string
          name?: string
          notes?: string | null
          parcel_code?: string
          planting_date?: string | null
          roi?: number | null
          soil_type?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          variety?: string | null
          work_type?: string | null
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
      weather_data: {
        Row: {
          created_at: string
          data_type: string
          extraction_datetime: string
          id: string
          latitude: number
          longitude: number
          precipitation_mm: number | null
          relative_humidity_percent: number | null
          temperature_celsius: number | null
          timestamp: string
          user_id: string
          weather_code: number | null
          wind_speed_kph: number | null
        }
        Insert: {
          created_at?: string
          data_type: string
          extraction_datetime?: string
          id?: string
          latitude: number
          longitude: number
          precipitation_mm?: number | null
          relative_humidity_percent?: number | null
          temperature_celsius?: number | null
          timestamp: string
          user_id: string
          weather_code?: number | null
          wind_speed_kph?: number | null
        }
        Update: {
          created_at?: string
          data_type?: string
          extraction_datetime?: string
          id?: string
          latitude?: number
          longitude?: number
          precipitation_mm?: number | null
          relative_humidity_percent?: number | null
          temperature_celsius?: number | null
          timestamp?: string
          user_id?: string
          weather_code?: number | null
          wind_speed_kph?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_old_weather_data: {
        Args: Record<PropertyKey, never>
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
