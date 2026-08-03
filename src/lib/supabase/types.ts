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
  phone: string | null;
  sms_consent: boolean;
  sms_consent_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  full_name: string;
  grade: Grade;
  track: Track;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface StudentGuardian {
  id: string;
  student_id: string;
  guardian_id: string;
  created_at: string;
}

export type InquiryStatus = "new" | "contacted" | "enrolled" | "closed";
export type InquiryType = "consult" | "trial";

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
  status: InquiryStatus;
  inquiry_type: InquiryType;
  referred_by: string | null;
  created_at: string;
}

export interface InquiryNote {
  id: string;
  inquiry_id: string;
  note: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Class {
  id: string;
  name: string;
  days_of_week: number[];
  start_time: string;
  end_time: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClassEnrollment {
  id: string;
  class_id: string;
  student_id: string;
  enrolled_at: string;
  unenrolled_at: string | null;
  created_at: string;
}

export type AttendanceStatus = "present" | "absent" | "late";
export type HomeworkStatus = "done" | "partial" | "not_done" | "na";

export interface ClassSession {
  id: string;
  class_id: string;
  session_date: string;
  topic: string | null;
  materials: string | null;
  note: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ClassSessionAttendance {
  id: string;
  session_id: string;
  student_id: string;
  status: AttendanceStatus;
  homework_status: HomeworkStatus;
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
  grading_attempts: number;
  graded_at: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  session_date: string;
  is_targeted_review: boolean;
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

export type SessionNoteLanguage = "ko" | "en";

export interface SessionNote {
  id: string;
  student_id: string;
  scan_id: string | null;
  session_date: string;
  note: string;
  source: "ai" | "teacher";
  edited_by_teacher: boolean;
  confirmed: boolean;
  language: SessionNoteLanguage;
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

export interface MessageThread {
  id: string;
  parent_id: string;
  last_message_at: string | null;
  last_message_body: string | null;
  last_sender_id: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  thread_id: string;
  sender_id: string;
  body: string;
  read_at: string | null;
  deleted_at: string | null;
  created_at: string;
}

export interface GeneratedProblem {
  id: string;
  worksheet_id: string;
  source_item_id: string | null;
  source_reference_id: string | null;
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

export interface ReferenceProblemScan {
  id: string;
  uploaded_by: string;
  storage_path: string;
  original_filename: string | null;
  mime_type: "image/jpeg" | "image/png" | "application/pdf";
  file_size_bytes: number | null;
  status: ScanStatus;
  grading_error: string | null;
  grading_attempts: number;
  graded_at: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReferenceProblem {
  id: string;
  scan_id: string;
  problem_number: string | null;
  transcribed_problem: string;
  transcribed_answer: string | null;
  concept_id: string | null;
  ai_confidence_note: string | null;
  ai_suggested: unknown;
  source: "ai" | "teacher";
  edited_by_teacher: boolean;
  confirmed: boolean;
  created_at: string;
  updated_at: string;
}

type ProfileInsert = {
  id: string;
  role: Role;
  email: string;
  full_name?: string | null;
  sms_consent?: boolean;
  sms_consent_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

type ProfileUpdate = Partial<ProfileInsert>;

type StudentInsert = {
  id?: string;
  full_name: string;
  grade: Grade;
  track?: Track;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
};

type StudentUpdate = Partial<StudentInsert>;

type StudentGuardianInsert = {
  id?: string;
  student_id: string;
  guardian_id: string;
  created_at?: string;
};

type StudentGuardianUpdate = Partial<StudentGuardianInsert>;

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
  status?: InquiryStatus;
  inquiry_type?: InquiryType;
  referred_by?: string | null;
  created_at?: string;
};

type InquiryUpdate = Partial<InquiryInsert>;

type InquiryNoteInsert = {
  id?: string;
  inquiry_id: string;
  note: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
};

type InquiryNoteUpdate = Partial<InquiryNoteInsert>;

type ClassInsert = {
  id?: string;
  name: string;
  days_of_week: number[];
  start_time: string;
  end_time: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

type ClassUpdate = Partial<ClassInsert>;

type ClassEnrollmentInsert = {
  id?: string;
  class_id: string;
  student_id: string;
  enrolled_at?: string;
  unenrolled_at?: string | null;
  created_at?: string;
};

type ClassEnrollmentUpdate = Partial<ClassEnrollmentInsert>;

type ClassSessionInsert = {
  id?: string;
  class_id: string;
  session_date?: string;
  topic?: string | null;
  materials?: string | null;
  note?: string | null;
  created_by: string;
  created_at?: string;
  updated_at?: string;
};

type ClassSessionUpdate = Partial<ClassSessionInsert>;

type ClassSessionAttendanceInsert = {
  id?: string;
  session_id: string;
  student_id: string;
  status: AttendanceStatus;
  homework_status?: HomeworkStatus;
  created_at?: string;
};

type ClassSessionAttendanceUpdate = Partial<ClassSessionAttendanceInsert>;

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
  grading_attempts?: number;
  graded_at?: string | null;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
  session_date?: string;
  is_targeted_review?: boolean;
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
  language?: SessionNoteLanguage;
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
  source_reference_id?: string | null;
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

type ReferenceProblemScanInsert = {
  id?: string;
  uploaded_by: string;
  storage_path: string;
  original_filename?: string | null;
  mime_type: "image/jpeg" | "image/png" | "application/pdf";
  file_size_bytes?: number | null;
  status?: ScanStatus;
  grading_error?: string | null;
  grading_attempts?: number;
  graded_at?: string | null;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
  created_at?: string;
  updated_at?: string;
};

type ReferenceProblemScanUpdate = Partial<ReferenceProblemScanInsert>;

type ReferenceProblemInsert = {
  id?: string;
  scan_id: string;
  problem_number?: string | null;
  transcribed_problem: string;
  transcribed_answer?: string | null;
  concept_id?: string | null;
  ai_confidence_note?: string | null;
  ai_suggested?: unknown;
  source?: "ai" | "teacher";
  edited_by_teacher?: boolean;
  confirmed?: boolean;
  created_at?: string;
  updated_at?: string;
};

type ReferenceProblemUpdate = Partial<ReferenceProblemInsert>;

type MessageThreadInsert = {
  id?: string;
  parent_id: string;
  last_message_at?: string | null;
  last_message_body?: string | null;
  last_sender_id?: string | null;
  created_at?: string;
};

type MessageThreadUpdate = Partial<MessageThreadInsert>;

type MessageInsert = {
  id?: string;
  thread_id: string;
  sender_id: string;
  body: string;
  read_at?: string | null;
  created_at?: string;
};

type MessageUpdate = Partial<MessageInsert>;

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
        Relationships: [];
      };
      student_guardians: {
        Row: StudentGuardian;
        Insert: StudentGuardianInsert;
        Update: StudentGuardianUpdate;
        Relationships: [
          {
            foreignKeyName: "student_guardians_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "student_guardians_guardian_id_fkey";
            columns: ["guardian_id"];
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
      inquiry_notes: {
        Row: InquiryNote;
        Insert: InquiryNoteInsert;
        Update: InquiryNoteUpdate;
        Relationships: [
          {
            foreignKeyName: "inquiry_notes_inquiry_id_fkey";
            columns: ["inquiry_id"];
            isOneToOne: false;
            referencedRelation: "inquiries";
            referencedColumns: ["id"];
          },
        ];
      };
      classes: {
        Row: Class;
        Insert: ClassInsert;
        Update: ClassUpdate;
        Relationships: [];
      };
      class_enrollments: {
        Row: ClassEnrollment;
        Insert: ClassEnrollmentInsert;
        Update: ClassEnrollmentUpdate;
        Relationships: [
          {
            foreignKeyName: "class_enrollments_class_id_fkey";
            columns: ["class_id"];
            isOneToOne: false;
            referencedRelation: "classes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "class_enrollments_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      class_sessions: {
        Row: ClassSession;
        Insert: ClassSessionInsert;
        Update: ClassSessionUpdate;
        Relationships: [
          {
            foreignKeyName: "class_sessions_class_id_fkey";
            columns: ["class_id"];
            isOneToOne: false;
            referencedRelation: "classes";
            referencedColumns: ["id"];
          },
        ];
      };
      class_session_attendance: {
        Row: ClassSessionAttendance;
        Insert: ClassSessionAttendanceInsert;
        Update: ClassSessionAttendanceUpdate;
        Relationships: [
          {
            foreignKeyName: "class_session_attendance_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "class_sessions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "class_session_attendance_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
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
            foreignKeyName: "generated_problems_source_reference_id_fkey";
            columns: ["source_reference_id"];
            isOneToOne: false;
            referencedRelation: "reference_problems";
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
      reference_problem_scans: {
        Row: ReferenceProblemScan;
        Insert: ReferenceProblemScanInsert;
        Update: ReferenceProblemScanUpdate;
        Relationships: [
          {
            foreignKeyName: "reference_problem_scans_uploaded_by_fkey";
            columns: ["uploaded_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      reference_problems: {
        Row: ReferenceProblem;
        Insert: ReferenceProblemInsert;
        Update: ReferenceProblemUpdate;
        Relationships: [
          {
            foreignKeyName: "reference_problems_scan_id_fkey";
            columns: ["scan_id"];
            isOneToOne: false;
            referencedRelation: "reference_problem_scans";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reference_problems_concept_id_fkey";
            columns: ["concept_id"];
            isOneToOne: false;
            referencedRelation: "concepts";
            referencedColumns: ["id"];
          },
        ];
      };
      message_threads: {
        Row: MessageThread;
        Insert: MessageThreadInsert;
        Update: MessageThreadUpdate;
        Relationships: [
          {
            foreignKeyName: "message_threads_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "message_threads_last_sender_id_fkey";
            columns: ["last_sender_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      messages: {
        Row: Message;
        Insert: MessageInsert;
        Update: MessageUpdate;
        Relationships: [
          {
            foreignKeyName: "messages_thread_id_fkey";
            columns: ["thread_id"];
            isOneToOne: false;
            referencedRelation: "message_threads";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "messages_sender_id_fkey";
            columns: ["sender_id"];
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
      error_type: ErrorType;
      scan_status: ScanStatus;
      practice_sheet_status: PracticeSheetStatus;
    };
    CompositeTypes: { [_ in never]: never };
  };
};
