import type { AdvancedStatus, Quarter } from "@/lib/curriculum-quarter";

export type Role = "principal" | "parent";

export type Grade = "3" | "4" | "5" | "6";

export type Track = "standard" | "advanced";

export type ErrorType =
  | "calculation_mistake"
  | "place_value_error"
  | "fraction_concept"
  | "word_problem_interpretation"
  | "unit_conversion"
  | "pattern_recognition"
  | "time_pressure";

export type ScanStatus =
  | "uploaded"
  | "grading"
  | "pending_review"
  | "reviewed"
  | "grading_failed";

export type PracticeSheetStatus = "draft" | "confirmed";

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
  track: Track;
  parent_email: string | null;
  parent_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Inquiry {
  id: string;
  parent_name: string;
  contact_email: string;
  phone: string;
  child_name: string;
  grade: Grade;
  school: string | null;
  language: "ko" | "en";
  message: string | null;
  created_at: string;
}

export interface Concept {
  id: string;
  code: string;
  strand: string;
  label_ko: string;
  label_en: string | null;
  grades: Grade[];
  sort_order: number;
  is_active: boolean;
  quarter_standard: Quarter | null;
  quarter_advanced: Quarter | null;
  advanced_status: AdvancedStatus | null;
  created_at: string;
  updated_at: string;
}

export interface WorksheetScan {
  id: string;
  student_id: string;
  uploaded_by: string;
  storage_path: string;
  original_filename: string | null;
  mime_type: "image/jpeg" | "image/png" | "application/pdf";
  file_size_bytes: number | null;
  status: ScanStatus;
  grading_error: string | null;
  graded_at: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  session_date: string;
  created_at: string;
  updated_at: string;
}

export interface LearningItem {
  id: string;
  scan_id: string;
  student_id: string;
  problem_number: string | null;
  transcribed_problem: string;
  transcribed_answer: string | null;
  is_correct: boolean;
  concept_id: string | null;
  error_type: ErrorType | null;
  ai_confidence_note: string | null;
  ai_suggested: unknown;
  source: "ai" | "teacher";
  edited_by_teacher: boolean;
  confirmed: boolean;
  session_date: string;
  created_at: string;
  updated_at: string;
}

