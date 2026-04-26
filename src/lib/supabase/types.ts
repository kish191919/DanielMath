export type Role = "principal" | "parent";

export type Grade = "K" | "1" | "2" | "3" | "4" | "5" | "6";

export interface Profile {
  id: string;
  role: Role;
  full_name: string | null;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  full_name: string;
  grade: Grade;
  parent_email: string | null;
  parent_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

type ProfileInsert = {
  id: string;
  role: Role;
  email: string;
  full_name?: string | null;
  created_at?: string;
  updated_at?: string;
};

type ProfileUpdate = Partial<ProfileInsert>;

type StudentInsert = {
  id?: string;
  full_name: string;
  grade: Grade;
  parent_email?: string | null;
  parent_id?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
};

type StudentUpdate = Partial<StudentInsert>;

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "12";
  };
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
        Relationships: [];
      };
      students: {
        Row: Student;
        Insert: StudentInsert;
        Update: StudentUpdate;
        Relationships: [
          {
            foreignKeyName: "students_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: {
      user_role: Role;
    };
    CompositeTypes: { [_ in never]: never };
  };
};
