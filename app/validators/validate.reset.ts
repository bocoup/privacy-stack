import { conformZodMessage } from "@conform-to/zod";
import { z } from "zod";

export const createSchema = (options?: {
  reset: (email: string, password: string) => Promise<boolean>;
}) =>
  z
    .object({
      token: z.string({ required_error: "Token is missing" }),
      password: z.string().superRefine((password, ctx) => {
        if (password.length < 8) {
          return ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Password must be at least 8 characters.",
          });
        }
        return true;
      }),
    })
    .superRefine(({ token, password }, ctx) => {
      if (typeof options?.reset !== "function") {
        ctx.addIssue({
          code: "custom",
          message: conformZodMessage.VALIDATION_UNDEFINED,
          fatal: true,
        });
        return;
      }

      return options.reset(token, password).then((isReset) => {
        if (!isReset) {
          ctx.addIssue({
            code: "custom",
            message: "Account not found.",
            path: ["password"],
          });
        }
      });
    });
