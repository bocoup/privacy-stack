import {
  FieldMetadata,
  unstable_useControl as useControl,
} from "@conform-to/react";
import { ComponentProps, ElementRef, useRef } from "react";

import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";

export const ToggleGroupConform = ({
  type = "single",
  meta,
  items,
  ...props
}: {
  type: "multiple" | "single";
  meta: FieldMetadata<string | string[]>;
  items: { value: string; label: string }[];
} & Omit<ComponentProps<typeof ToggleGroup>, "defaultValue">) => {
  const toggleGroupRef = useRef<ElementRef<typeof ToggleGroup>>(null);
  const control = useControl<string | string[] | (string | undefined)[]>(meta);

  return (
    <>
      {type === "single" ? (
        <input
          name={meta.name}
          ref={control.register}
          className="sr-only"
          tabIndex={-1}
          //@ts-expect-error dont know how to type this one
          defaultValue={meta.initialValue}
          onFocus={() => {
            toggleGroupRef.current?.focus();
          }}
        />
      ) : (
        <select
          multiple
          name={meta.name}
          className="sr-only"
          ref={control.register}
          onFocus={() => {
            toggleGroupRef.current?.focus();
          }}
          //@ts-expect-error dont know how to type this one
          defaultValue={meta.initialValue}
          tabIndex={-1}
        >
          {items.map((item) => (
            <option value={item.value} key={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      )}

      {
        //@ts-expect-error no idea what ts wants here
        <ToggleGroup
          {...props}
          type={type}
          ref={toggleGroupRef}
          value={control.value}
          onValueChange={(value: string & string[]) => {
            props.onValueChange?.(value);
            control.change(value);
          }}
        >
          {items.map((item) => (
            <ToggleGroupItem key={item.value} value={item.value}>
              {item.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      }
    </>
  );
};
