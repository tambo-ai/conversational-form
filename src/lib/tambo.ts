/**
 * @file tambo.ts
 * @description Central configuration file for Tambo components and tools
 *
 * This file serves as the central place to register your Tambo components and tools.
 * It exports arrays that will be used by the TamboProvider.
 *
 * Read more about Tambo at https://tambo.co/docs
 */

import { FeedbackForm } from "@/components/FeedbackForms";
import type { TamboComponent } from "@tambo-ai/react";
import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";

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
    name: "FeedbackForm",
    description: "A component for collecting detailed cancellation feedback with customized forms based on the reason selected. Users can provide their cancellation reason in the chat. When the user submits feedback, respond with a personalized thank you message that acknowledges their specific feedback and reason for cancellation. NEVER RENDER ANOTHER FEEDBACK FORM AFTER SUBMISSION - This component manages its own submission state internally.",
    component: FeedbackForm,
    propsSchema: z.object({
      className: z.string().optional().describe("CSS class name for styling"),
      onSubmit: z.function()
        .args(z.string(), z.record(z.string()))
        .returns(z.void())
        .optional()
        .describe("Callback function triggered when form is submitted with reason and form data"),
      reason: z.enum([
        "too-expensive", 
        "missing-features", 
        "bugs-reliability", 
        "switching-tools", 
        "no-longer-needed", 
        "poor-support", 
        "hard-to-use"
      ]).optional().describe("The reason for cancellation, can be provided directly or extracted from chat"),
      showNextQuestion: z.boolean().optional().describe("When set to true, shows the next question in the sequence instead of the response summary"),
      currentQuestionIndex: z.number().optional().describe("Directly sets which question to display (0-based index)"),
      statusMessage: z.string().optional().describe("Status message to display while submitting the response")
    }),
  },
  // Add more components here
];
