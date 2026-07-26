import { z } from "zod";

export const MESSAGE_BODY_MAX = 4000;

export const messageBodySchema = z
  .string()
  .trim()
  .min(1, "메시지를 입력해주세요.")
  .max(MESSAGE_BODY_MAX, "메시지가 너무 깁니다.");
