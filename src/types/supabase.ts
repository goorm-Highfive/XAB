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
      ab_test_votes: {
        Row: {
          ab_test_id: number
          created_at: string
          id: number
          preferred_variant: string
          user_id: string
        }
        Insert: {
          ab_test_id: number
          created_at?: string
          id?: number
          preferred_variant: string
          user_id: string
        }
        Update: {
          ab_test_id?: number
          created_at?: string
          id?: number
          preferred_variant?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'ab_test_votes_ab_test_id_fkey'
            columns: ['ab_test_id']
            isOneToOne: false
            referencedRelation: 'ab_tests'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'ab_test_votes_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      ab_tests: {
        Row: {
          created_at: string
          description_a: string | null
          description_b: string | null
          id: number
          post_id: number
          updated_at: string
          variant_a_url: string | null
          variant_b_url: string | null
        }
        Insert: {
          created_at?: string
          description_a?: string | null
          description_b?: string | null
          id?: number
          post_id: number
          updated_at?: string
          variant_a_url?: string | null
          variant_b_url?: string | null
        }
        Update: {
          created_at?: string
          description_a?: string | null
          description_b?: string | null
          id?: number
          post_id?: number
          updated_at?: string
          variant_a_url?: string | null
          variant_b_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'ab_tests_post_id_fkey'
            columns: ['post_id']
            isOneToOne: false
            referencedRelation: 'posts'
            referencedColumns: ['id']
          },
        ]
      }
      comment_likes: {
        Row: {
          comment_id: number
          created_at: string
          id: number
          user_id: string
        }
        Insert: {
          comment_id: number
          created_at?: string
          id?: number
          user_id: string
        }
        Update: {
          comment_id?: number
          created_at?: string
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'comment_likes_comment_id_fkey'
            columns: ['comment_id']
            isOneToOne: false
            referencedRelation: 'comments'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'comment_likes_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string
          dept: number | null
          id: number
          parent_id: number | null
          post_id: number
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          dept?: number | null
          id?: number
          parent_id?: number | null
          post_id: number
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          dept?: number | null
          id?: number
          parent_id?: number | null
          post_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'comments_parent_id_fkey'
            columns: ['parent_id']
            isOneToOne: false
            referencedRelation: 'comments'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'comments_post_id_fkey'
            columns: ['post_id']
            isOneToOne: false
            referencedRelation: 'posts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'comments_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      delete_sessions: {
        Row: {
          deleted_at: string | null
          id: number
          user_id: string
        }
        Insert: {
          deleted_at?: string | null
          id?: number
          user_id: string
        }
        Update: {
          deleted_at?: string | null
          id?: number
          user_id?: string
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: number
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: number
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: 'follows_follower_id_fkey'
            columns: ['follower_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'follows_following_id_fkey'
            columns: ['following_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      likes: {
        Row: {
          created_at: string
          id: number
          post_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          post_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          post_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'likes_post_id_fkey'
            columns: ['post_id']
            isOneToOne: false
            referencedRelation: 'posts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'likes_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      notifications: {
        Row: {
          action: string
          created_at: string | null
          id: number
          is_read: boolean
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: number
          is_read?: boolean
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: number
          is_read?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'notifications_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      posts: {
        Row: {
          caption: string | null
          created_at: string
          id: number
          image_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: number
          image_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: number
          image_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'posts_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      users: {
        Row: {
          bio: string | null
          created_at: string
          email: string
          id: string
          password: string | null
          profile_image: string | null
          updated_at: string
          username: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          email: string
          id: string
          password?: string | null
          profile_image?: string | null
          updated_at?: string
          username: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          email?: string
          id?: string
          password?: string | null
          profile_image?: string | null
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_user_account: {
        Args: {
          p_user_id: string
        }
        Returns: string
      }
      fetch_post_with_comments: {
        Args: {
          post_id: number
          user_id: string
        }
        Returns: Json
      }
      get_feed_posts_for_user: {
        Args: {
          p_user_id: string
        }
        Returns: {
          post_id: number
          post_user_id: string
          post_image_url: string
          post_caption: string
          post_created_at: string
          post_updated_at: string
          ab_test_id: number
          variant_a_url: string
          variant_b_url: string
          description_a: string
          description_b: string
          ab_test_created_at: string
          ab_test_updated_at: string
        }[]
      }
      get_followers_posts: {
        Args: {
          p_user_id: string
        }
        Returns: {
          post_id: number
          post_user_id: string
          post_image_url: string
          post_caption: string
          post_created_at: string
          post_updated_at: string
          ab_test_id: number
          variant_a_url: string
          variant_b_url: string
          description_a: string
          description_b: string
          ab_test_created_at: string
          ab_test_updated_at: string
        }[]
      }
      get_random_posts: {
        Args: {
          p_limit: number
        }
        Returns: {
          post_id: number
          post_user_id: string
          post_image_url: string
          post_caption: string
          post_created_at: string
          post_updated_at: string
          ab_test_id: number
          variant_a_url: string
          variant_b_url: string
          description_a: string
          description_b: string
          ab_test_created_at: string
          ab_test_updated_at: string
        }[]
      }
      get_random_posts_with_ab: {
        Args: {
          p_limit: number
        }
        Returns: {
          post_id: number
          user_id: string
          image_url: string
          caption: string
          post_created_at: string
          post_updated_at: string
          abtest_id: number
          variant_a_url: string
          variant_b_url: string
          description_a: string
          description_b: string
          ab_created_at: string
          ab_updated_at: string
        }[]
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

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never
