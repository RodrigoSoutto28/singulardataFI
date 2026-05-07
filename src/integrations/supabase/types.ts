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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_insights: {
        Row: {
          action_taken: boolean | null
          content: string
          created_at: string | null
          expires_at: string | null
          id: string
          insight_type: string
          is_actionable: boolean | null
          is_read: boolean | null
          metadata: Json | null
          severity: string | null
          title: string
          user_id: string
        }
        Insert: {
          action_taken?: boolean | null
          content: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          insight_type: string
          is_actionable?: boolean | null
          is_read?: boolean | null
          metadata?: Json | null
          severity?: string | null
          title: string
          user_id: string
        }
        Update: {
          action_taken?: boolean | null
          content?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          insight_type?: string
          is_actionable?: boolean | null
          is_read?: boolean | null
          metadata?: Json | null
          severity?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_insights_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_snapshots: {
        Row: {
          account_id: string | null
          average_loss: number | null
          average_win: number | null
          created_at: string | null
          equity_value: number | null
          id: string
          largest_loss: number | null
          largest_win: number | null
          losing_trades: number | null
          max_drawdown: number | null
          profit_factor: number | null
          sharpe_ratio: number | null
          snapshot_date: string
          total_pnl: number | null
          total_trades: number | null
          user_id: string
          win_rate: number | null
          winning_trades: number | null
        }
        Insert: {
          account_id?: string | null
          average_loss?: number | null
          average_win?: number | null
          created_at?: string | null
          equity_value?: number | null
          id?: string
          largest_loss?: number | null
          largest_win?: number | null
          losing_trades?: number | null
          max_drawdown?: number | null
          profit_factor?: number | null
          sharpe_ratio?: number | null
          snapshot_date?: string
          total_pnl?: number | null
          total_trades?: number | null
          user_id: string
          win_rate?: number | null
          winning_trades?: number | null
        }
        Update: {
          account_id?: string | null
          average_loss?: number | null
          average_win?: number | null
          created_at?: string | null
          equity_value?: number | null
          id?: string
          largest_loss?: number | null
          largest_win?: number | null
          losing_trades?: number | null
          max_drawdown?: number | null
          profit_factor?: number | null
          sharpe_ratio?: number | null
          snapshot_date?: string
          total_pnl?: number | null
          total_trades?: number | null
          user_id?: string
          win_rate?: number | null
          winning_trades?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_snapshots_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "trading_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_snapshots_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_flags: {
        Row: {
          created_at: string | null
          description: string | null
          feature_key: string
          feature_name: string
          free_plan: boolean | null
          id: string
          power_plan: boolean | null
          pro_plan: boolean | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          feature_key: string
          feature_name: string
          free_plan?: boolean | null
          id?: string
          power_plan?: boolean | null
          pro_plan?: boolean | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          feature_key?: string
          feature_name?: string
          free_plan?: boolean | null
          id?: string
          power_plan?: boolean | null
          pro_plan?: boolean | null
        }
        Relationships: []
      }
      pre_market_checkins: {
        Row: {
          allowed_setups: string[]
          checkin_date: string
          created_at: string
          emotional_state: string
          goals_today: string | null
          id: string
          max_daily_trades: number
          max_risk_per_trade: number
          user_id: string
        }
        Insert: {
          allowed_setups?: string[]
          checkin_date?: string
          created_at?: string
          emotional_state: string
          goals_today?: string | null
          id?: string
          max_daily_trades?: number
          max_risk_per_trade?: number
          user_id: string
        }
        Update: {
          allowed_setups?: string[]
          checkin_date?: string
          created_at?: string
          emotional_state?: string
          goals_today?: string | null
          id?: string
          max_daily_trades?: number
          max_risk_per_trade?: number
          user_id?: string
        }
        Relationships: []
      }
      process_validations: {
        Row: {
          adherence_score: number
          ai_message_shown: string | null
          ai_message_type: string | null
          closed_as_planned: boolean
          correct_position_size: boolean
          created_at: string
          id: string
          matched_setup: boolean
          reflection_note: string | null
          respected_sl: boolean
          trade_id: string
          user_id: string
          waited_confirmation: boolean
        }
        Insert: {
          adherence_score: number
          ai_message_shown?: string | null
          ai_message_type?: string | null
          closed_as_planned: boolean
          correct_position_size: boolean
          created_at?: string
          id?: string
          matched_setup: boolean
          reflection_note?: string | null
          respected_sl: boolean
          trade_id: string
          user_id: string
          waited_confirmation: boolean
        }
        Update: {
          adherence_score?: number
          ai_message_shown?: string | null
          ai_message_type?: string | null
          closed_as_planned?: boolean
          correct_position_size?: boolean
          created_at?: string
          id?: string
          matched_setup?: boolean
          reflection_note?: string | null
          respected_sl?: boolean
          trade_id?: string
          user_id?: string
          waited_confirmation?: boolean
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          currency: string | null
          email: string | null
          full_name: string | null
          id: string
          language: string
          onboarding_completed: boolean
          onboarding_step: number
          role: string | null
          subscription_expires_at: string | null
          subscription_plan:
            | Database["public"]["Enums"]["subscription_plan"]
            | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          currency?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          language?: string
          onboarding_completed?: boolean
          onboarding_step?: number
          role?: string | null
          subscription_expires_at?: string | null
          subscription_plan?:
            | Database["public"]["Enums"]["subscription_plan"]
            | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          currency?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          language?: string
          onboarding_completed?: boolean
          onboarding_step?: number
          role?: string | null
          subscription_expires_at?: string | null
          subscription_plan?:
            | Database["public"]["Enums"]["subscription_plan"]
            | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      psychological_errors: {
        Row: {
          confidence: string
          cost_dollars: number
          created_at: string
          error_type: string
          id: string
          metadata: Json | null
          reason: string | null
          timestamp: string
          trade_id: string | null
          user_id: string
          was_prevented: boolean
        }
        Insert: {
          confidence?: string
          cost_dollars?: number
          created_at?: string
          error_type: string
          id?: string
          metadata?: Json | null
          reason?: string | null
          timestamp?: string
          trade_id?: string | null
          user_id: string
          was_prevented?: boolean
        }
        Update: {
          confidence?: string
          cost_dollars?: number
          created_at?: string
          error_type?: string
          id?: string
          metadata?: Json | null
          reason?: string | null
          timestamp?: string
          trade_id?: string | null
          user_id?: string
          was_prevented?: boolean
        }
        Relationships: []
      }
      psychology_entries: {
        Row: {
          broken_rules: string[] | null
          created_at: string | null
          discipline_score: number | null
          entry_date: string
          followed_rules: boolean | null
          goals_for_tomorrow: string | null
          id: string
          lessons_learned: string | null
          market_conditions: string | null
          mental_state_notes: string | null
          post_trade_emotion: Database["public"]["Enums"]["emotion_type"] | null
          pre_trade_emotion: Database["public"]["Enums"]["emotion_type"] | null
          sleep_quality: number | null
          stress_level: number | null
          trade_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          broken_rules?: string[] | null
          created_at?: string | null
          discipline_score?: number | null
          entry_date?: string
          followed_rules?: boolean | null
          goals_for_tomorrow?: string | null
          id?: string
          lessons_learned?: string | null
          market_conditions?: string | null
          mental_state_notes?: string | null
          post_trade_emotion?:
            | Database["public"]["Enums"]["emotion_type"]
            | null
          pre_trade_emotion?: Database["public"]["Enums"]["emotion_type"] | null
          sleep_quality?: number | null
          stress_level?: number | null
          trade_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          broken_rules?: string[] | null
          created_at?: string | null
          discipline_score?: number | null
          entry_date?: string
          followed_rules?: boolean | null
          goals_for_tomorrow?: string | null
          id?: string
          lessons_learned?: string | null
          market_conditions?: string | null
          mental_state_notes?: string | null
          post_trade_emotion?:
            | Database["public"]["Enums"]["emotion_type"]
            | null
          pre_trade_emotion?: Database["public"]["Enums"]["emotion_type"] | null
          sleep_quality?: number | null
          stress_level?: number | null
          trade_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "psychology_entries_trade_id_fkey"
            columns: ["trade_id"]
            isOneToOne: false
            referencedRelation: "trades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "psychology_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      study_content: {
        Row: {
          categories: string[] | null
          content_md: string | null
          description: string | null
          id: string
          is_featured: boolean | null
          is_pro: boolean | null
          pdf_url: string | null
          published_at: string | null
          read_time_minutes: number | null
          title: string
          type: Database["public"]["Enums"]["study_content_type"]
          week_number: number | null
        }
        Insert: {
          categories?: string[] | null
          content_md?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean | null
          is_pro?: boolean | null
          pdf_url?: string | null
          published_at?: string | null
          read_time_minutes?: number | null
          title: string
          type?: Database["public"]["Enums"]["study_content_type"]
          week_number?: number | null
        }
        Update: {
          categories?: string[] | null
          content_md?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean | null
          is_pro?: boolean | null
          pdf_url?: string | null
          published_at?: string | null
          read_time_minutes?: number | null
          title?: string
          type?: Database["public"]["Enums"]["study_content_type"]
          week_number?: number | null
        }
        Relationships: []
      }
      study_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          content_id: string
          progress_percent: number | null
          started_at: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          content_id: string
          progress_percent?: number | null
          started_at?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          content_id?: string
          progress_percent?: number | null
          started_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_progress_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "study_content"
            referencedColumns: ["id"]
          },
        ]
      }
      trade_screenshots: {
        Row: {
          caption: string | null
          created_at: string | null
          id: string
          image_url: string
          screenshot_type: string | null
          trade_id: string
          user_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          id?: string
          image_url: string
          screenshot_type?: string | null
          trade_id: string
          user_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          id?: string
          image_url?: string
          screenshot_type?: string | null
          trade_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_screenshots_trade_id_fkey"
            columns: ["trade_id"]
            isOneToOne: false
            referencedRelation: "trades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_screenshots_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trades: {
        Row: {
          account_id: string | null
          asset_class: Database["public"]["Enums"]["asset_class"] | null
          commission: number | null
          created_at: string | null
          direction: Database["public"]["Enums"]["trade_direction"]
          entry_date: string
          entry_price: number
          exit_date: string | null
          exit_price: number | null
          id: string
          notes: string | null
          pnl: number | null
          pnl_percentage: number | null
          quantity: number
          rating: number | null
          setup_type: string | null
          status: Database["public"]["Enums"]["trade_status"] | null
          stop_loss: number | null
          strategy: string | null
          swap: number | null
          symbol: string
          tags: string[] | null
          take_profit: number | null
          timeframe: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_id?: string | null
          asset_class?: Database["public"]["Enums"]["asset_class"] | null
          commission?: number | null
          created_at?: string | null
          direction: Database["public"]["Enums"]["trade_direction"]
          entry_date: string
          entry_price: number
          exit_date?: string | null
          exit_price?: number | null
          id?: string
          notes?: string | null
          pnl?: number | null
          pnl_percentage?: number | null
          quantity: number
          rating?: number | null
          setup_type?: string | null
          status?: Database["public"]["Enums"]["trade_status"] | null
          stop_loss?: number | null
          strategy?: string | null
          swap?: number | null
          symbol: string
          tags?: string[] | null
          take_profit?: number | null
          timeframe?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_id?: string | null
          asset_class?: Database["public"]["Enums"]["asset_class"] | null
          commission?: number | null
          created_at?: string | null
          direction?: Database["public"]["Enums"]["trade_direction"]
          entry_date?: string
          entry_price?: number
          exit_date?: string | null
          exit_price?: number | null
          id?: string
          notes?: string | null
          pnl?: number | null
          pnl_percentage?: number | null
          quantity?: number
          rating?: number | null
          setup_type?: string | null
          status?: Database["public"]["Enums"]["trade_status"] | null
          stop_loss?: number | null
          strategy?: string | null
          swap?: number | null
          symbol?: string
          tags?: string[] | null
          take_profit?: number | null
          timeframe?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trades_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "trading_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trades_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trading_accounts: {
        Row: {
          account_type: string | null
          broker: string | null
          created_at: string | null
          currency: string | null
          current_balance: number | null
          id: string
          initial_balance: number | null
          is_active: boolean | null
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_type?: string | null
          broker?: string | null
          created_at?: string | null
          currency?: string | null
          current_balance?: number | null
          id?: string
          initial_balance?: number | null
          is_active?: boolean | null
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_type?: string | null
          broker?: string | null
          created_at?: string | null
          currency?: string | null
          current_balance?: number | null
          id?: string
          initial_balance?: number | null
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trading_accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trading_rules: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          rule_description: string | null
          rule_name: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          rule_description?: string | null
          rule_name: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          rule_description?: string | null
          rule_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trading_rules_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_streaks: {
        Row: {
          best_count: number
          created_at: string
          current_count: number
          id: string
          last_activity_date: string | null
          start_date: string | null
          streak_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          best_count?: number
          created_at?: string
          current_count?: number
          id?: string
          last_activity_date?: string | null
          start_date?: string | null
          streak_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          best_count?: number
          created_at?: string
          current_count?: number
          id?: string
          last_activity_date?: string | null
          start_date?: string | null
          streak_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      asset_class:
        | "forex"
        | "stocks"
        | "crypto"
        | "futures"
        | "options"
        | "commodities"
      emotion_type:
        | "confident"
        | "fearful"
        | "greedy"
        | "calm"
        | "anxious"
        | "frustrated"
        | "excited"
        | "neutral"
        | "fomo"
        | "vengeful"
      study_content_type: "summary" | "paper_pdf"
      subscription_plan: "free" | "pro" | "power"
      trade_direction: "long" | "short"
      trade_status: "open" | "closed" | "cancelled"
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
      app_role: ["admin", "moderator", "user"],
      asset_class: [
        "forex",
        "stocks",
        "crypto",
        "futures",
        "options",
        "commodities",
      ],
      emotion_type: [
        "confident",
        "fearful",
        "greedy",
        "calm",
        "anxious",
        "frustrated",
        "excited",
        "neutral",
        "fomo",
        "vengeful",
      ],
      study_content_type: ["summary", "paper_pdf"],
      subscription_plan: ["free", "pro", "power"],
      trade_direction: ["long", "short"],
      trade_status: ["open", "closed", "cancelled"],
    },
  },
} as const
