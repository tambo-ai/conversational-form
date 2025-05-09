"use client";

import { isActiveThreadComponent } from "@/lib/thread-hooks";
import { cn } from "@/lib/utils";
import { useTamboComponentState, useTamboThread } from "@tambo-ai/react";
import { useEffect, useRef } from "react";
import { z } from "zod";

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

  const handleSelection = (value: boolean) => {
    if (isActiveComponent) {
      setState({ value });
      setInputValue(`I've made my selection.`);
    }
  };

  return (
    <div className={`${!isActiveComponent ? "opacity-60" : ""}`}>
      <div className="flex gap-3">
        <button
          className={cn(
            "py-2 px-3 rounded-2xl text-xs transition-colors",
            "border border-flat",
            "flex items-center justify-center",
            !isActiveComponent
              ? "bg-muted/50 text-muted-foreground"
              : currentValue === true
              ? "bg-green-100 text-green-800 border-green-300"
              : "bg-background hover:bg-green-50 hover:text-green-700 hover:border-green-200"
          )}
          disabled={!isActiveComponent}
          onClick={() => handleSelection(true)}
        >
          <span className="font-medium">{yesLabel}</span>
        </button>

        <button
          className={cn(
            "py-2 px-3 rounded-2xl text-xs transition-colors",
            "border border-flat",
            "flex items-center justify-center",
            !isActiveComponent
              ? "bg-muted/50 text-muted-foreground"
              : currentValue === false
              ? "bg-red-100 text-red-800 border-red-300"
              : "bg-background hover:bg-red-50 hover:text-red-700 hover:border-red-200"
          )}
          disabled={!isActiveComponent}
          onClick={() => handleSelection(false)}
        >
          <span className="font-medium">{noLabel}</span>
        </button>
      </div>
    </div>
  );
}
