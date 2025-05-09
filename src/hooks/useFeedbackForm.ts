import {
  useTambo,
  useTamboComponentState,
  useTamboThreadInput,
} from "@tambo-ai/react";
import { useEffect, useState } from "react";

/**
 * State interface for the feedback form
 * @interface FeedbackState
 * @property {boolean} submitted - Whether the complete feedback form has been submitted successfully
 * @property {Record<string, string>} formData - Accumulated object containing all user responses across all questions
 * @property {number} currentQuestionIndex - Index of the currently displayed question (0-based)
 * @property {boolean} isComplete - Whether the entire form process has been completed (all questions answered)
 * @property {boolean} awaitingNextQuestion - Flag that indicates the form is waiting for a signal to show the next question
 * @property {number[]} answeredQuestions - Array of indices for questions that have been answered (used for rendering summaries)
 */
export interface FeedbackState {
  submitted: boolean;
  formData: Record<string, string>;
  currentQuestionIndex: number;
  isComplete: boolean;
  awaitingNextQuestion: boolean;
  answeredQuestions: number[];
}

/**
 * Props for the useFeedbackForm hook
 * @interface UseFeedbackFormProps
 * @property {string} reason - The feedback reason category (e.g., "too-expensive") that determines which form fields to display
 * @property {boolean} [showNextQuestion] - When set to true, advances to the next question if awaitingNextQuestion is true
 * @property {number} [currentQuestionIndex] - Explicitly sets which question to display (overrides sequential navigation)
 * @property {FormField[]} allFields - Complete array of form fields for this feedback reason
 * @property {function} [onSubmit] - Optional callback function triggered when the entire form is submitted
 */
interface UseFeedbackFormProps {
  reason: string;
  showNextQuestion?: boolean;
  currentQuestionIndex?: number;
  allFields: FormField[];
  onSubmit?: (reason: string, data: Record<string, string>) => void;
}

/**
 * Custom hook that manages the state and behavior of a multi-step feedback form
 *
 * This hook handles:
 * - Form state management with TamboComponentState
 * - Navigation between questions
 * - Submission of individual questions and final form data
 * - Error handling
 *
 * @param {UseFeedbackFormProps} props - Configuration options for the feedback form
 * @param {string} props.reason - The reason for feedback that determines which form to display
 * @param {boolean} [props.showNextQuestion=false] - Signal to show the next question
 * @param {number} [props.currentQuestionIndex] - Directly sets which question to display
 * @param {FormField[]} props.allFields - Array of all form field definitions
 * @param {function} [props.onSubmit] - Callback function triggered when form is submitted
 *
 * @returns {Object} Form state and handlers
 * @returns {FeedbackState} state - The current state of the feedback form
 * @returns {boolean} isPending - Whether a submission is in progress
 * @returns {Error | string | null} error - Any error that occurred during submission
 * @returns {function} handleQuestionSubmit - Function to handle question submission
 *
 * @example
 * const {
 *   state,
 *   isPending,
 *   error,
 *   handleQuestionSubmit
 * } = useFeedbackForm({
 *   reason: "too-expensive",
 *   allFields: tooExpensiveFields,
 *   onSubmit: (reason, data) => console.log(reason, data)
 * });
 */
