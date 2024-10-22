import { FieldMetadata, getTextareaProps } from "@conform-to/react";
import { ComponentProps } from "react";

import { Textarea } from "~/components/ui/textarea";

export const TextareaConform = ({
  meta,
  ...props
}: {
  meta: FieldMetadata<string>;
} & ComponentProps<typeof Textarea>) => {
  return <Textarea {...getTextareaProps(meta)} {...props} />;
};
