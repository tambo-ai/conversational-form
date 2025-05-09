import { isActiveThreadComponent } from "@/lib/thread-hooks";
import { useTamboComponentState, useTamboThread } from "@tambo-ai/react";
import { useEffect, useRef } from "react";
import { z } from "zod";
import { Slider } from "../slider";

export const sliderFieldSchema = z.object({
  id: z.string(),
  min: z.number().default(0),
  minLabel: z.string().nullable().describe("Describe the min value in words."),
  max: z.number().default(100),
  maxLabel: z.string().nullable().describe("Describe the max value in words."),
  step: z.number().default(1),
  value: z.number().optional(),
  showValue: z.boolean().default(true),
  prefix: z.string().nullable(),
});

type SliderFieldProps = z.infer<typeof sliderFieldSchema>;
type SliderFieldState = { value: number };

export function SliderField({
  id,
  min,
  minLabel,
  max,
  maxLabel,
  step,
  value = min,
  showValue,
  prefix,
}: SliderFieldProps) {
  const [state, setState] = useTamboComponentState<SliderFieldState>(
    `slider-field-${id}`,
    {
      value,
    }
  );

  const { setInputValue, thread, generationStage } = useTamboThread();

  // Keep track of the last props update to prevent loops
  const lastPropsUpdate = useRef(JSON.stringify(value));

  // Update state when props change
  useEffect(() => {
    const currentPropsString = JSON.stringify(value);
    if (currentPropsString !== lastPropsUpdate.current) {
      lastPropsUpdate.current = currentPropsString;
      setState({ value });
    }
  }, [value, setState]);

  const currentValue = state?.value ?? value;

  // Check if this component is active in the current thread
  const isActiveComponent = isActiveThreadComponent(thread, generationStage);

  return (
    <div className={`space-y-2 ${!isActiveComponent ? "opacity-60" : ""}`}>
      <div className="relative">
        {showValue && (
          <div className="flex justify-center mb-4">
            <span className="text-sm font-medium bg-background px-2 py-0.5 rounded-md shadow-sm border">
              {prefix}
              {currentValue}
            </span>
          </div>
        )}
        <Slider
          id={id}
          min={min}
          max={max}
          step={step}
          value={[currentValue]}
          disabled={!isActiveComponent}
          onValueChange={([value]) => {
            if (isActiveComponent) {
              setState({ value });
              setInputValue(`I've made my selection.`);
            }
          }}
        />
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col items-start">
          <span className="text-sm text-muted-foreground">
            {prefix}
            {min}
          </span>
          {minLabel && (
            <span className="text-xs text-muted-foreground">{minLabel}</span>
          )}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm text-muted-foreground">
            {prefix}
            {max}
          </span>
          {maxLabel && (
            <span className="text-xs text-muted-foreground">{maxLabel}</span>
          )}
        </div>
      </div>
    </div>
  );
}
