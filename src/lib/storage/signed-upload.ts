import "server-only";
import { createAdminSupabase } from "@/lib/supabase/admin";

export type SignedUploadResult =
  | { error: string }
  | { path: string; signedUrl: string; token: string };

export async function mintSignedUploadUrl(bucket: string, path: string): Promise<SignedUploadResult> {
  const admin = createAdminSupabase();
  const { data, error } = await admin.storage.from(bucket).createSignedUploadUrl(path);
  if (error || !data) {
    return { error: error?.message ?? "업로드 URL 생성에 실패했습니다." };
  }
  return { path, signedUrl: data.signedUrl, token: data.token };
}