export function useFeedbackForm({
  reason,
  showNextQuestion = false,
  currentQuestionIndex: propQuestionIndex,
  allFields,
  onSubmit,
}: UseFeedbackFormProps) {
  // Access the current Tambo thread and derive the contextKey for message submission
  const { thread } = useTambo();
  const contextKey = thread?.contextKey || "tambo-template";

  // Initialize persistent form state using Tambo component state with unique key per reason
  const [state, setState] = useTamboComponentState<FeedbackState>(
    `feedback-form-${reason}`,
    {
      submitted: false,
      formData: {},
      currentQuestionIndex: 0,
      isComplete: false,
      awaitingNextQuestion: false,
      answeredQuestions: [],
    }
  );

  // Set up message submission hooks and local error state tracking
  const { setValue, submit, isPending, error } =
    useTamboThreadInput(contextKey);
  const [submitError, setSubmitError] = useState<Error | null>(null);

  /**
   * Effect that handles navigation between questions based on external controls
   * Logic:
   * 1. If a specific question index is provided via props, it takes highest priority
   * 2. If showNextQuestion flag is true and the form is awaiting next question, it advances
   * This allows both direct control of which question to show and sequential progression
   */
  useEffect(() => {
    if (
      propQuestionIndex !== undefined &&
      state &&
      propQuestionIndex !== state.currentQuestionIndex
    ) {
      // If a specific question index is provided, use it
      setState({
        ...state,
        currentQuestionIndex: propQuestionIndex,
        awaitingNextQuestion: false,
      });
    } else if (showNextQuestion && state?.awaitingNextQuestion) {
      // Otherwise use the showNextQuestion prop
      setState({
        ...state,
        awaitingNextQuestion: false,
      });
    }
  }, [
    showNextQuestion,
    propQuestionIndex,
    state?.currentQuestionIndex,
    state?.awaitingNextQuestion,
    setState,
  ]);

  /**
   * Handles the submission of a question's answer with different behavior for last vs. non-last questions
   *
   * Process flow:
   * 1. Merge existing form data with the newly submitted answer
   * 2. Checks if this is the last question
   * 3. For the last question:
   *    - Update state, submit complete feedback dataset, mark as completed
   *    - Submits the entire form data to the Tambo thread
   *    - Calls the onSubmit callback if provided
   * 4. For non-last questions:
   *    - Submit individual answer and prepare for next question
   *    - Sets awaitingNextQuestion flag to true
   *
   * @param {Record<string, string>} data - Form data containing the answer for the current question
   */
  const handleQuestionSubmit = async (data: Record<string, string>) => {
    try {
      // Merge existing form data with the newly submitted answer
      const updatedFormData = {
        ...state?.formData,
        ...data,
      };

      const isLastQuestion =
        (state?.currentQuestionIndex || 0) >= allFields.length - 1;
      const currentIndex = state?.currentQuestionIndex || 0;

      if (isLastQuestion) {
        // Last question handling: update state, submit complete feedback dataset, mark as completed
        setState({
          ...state,
          formData: updatedFormData,
          isComplete: true,
          submitted: false,
          currentQuestionIndex: currentIndex,
          awaitingNextQuestion: false,
          answeredQuestions: [
            ...(state?.answeredQuestions || []),
            currentIndex,
          ],
        });

        // Submit all collected feedback data as a formatted message to the Tambo thread
        const fullMessage = `Feedback submission: ${reason}\n${JSON.stringify(
          updatedFormData,
          null,
          2
        )}`;

        if (!fullMessage.trim()) {
          throw new Error("Cannot submit empty feedback");
        }

        setValue(fullMessage);
        try {
          await submit({
            contextKey,
            streamResponse: true,
          });
        } catch (error) {
          console.error("Error submitting feedback:", error);
          return;
        }

        // Only clear the value if submission was successful
        setTimeout(() => {
          if (fullMessage.trim()) {
            // Double check before clearing
            setValue("");
          }
        }, 100);

        // Mark as successfully submitted
        setState({
          formData: updatedFormData,
          isComplete: true,
          submitted: true,
          currentQuestionIndex: currentIndex,
          awaitingNextQuestion: false,
          answeredQuestions: [
            ...(state?.answeredQuestions || []),
            currentIndex,
          ],
        });

        if (onSubmit) {
          onSubmit(reason, updatedFormData);
        }
      } else {
        // Non-last question handling: submit individual answer and prepare for next question
        const fieldId = Object.keys(data)[0];
        const fieldValue = data[fieldId];
        const currentField = allFields[currentIndex];
        const message = `Feedback submission: "${currentField.label}": ${fieldValue}`;

        if (!message.trim()) {
          throw new Error("Cannot submit empty feedback");
        }

        // Submit individual answer to the Tambo thread with streaming enabled
        setValue(message);
        try {
          await submit({
            contextKey,
            streamResponse: true,
          });
        } catch (error) {
          console.error("Error submitting feedback:", error);
          return;
        }

        // Only clear the value if submission was successful
        setTimeout(() => {
          if (message.trim()) {
            // Double check before clearing
            setValue("");
          }
        }, 100);

        // Advance to next question: update index, mark current question as answered, and signal readiness
        setState({
          ...state,
          formData: updatedFormData,
          awaitingNextQuestion: true,
          currentQuestionIndex: currentIndex + 1,
          submitted: false,
          isComplete: false,
          answeredQuestions: [
            ...(state?.answeredQuestions || []),
            currentIndex,
          ],
        });
      }
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      if (err instanceof Error) {
        setSubmitError(err);
      } else {
        setSubmitError(
          new Error(
            typeof err === "string"
              ? err
              : "Failed to send feedback. Please try again."
          )
        );
      }
    }
  };

  return {
    state,
    isPending,
    error: submitError || error,
    handleQuestionSubmit,
  };
}
