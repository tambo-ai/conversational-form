import { useTamboComponentState, useTamboThread } from "@tambo-ai/react";
import { z } from "zod";
import { Input } from "../input";
import { Label } from "../label";

export const textFieldSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.string().optional(),
  placeholder: z.string().optional(),
  type: z.enum(["text", "email", "password", "tel", "url"]).default("text"),
});

type TextFieldProps = z.infer<typeof textFieldSchema>;
type TextFieldState = {
  value: string;
  isValid: boolean;
};

export function TextField({
  id,
  label,
  value = "",
  placeholder,
  type,
}: TextFieldProps) {
  const [state, setState] = useTamboComponentState<TextFieldState>(
    `text-field-${id}`,
    {
      value,
      isValid: true,
    }
  );

  const { setInputValue } = useTamboThread();

  const validateInput = (value: string): boolean => {
    if (!value) return true; // Empty values are considered valid

    switch (type) {
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case "tel":
        return /^[+]?[\d\s-()]+$/.test(value);
      case "url":
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      default:
        return true;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setState({
      value: newValue,
      isValid: validateInput(newValue),
    });
    setInputValue(`I've made my selection.`);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        type={type}
        id={id}
        value={state!.value}
        onChange={handleChange}
        placeholder={placeholder}
        aria-invalid={!state!.isValid}
      />
    </div>
  );
}
