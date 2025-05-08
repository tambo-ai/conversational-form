"use client";

import React from "react";
import { FormField } from "@/components/ui/form";

/**
 * Props for the AnsweredQuestions component
 * @interface AnsweredQuestionsProps
 * @property {number[]} answeredQuestions - Array of indices for questions that have been answered
 * @property {FormField[]} allFields - Array of all form field definitions
 * @property {Record<string, string>} formData - Object containing user-submitted answers keyed by field id
 */
interface AnsweredQuestionsProps {
  answeredQuestions: number[];
  allFields: FormField[];
  formData: Record<string, string>;
}

/**
 * Displays a summary of questions that have already been answered
 * Each answered question is shown with its label and the user's response
 * 
 * @component
 * @param {AnsweredQuestionsProps} props - The component props
 * @param {number[]} props.answeredQuestions - Array of indices for questions that have been answered
 * @param {FormField[]} props.allFields - Array of all form field definitions
 * @param {Record<string, string>} props.formData - Object containing user-submitted answers keyed by field id
 * @returns {React.ReactNode} Summary of answered questions or null if none
 * 
 * @example
 * <AnsweredQuestions
 *   answeredQuestions={[0, 1]}
 *   allFields={formFields}
 *   formData={{ "question-1": "Answer 1", "question-2": "Answer 2" }}
 * />
 */
export function AnsweredQuestions({ 
  answeredQuestions, 
  allFields, 
  formData 
}: AnsweredQuestionsProps) {
  return (
    <>
      {answeredQuestions.map((index) => {
        const field = allFields[index];
        const value = formData[field.id];
        
        return (
          <div key={field.id} className="p-4 rounded-lg bg-muted/50 border border-border mb-4">
            <div className="flex flex-col">
              <span className="text-sm font-medium">{field.label}</span>
              <span className="text-sm text-muted-foreground">{value}</span>
            </div>
          </div>
        );
      })}
    </>
  );
} 