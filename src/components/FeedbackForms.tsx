"use client";

import React from "react";
import { FormComponent } from "@/components/ui/form";
import { AnsweredQuestions } from "@/components/AnsweredQuestions";
import { useFeedbackForm } from "@/hooks/useFeedbackForm";
import { getFieldsForReason } from "@/lib/feedbackFormFields";

/**
 * Props for the FeedbackForm component
 * @interface FeedbackFormProps
 * @property {string} [className] - CSS class name for custom styling
 * @property {function} [onSubmit] - Callback function triggered when form is submitted
 * @property {string} reason - The reason for cancellation that determines which form to display
 * @property {boolean} [showNextQuestion=false] - When true, shows the next question in the sequence
 * @property {number} [currentQuestionIndex] - Directly sets which question to display (0-based index)
 * @property {string} [statusMessage] - Status message to display while submitting the response
 */
interface FeedbackFormProps {
  className?: string;
  onSubmit?: (reason: string, data: Record<string, string>) => void;
  reason: string;
  showNextQuestion?: boolean;
  currentQuestionIndex?: number;
  statusMessage?: string;
}

/**
 * A conversational feedback form component that displays questions one at a time
 * and collects user responses. The component shows a different set of questions
 * based on the provided reason.
 * 
 * @component
 * @param {FeedbackFormProps} props - The component props
 * @param {string} [props.className] - CSS class name for custom styling
 * @param {function} [props.onSubmit] - Callback function triggered when form is submitted
 * @param {string} props.reason - The reason for cancellation that determines which form to display
 * @param {boolean} [props.showNextQuestion=false] - When true, shows the next question in the sequence
 * @param {number} [props.currentQuestionIndex] - Directly sets which question to display (0-based index)
 * @param {string} [props.statusMessage] - Status message to display while submitting the response
 * @returns {React.ReactNode} The feedback form component
 * 
 * @example
 * // Basic usage with a reason
 * <FeedbackForm reason="too-expensive" />
 * 
 * @example
 * // With custom styling and callback
 * <FeedbackForm
 *   className="my-custom-class"
 *   reason="missing-features"
 *   onSubmit={(reason, data) => console.log(reason, data)}
 * />
 */
export function FeedbackForm({ 
  className, 
  onSubmit, 
  reason, 
  showNextQuestion = false,
  currentQuestionIndex: propQuestionIndex,
  statusMessage
}: FeedbackFormProps) {
  // Get fields based on selected reason
  const allFields = getFieldsForReason(reason);
  
  // Use our custom hook for form logic
  const { 
    state, 
    isPending, 
    error, 
    handleQuestionSubmit 
  } = useFeedbackForm({
    reason,
    showNextQuestion,
    currentQuestionIndex: propQuestionIndex,
    allFields,
    onSubmit
  });

  if (!state) return null;

  // Show error message if there's a submission error
  if (error) {
    return (
      <div className={className}>
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 mb-4">
          <p className="text-sm text-destructive">
            {error instanceof Error ? error.message : "An error occurred"}
          </p>
        </div>
      </div>
    );
  }
  
  // Get the current question to display
  const currentField = allFields[state.currentQuestionIndex];
  const currentFieldArray = currentField ? [currentField] : [];
  const isCurrentQuestionAnswered = state.answeredQuestions.includes(state.currentQuestionIndex);
  
  return (
    <div className={className}>
      {/* Render summaries of answered questions */}
      <AnsweredQuestions 
        answeredQuestions={state.answeredQuestions}
        allFields={allFields}
        formData={state.formData}
      />
      
      {/* Only show the current question form if it hasn't been answered */}
      {!isCurrentQuestionAnswered && (
        <>
          <FormComponent
            fields={currentFieldArray}
            onSubmit={handleQuestionSubmit}
            variant="solid"
            submitText={isPending ? "Submitting..." : "Submit"}
            _tambo_displayMessage={isPending}
            _tambo_statusMessage={statusMessage}
          />
          <div className="mt-3 text-xs text-muted-foreground">
            Question {state.currentQuestionIndex + 1} of {allFields.length} • You can also type your response in the chat
          </div>
        </>
      )}
    </div>
  );
} 