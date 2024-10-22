import { conformZodMessage } from "@conform-to/zod";
import { z } from "zod";

export const createSchema = (options?: {
  verifyLogin: (email: string, password: string) => Promise<boolean>;
}) => {
  return z
    .object({
      email: z.string({ required_error: "Email can't be empty" }).email(),
      password: z.string(),
    })
    .superRefine(({ email, password }, ctx) => {
      if (typeof options?.verifyLogin !== "function") {
        ctx.addIssue({
          code: "custom",
          message: conformZodMessage.VALIDATION_UNDEFINED,
          fatal: true,
        });
        return;
      }

      return options.verifyLogin(email, password).then((isVerified) => {
        if (!isVerified) {
          ctx.addIssue({
            code: "custom",
            message: "Invalid email or password.",
            path: ["email"],
          });
        }
      });
    });
};
