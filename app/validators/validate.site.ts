import { z } from "zod";

export const schema = z
  .object({
    id: z.string().optional(),
    userId: z.string(),
    name: z.string(),
    tagline: z.string(),
    lede: z.string(),
    image: z.any().optional(),
    logoDescription: z.string().optional(),
  })
  .superRefine(({ image, logoDescription }, refinementContext) => {
    if (image !== undefined && logoDescription === undefined) {
      return refinementContext.addIssue({
        code: z.ZodIssueCode.custom,
        message: "An image description is required for the logo.",
        path: ["logoDescription"],
      });
    }
    return true;
  });
