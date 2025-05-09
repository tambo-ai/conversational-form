"use client";

import { isActiveThreadComponent } from "@/lib/thread-hooks";
import { cn } from "@/lib/utils";
import { useTamboComponentState, useTamboThread } from "@tambo-ai/react";
import { useEffect, useRef } from "react";
import { z } from "zod";

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

  // Function to toggle all items
  const toggleAllItems = (checked: boolean) => {
    if (isActiveComponent) {
      const newItems = items.map((item) => ({ ...item, checked }));
      setState({ items: newItems });
      setInputValue(
        `I've selected ${checked ? "all" : "none"} of the options.`
      );
    }
  };

  // Check if all items are selected
  const allSelected = items.length > 0 && items.every((item) => item.checked);

  return (
    <div className={`${!isActiveComponent ? "opacity-60" : ""}`}>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <button
            key={index}
            className={cn(
              "py-2 px-2.5 rounded-2xl text-xs transition-colors",
              "border border-flat",
              "flex items-center gap-1.5",
              !isActiveComponent
                ? "bg-muted/50 text-muted-foreground"
                : item.checked
                ? "bg-accent text-accent-foreground"
                : "bg-background hover:bg-accent hover:text-accent-foreground"
            )}
            disabled={!isActiveComponent}
            onClick={() => {
              if (isActiveComponent) {
                const newItems = [...items];
                newItems[index] = { ...item, checked: !item.checked };
                setState({ items: newItems });
                setInputValue(`I've made my selection.`);
              }
            }}
          >
            <div
              className={cn(
                "w-4 h-4 rounded border flex items-center justify-center",
                item.checked
                  ? "border-accent-foreground bg-accent"
                  : "border-muted-foreground"
              )}
            >
              {item.checked && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
            </div>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>
      {items.length > 0 && (
        <div className="mt-4 flex justify-center">
          <button
            className={cn(
              "py-1 px-2 rounded-md text-xs transition-colors",
              "border border-flat",
              !isActiveComponent
                ? "bg-muted/50 text-muted-foreground"
                : allSelected
                ? "bg-accent text-accent-foreground"
                : "bg-background hover:bg-accent hover:text-accent-foreground"
            )}
            disabled={!isActiveComponent}
            onClick={() => toggleAllItems(!allSelected)}
          >
            {allSelected ? "Deselect All" : "Select All"}
          </button>
        </div>
      )}
    </div>
  );
}
