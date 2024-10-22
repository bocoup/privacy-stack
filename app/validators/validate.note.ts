import { z } from "zod";

export const schema = z
  .object({
    id: z.string(),
    userId: z.string(),
    name: z.string(),
    body: z.string().optional(),
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
