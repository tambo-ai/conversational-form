import { isActiveThreadComponent } from "@/lib/thread-hooks";
import { cn } from "@/lib/utils";
import { useTamboComponentState, useTamboThread } from "@tambo-ai/react";
import { z } from "zod";

export const singleSelectSchema = z.object({
  id: z.string(),
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
  options = [],
  value = "",
}: SingleSelectProps) {
  const [state, setState] = useTamboComponentState<SingleSelectState>(
    `single-select-${id}`,
    {
      value,
    }
  );

  const { setInputValue, thread, generationStage } = useTamboThread();

  // Check if this component is active in the current thread
  const isActiveComponent = isActiveThreadComponent(thread, generationStage);

  // Get the current value with fallback
  const currentValue = state?.value ?? value;

  return (
    <div className={`${!isActiveComponent ? "opacity-60" : ""}`}>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = currentValue === option.value;

          return (
            <button
              key={option.value}
              className={cn(
                "py-2 px-2.5 rounded-2xl text-xs transition-colors",
                "border border-flat",
                "flex items-center gap-1.5",
                !isActiveComponent
                  ? "bg-muted/50 text-muted-foreground"
                  : isSelected
                  ? "bg-accent text-accent-foreground"
                  : "bg-background hover:bg-accent hover:text-accent-foreground"
              )}
              disabled={!isActiveComponent}
              onClick={() => {
                if (isActiveComponent) {
                  setState({ value: option.value });
                  setInputValue(`I've made my selection.`);
                }
              }}
            >
              {isSelected ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
              )}
              <span className="font-medium">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
