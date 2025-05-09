"use client";

import { isActiveThreadComponent } from "@/lib/thread-hooks";
import { useTamboComponentState, useTamboThread } from "@tambo-ai/react";
import { useEffect, useRef } from "react";
import { z } from "zod";
import { Label } from "../label";
import { RadioGroupItem, RadioGroup as ShadcnRadioGroup } from "../radio-group";

export const yesNoFieldSchema = z.object({
  id: z.string(),
  value: z.boolean().optional(),
  yesLabel: z.string().default("Yes"),
  noLabel: z.string().default("No"),
});

type YesNoFieldProps = z.infer<typeof yesNoFieldSchema>;

export function YesNoField({
  id,
  value: initialValue,
  yesLabel = "Yes",
  noLabel = "No",
}: YesNoFieldProps) {
  const [state, setState] = useTamboComponentState(`yes-no-field-${id}`, {
    value: initialValue ?? null,
  });

  // Keep track of the last props update to prevent loops
  const lastPropsUpdate = useRef(JSON.stringify(initialValue));

  // Update state when props change
  useEffect(() => {
    const currentPropsString = JSON.stringify(initialValue);
    if (currentPropsString !== lastPropsUpdate.current) {
      lastPropsUpdate.current = currentPropsString;
      setState({ value: initialValue ?? null });
    }
  }, [initialValue, setState]);

  // Use either state value or initial value as fallback
  const currentValue = state?.value ?? initialValue ?? null;

  const { setInputValue, thread, generationStage } = useTamboThread();

  // Check if this component is active in the current thread
  const isActiveComponent = isActiveThreadComponent(thread, generationStage);

  const handleValueChange = (newValue: string) => {
    if (isActiveComponent) {
      const boolValue = newValue === "true";
      setState({ value: boolValue });
      setInputValue(`I've made my selection.`);
    }
  };

  return (
    <div className={`space-y-2 ${!isActiveComponent ? "opacity-60" : ""}`}>
      <ShadcnRadioGroup
        value={currentValue?.toString()}
        onValueChange={handleValueChange}
        className="flex gap-4"
        disabled={!isActiveComponent}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value="true"
            id={`${id}-yes`}
            disabled={!isActiveComponent}
          />
          <Label htmlFor={`${id}-yes`} className="font-normal">
            {yesLabel}
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value="false"
            id={`${id}-no`}
            disabled={!isActiveComponent}
          />
          <Label htmlFor={`${id}-no`} className="font-normal">
            {noLabel}
          </Label>
        </div>
      </ShadcnRadioGroup>
    </div>
  );
}
