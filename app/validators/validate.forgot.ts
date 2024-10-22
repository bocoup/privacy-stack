import { conformZodMessage } from "@conform-to/zod";
import { z } from "zod";

export const createSchema = (options?: {
  emailExists: (slug: string) => Promise<boolean>;
}) =>
  z.object({
    email: z
      .string({ required_error: "Link can't be empty" })
      .email()
      .pipe(
        z.string().superRefine((email, ctx) => {
          if (typeof options?.emailExists !== "function") {
            ctx.addIssue({
              code: "custom",
              message: conformZodMessage.VALIDATION_UNDEFINED,
              fatal: true,
            });
            return;
          }

          return options.emailExists(email).then((exists) => {
            if (!exists) {
              ctx.addIssue({
                code: "custom",
                message:
                  "This email is already in use, please pick a different one",
              });
            }
          });
        }),
      ),
  });
