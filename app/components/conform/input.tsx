import { FieldMetadata, getInputProps } from "@conform-to/react";
import { ComponentProps } from "react";

import { Input } from "../ui/input";

export const InputConform = ({
  meta,
  type,
  ...props
}: {
  meta: FieldMetadata<string>;
  type: Parameters<typeof getInputProps>[1]["type"];
} & ComponentProps<typeof Input>) => {
  return (
    <Input
      {...getInputProps(meta, { type, ariaAttributes: true })}
      {...props}
    />
  );
};
