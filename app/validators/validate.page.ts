import { conformZodMessage } from "@conform-to/zod";
import { z } from "zod";

export const createSchema = (options?: {
  isSlugUnique: (slug: string) => Promise<boolean>;
}) =>
  z
    .object({
      id: z.string(),
      title: z.string(),
      slug: z.string({ required_error: "Link can't be empty" }).pipe(
        z.string().superRefine((slug, ctx) => {
          if (typeof options?.isSlugUnique !== "function") {
            ctx.addIssue({
              code: "custom",
              message: conformZodMessage.VALIDATION_UNDEFINED,
              fatal: true,
            });
            return;
          }

          return options.isSlugUnique(slug).then((isUnique) => {
            if (!isUnique) {
              ctx.addIssue({
                code: "custom",
                message:
                  "Another page already has this link, please pick a different one",
              });
            }
          });
        }),
      ),
      body: z.string(),
      image: z.any().optional(),
      imageDescription: z.string().optional(),
    })
    .superRefine(({ image, imageDescription }, refinementContext) => {
      if (image !== undefined && imageDescription === undefined) {
        return refinementContext.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Image descriptions are required for images.",
          path: ["imageDescription"],
        });
      }
      return true;
    });
