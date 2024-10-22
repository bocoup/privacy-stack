import { z } from "zod";

export const schema = z
  .object({
    id: z.string(),
    doNotSell: z.preprocess((value) => value === "on", z.boolean()),
    visualAvatar: z.any().optional(),
    visualAvatarDescription: z.string().optional(),
  })
  .superRefine(
    ({ visualAvatar, visualAvatarDescription }, refinementContext) => {
      if (visualAvatar !== undefined && visualAvatarDescription === undefined) {
        return refinementContext.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Image descriptions are required for images.",
          path: ["imageDescription"],
        });
      }
      return true;
    },
  );
