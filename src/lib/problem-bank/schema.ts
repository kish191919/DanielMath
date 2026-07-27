import { z } from "zod";
import { SCAN_MIME_TYPES } from "@/lib/storage/mime";

const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

export const referenceUploadMetaSchema = z.object({
  original_filename: z.string().min(1),
  mime_type: z.enum(SCAN_MIME_TYPES),
  file_size_bytes: z.coerce
    .number()
    .int()
    .positive()
    .max(MAX_UPLOAD_BYTES, "파일 크기는 20MB를 초과할 수 없습니다."),
});

