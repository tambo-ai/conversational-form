import { useTamboComponentState, useTamboThread } from "@tambo-ai/react";
import { useEffect, useRef } from "react";
import { z } from "zod";
import { Label } from "../label";
import { Slider } from "../slider";

export const sliderFieldSchema = z.object({
  id: z.string(),
  label: z.string(),
  min: z.number().default(0),
  max: z.number().default(100),
  step: z.number().default(1),
  value: z.number().optional(),
  showValue: z.boolean().default(true),
});

type SliderFieldProps = z.infer<typeof sliderFieldSchema>;
type SliderFieldState = { value: number };

export function SliderField({
  id,
  label,
  min,
  max,
  step,
  value = min,
  showValue,
}: SliderFieldProps) {
  const [state, setState] = useTamboComponentState<SliderFieldState>(
    `slider-field-${id}`,
    {
      value,
    }
  );

  const { setInputValue } = useTamboThread();

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

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        {showValue && (
          <span className="text-sm text-muted-foreground">{currentValue}</span>
        )}
      </div>
      <Slider
        id={id}
        min={min}
        max={max}
        step={step}
        value={[currentValue]}
        onValueChange={([value]) => {
          setState({ value });
          setInputValue(`I've made my selection.`);
        }}
      />
      <div className="flex justify-between">
        <span className="text-sm text-muted-foreground">{min}</span>
        <span className="text-sm text-muted-foreground">{max}</span>
      </div>
    </div>
  );
}