export interface SessionNote {
  id: string;
  student_id: string;
  scan_id: string | null;
  session_date: string;
  note: string;
  source: "ai" | "teacher";
  edited_by_teacher: boolean;
  confirmed: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface GeneratedWorksheet {
  id: string;
  student_id: string;
  created_by: string;
  status: PracticeSheetStatus;
  title: string | null;
  share_token: string;
  created_at: string;
  confirmed_at: string | null;
}

export interface GeneratedProblem {
  id: string;
  worksheet_id: string;
  source_item_id: string | null;
  concept_id: string | null;
  problem_text: string;
  answer_text: string;
  sort_order: number;
  source: "ai" | "teacher";
  edited_by_teacher: boolean;
  ai_suggested: unknown;
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
  track?: Track;
  parent_email?: string | null;
  parent_id?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
};

type StudentUpdate = Partial<StudentInsert>;

type InquiryInsert = {
  id?: string;
  parent_name: string;
  contact_email: string;
  phone: string;
  child_name: string;
  grade: Grade;
  school?: string | null;
  language?: "ko" | "en";
  message?: string | null;
  created_at?: string;
};

type InquiryUpdate = Partial<InquiryInsert>;

type ConceptInsert = {
  id?: string;
  code: string;
  strand: string;
  label_ko: string;
  label_en?: string | null;
  grades?: Grade[];
  sort_order?: number;
  is_active?: boolean;
  quarter_standard?: Quarter | null;
  quarter_advanced?: Quarter | null;
  advanced_status?: AdvancedStatus | null;
  created_at?: string;
  updated_at?: string;
};

type ConceptUpdate = Partial<ConceptInsert>;

type WorksheetScanInsert = {
  id?: string;
  student_id: string;
  uploaded_by: string;
  storage_path: string;
  original_filename?: string | null;
  mime_type: "image/jpeg" | "image/png" | "application/pdf";
  file_size_bytes?: number | null;
  status?: ScanStatus;
  grading_error?: string | null;
  graded_at?: string | null;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
  session_date?: string;
  created_at?: string;
  updated_at?: string;
};

type WorksheetScanUpdate = Partial<WorksheetScanInsert>;

type LearningItemInsert = {
  id?: string;
  scan_id: string;
  student_id: string;
  problem_number?: string | null;
  transcribed_problem: string;
  transcribed_answer?: string | null;
  is_correct: boolean;
  concept_id?: string | null;
  error_type?: ErrorType | null;
  ai_confidence_note?: string | null;
  ai_suggested?: unknown;
  source?: "ai" | "teacher";
  edited_by_teacher?: boolean;
  confirmed?: boolean;
  session_date: string;
  created_at?: string;
  updated_at?: string;
};

type LearningItemUpdate = Partial<LearningItemInsert>;

type SessionNoteInsert = {
  id?: string;
  student_id: string;
  scan_id?: string | null;
  session_date?: string;
  note: string;
  source?: "ai" | "teacher";
  edited_by_teacher?: boolean;
  confirmed?: boolean;
  created_by: string;
  created_at?: string;
  updated_at?: string;
};

type SessionNoteUpdate = Partial<SessionNoteInsert>;

type GeneratedWorksheetInsert = {
  id?: string;
  student_id: string;
  created_by: string;
  status?: PracticeSheetStatus;
  title?: string | null;
  share_token?: string;
  created_at?: string;
  confirmed_at?: string | null;
};

type GeneratedWorksheetUpdate = Partial<GeneratedWorksheetInsert>;

type GeneratedProblemInsert = {
  id?: string;
  worksheet_id: string;
  source_item_id?: string | null;
  concept_id?: string | null;
  problem_text: string;
  answer_text: string;
  sort_order?: number;
  source?: "ai" | "teacher";
  edited_by_teacher?: boolean;
  ai_suggested?: unknown;
  created_at?: string;
  updated_at?: string;
};

type GeneratedProblemUpdate = Partial<GeneratedProblemInsert>;

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
      inquiries: {
        Row: Inquiry;
        Insert: InquiryInsert;
        Update: InquiryUpdate;
        Relationships: [];
      };
      concepts: {
        Row: Concept;
        Insert: ConceptInsert;
        Update: ConceptUpdate;
        Relationships: [];
      };
      worksheet_scans: {
        Row: WorksheetScan;
        Insert: WorksheetScanInsert;
        Update: WorksheetScanUpdate;
        Relationships: [
          {
            foreignKeyName: "worksheet_scans_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      learning_items: {
        Row: LearningItem;
        Insert: LearningItemInsert;
        Update: LearningItemUpdate;
        Relationships: [
          {
            foreignKeyName: "learning_items_scan_id_fkey";
            columns: ["scan_id"];
            isOneToOne: false;
            referencedRelation: "worksheet_scans";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "learning_items_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "learning_items_concept_id_fkey";
            columns: ["concept_id"];
            isOneToOne: false;
            referencedRelation: "concepts";
            referencedColumns: ["id"];
          },
        ];
      };
      session_notes: {
        Row: SessionNote;
        Insert: SessionNoteInsert;
        Update: SessionNoteUpdate;
        Relationships: [
          {
            foreignKeyName: "session_notes_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      generated_worksheets: {
        Row: GeneratedWorksheet;
        Insert: GeneratedWorksheetInsert;
        Update: GeneratedWorksheetUpdate;
        Relationships: [
          {
            foreignKeyName: "generated_worksheets_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      generated_problems: {
        Row: GeneratedProblem;
        Insert: GeneratedProblemInsert;
        Update: GeneratedProblemUpdate;
        Relationships: [
          {
            foreignKeyName: "generated_problems_worksheet_id_fkey";
            columns: ["worksheet_id"];
            isOneToOne: false;
            referencedRelation: "generated_worksheets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "generated_problems_source_item_id_fkey";
            columns: ["source_item_id"];
            isOneToOne: false;
            referencedRelation: "learning_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "generated_problems_concept_id_fkey";
            columns: ["concept_id"];
            isOneToOne: false;
            referencedRelation: "concepts";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: {
      user_role: Role;
      error_type: ErrorType;
      scan_status: ScanStatus;
      practice_sheet_status: PracticeSheetStatus;
    };
    CompositeTypes: { [_ in never]: never };
  };
};
