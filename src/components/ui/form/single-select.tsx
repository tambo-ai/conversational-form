import { useTamboComponentState, useTamboThread } from "@tambo-ai/react";
import { z } from "zod";
import { Label } from "../label";
import { RadioGroup, RadioGroupItem } from "../radio-group";

export const singleSelectSchema = z.object({
  id: z.string(),
  title: z.string(),
  options: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    )
    .default([]),
  value: z.string().optional(),
});

type SingleSelectProps = z.infer<typeof singleSelectSchema>;
type SingleSelectState = { value: string };

export function SingleSelect({
  id,
  title,
  options = [],
  value = "",
}: SingleSelectProps) {
  const [state, setState] = useTamboComponentState<SingleSelectState>(
    `single-select-${id}`,
    {
      value,
    }
  );

  const { setInputValue } = useTamboThread();

  return (
    <div className="space-y-2">
      {title && <Label>{title}</Label>}
      <RadioGroup
        value={state?.value ?? value}
        onValueChange={(newValue) => {
          setState({ value: newValue });
          setInputValue(`I've made my selection.`);
        }}
        className="space-y-2"
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={`${id}-${option.value}`} />
            <Label htmlFor={`${id}-${option.value}`} className="font-normal">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
