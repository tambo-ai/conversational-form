/**
 * @file tambo.ts
 * @description Central configuration file for Tambo components and tools
 *
 * This file serves as the central place to register your Tambo components and tools.
 * It exports arrays that will be used by the TamboProvider.
 *
 * Read more about Tambo at https://tambo.co/docs
 */

import {
  MultiSelect,
  multiSelectSchema,
} from "@/components/ui/form/multi-select";
import {
  SingleSelect,
  singleSelectSchema,
} from "@/components/ui/form/single-select";
import {
  SliderField,
  sliderFieldSchema,
} from "@/components/ui/form/slider-field";
import { TextField, textFieldSchema } from "@/components/ui/form/text-field";
import {
  YesNoField,
  yesNoFieldSchema,
} from "@/components/ui/form/yes-no-field";
import type { TamboComponent } from "@tambo-ai/react";
import { TamboTool } from "@tambo-ai/react";

/**
 * tools
 *
 * This array contains all the Tambo tools that are registered for use within the application.
 * Each tool is defined with its name, description, and expected props. The tools
 * can be controlled by AI to dynamically fetch data based on user interactions.
 */

export const tools: TamboTool[] = [
  // Add tools here
];

/**
 * components
 *
 * This array contains all the Tambo components that are registered for use within the application.
 * Each component is defined with its name, description, and expected props. The components
 * can be controlled by AI to dynamically render UI elements based on user interactions.
 */
export const components: TamboComponent[] = [
  {
    name: "MultiSelectField",
    description:
      "A group of checkboxes that allows selecting multiple options from a list. Used for gathering multiple responses.",
    component: MultiSelect,
    propsSchema: multiSelectSchema,
  },
  {
    name: "SingleSelectField",
    description:
      "A dropdown or radio group that allows selecting one option from a list. Used for single-choice questions.",
    component: SingleSelect,
    propsSchema: singleSelectSchema,
  },
  {
    name: "SliderField",
    description:
      "A range slider input with customizable min, max, step values and optional labels. Used for numeric or scale-based inputs.",
    component: SliderField,
    propsSchema: sliderFieldSchema,
  },
  {
    name: "TextField",
    description:
      "A single-line text input field for collecting free-form text responses or email addresses.",
    component: TextField,
    propsSchema: textFieldSchema,
  },
  {
    name: "YesNoField",
    description:
      "A simple yes/no question field presented as radio buttons or toggle. Used for binary choice questions.",
    component: YesNoField,
    propsSchema: yesNoFieldSchema,
  },
];
