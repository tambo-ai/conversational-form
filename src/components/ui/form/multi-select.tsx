"use client";

import { isActiveThreadComponent } from "@/lib/thread-hooks";
import { useTamboComponentState, useTamboThread } from "@tambo-ai/react";
import { useEffect, useRef } from "react";
import { z } from "zod";
import { Checkbox } from "../checkbox";
import { Label } from "../label";

export const multiSelectSchema = z.object({
  id: z.string(),
  items: z
    .array(
      z.object({
        label: z.string(),
        checked: z.boolean(),
      })
    )
    .default([]),
});

type MultiSelectProps = z.infer<typeof multiSelectSchema>;
type MultiSelectState = {
  items: Array<{ label: string; checked: boolean }>;
};

export function MultiSelect({
  id,
  items: initialItems = [],
}: MultiSelectProps) {
  const [state, setState] = useTamboComponentState<MultiSelectState>(
    `multi-select-${id}`,
    {
      items: initialItems,
    }
  );

  const { setInputValue, thread, generationStage } = useTamboThread();

  // Keep track of the last props update to prevent loops
  const lastPropsUpdate = useRef(JSON.stringify(initialItems));

  // Update state when props change
  useEffect(() => {
    const currentPropsString = JSON.stringify(initialItems);
    if (currentPropsString !== lastPropsUpdate.current) {
      lastPropsUpdate.current = currentPropsString;
      setState({ items: initialItems });
    }
  }, [initialItems, setState]);

  // Use nullish coalescing for safer fallback
  const items = state?.items ?? initialItems;

  // Check if this component is active in the current thread
  const isActiveComponent = isActiveThreadComponent(thread, generationStage);

  return (
    <div className={`space-y-2 ${!isActiveComponent ? "opacity-60" : ""}`}>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Checkbox
              id={`${id}-${index}`}
              checked={Boolean(item.checked)}
              disabled={!isActiveComponent}
              onCheckedChange={(checked: boolean | "indeterminate") => {
                if (typeof checked === "boolean" && isActiveComponent) {
                  const newItems = [...items];
                  newItems[index] = { ...item, checked };
                  setState({ items: newItems });
                  setInputValue(`I've made my selection.`);
                }
              }}
            />
            <Label htmlFor={`${id}-${index}`} className="font-normal">
              {item.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
