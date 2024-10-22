import { conformZodMessage } from "@conform-to/zod";
import { z } from "zod";

export const createSchema = (options?: {
  isEmailUsed: (slug: string) => Promise<boolean>;
}) =>
  z.object({
    email: z
      .string({ required_error: "Link can't be empty" })
      .email()
      .pipe(
        z.string().superRefine((email, ctx) => {
          if (typeof options?.isEmailUsed !== "function") {
            ctx.addIssue({
              code: "custom",
              message: conformZodMessage.VALIDATION_UNDEFINED,
              fatal: true,
            });
            return;
          }

          return options.isEmailUsed(email).then((isUnique) => {
            if (!isUnique) {
              ctx.addIssue({
                code: "custom",
                message:
                  "This email is already in use, please pick a different one",
              });
            }
          });
        }),
      ),
    password: z.string().superRefine((password, ctx) => {
      if (password.length < 8) {
        return ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password must be at least 8 characters.",
          path: ["password"],
        });
      }
      return true;
    }),
    doNotSell: z.preprocess((value) => value === "on", z.boolean()),
  });
