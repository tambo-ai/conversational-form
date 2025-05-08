"use client";

import React from "react";
import { FormComponent, FormField } from "@/components/ui/form";
import { useTamboComponentState, useTambo, useTamboThreadInput } from "@tambo-ai/react";

interface FeedbackState {
  submitted: boolean;
  formData: Record<string, string>;
  currentQuestionIndex: number;
  isComplete: boolean;
  awaitingNextQuestion: boolean;
  answeredQuestions: number[];
}

// Predefined form configurations for each reason
const tooExpensiveFields: FormField[] = [
  {
    id: "fair-price",
    type: "number",
    label: "What price would feel fair?",
    required: true,
  },
  {
    id: "discount-change-mind",
    type: "yes-no",
    label: "Would a discount change your mind?",
  }
];

const missingFeaturesFields: FormField[] = [
  {
    id: "missing-features",
    type: "checkbox",
    label: "What feature(s) did you expect but not find?",
    options: ["Feature A", "Feature B", "Feature C", "Feature D"],
  },
  {
    id: "most-important",
    type: "select",
    label: "Which was most important?",
    options: ["Feature A", "Feature B", "Feature C", "Feature D"],
  },
  {
    id: "notification-email",
    type: "text",
    label: "Are you open to hearing when it's added? (Enter email)",
    placeholder: "your@email.com",
  }
];

const bugsReliabilityFields: FormField[] = [
  {
    id: "frustration-issue",
    type: "textarea",
    label: "What issue caused the most frustration?",
  },
  {
    id: "frequency",
    type: "slider",
    label: "How often did it happen?",
    sliderLabels: ["Rarely", "Sometimes", "Often", "Constantly"],
  },
  {
    id: "reported",
    type: "yes-no",
    label: "Did you report it?",
  }
];

const switchingToolsFields: FormField[] = [
  {
    id: "switching-to",
    type: "select",
    label: "What tool are you switching to?",
    options: ["Competitor A", "Competitor B", "Competitor C", "Other"],
  },
  {
    id: "does-better",
    type: "checkbox",
    label: "What does it do better?",
    options: ["Price", "Features", "Reliability", "Support", "UX", "Performance"],
  },
  {
    id: "return-email",
    type: "text",
    label: "Would you return if we closed the gap? (Enter email)",
    placeholder: "your@email.com",
  }
];

const noLongerNeededFields: FormField[] = [
  {
    id: "what-changed",
    type: "checkbox",
    label: "What changed?",
    options: ["Business shut down", "Project ended", "Consolidating tools", "Other"],
  },
  {
    id: "usage-frequency",
    type: "slider",
    label: "How often were you using the product?",
    sliderLabels: ["Rarely", "Monthly", "Weekly", "Daily"],
  },
  {
    id: "future-use",
    type: "yes-no",
    label: "Would you consider using it again in the future?",
  }
];

const poorSupportFields: FormField[] = [
  {
    id: "support-issue",
    type: "select",
    label: "Which support issue?",
    options: ["Response time", "Resolution quality", "Staff knowledge", "Communication"],
  },
  {
    id: "support-problems",
    type: "checkbox",
    label: "What was bad about your support?",
    options: ["Too slow", "Didn't solve my problem", "Rude/unprofessional", "Hard to contact"],
  }
];

const hardToUseFields: FormField[] = [
  {
    id: "intended-use",
    type: "checkbox",
    label: "What were you hoping to do with our app?",
    options: ["Task A", "Task B", "Task C", "Task D"],
  },
  {
    id: "pain-points",
    type: "checkbox",
    label: "What was confusing or frustrating?",
    options: ["Navigation", "Finding features", "Workflow", "Terminology", "Performance"],
  }
];

// Component props
interface FeedbackFormProps {
  className?: string;
  onSubmit?: (reason: string, data: Record<string, string>) => void;
  reason: string;
  showNextQuestion?: boolean;
  currentQuestionIndex?: number;
  statusMessage?: string;
}

export function FeedbackForm({ 
  className, 
  onSubmit, 
  reason, 
  showNextQuestion = false,
  currentQuestionIndex: propQuestionIndex,
  statusMessage
}: FeedbackFormProps) {
  // Get the thread and contextKey from Tambo
  const { thread } = useTambo();
  const contextKey = thread?.contextKey || "tambo-template";
  
  // Enhanced state with answeredQuestions
  const [state, setState] = useTamboComponentState<FeedbackState>(
    `feedback-form-${reason}`,
    {
      submitted: false,
      formData: {},
      currentQuestionIndex: 0,
      isComplete: false,
      awaitingNextQuestion: false,
      answeredQuestions: []
    }
  );
  
  // Update useEffect to handle both showNextQuestion and direct currentQuestionIndex control
  React.useEffect(() => {
    if (propQuestionIndex !== undefined && state && propQuestionIndex !== state.currentQuestionIndex) {
      // If a specific question index is provided, use it
      setState({
        ...state,
        currentQuestionIndex: propQuestionIndex,
        awaitingNextQuestion: false
      });
    } else if (showNextQuestion && state?.awaitingNextQuestion) {
      // Otherwise use the showNextQuestion prop
      setState({
        ...state,
        awaitingNextQuestion: false
      });
    }
  }, [showNextQuestion, propQuestionIndex, state, setState]);
  
  // Use Tambo thread input for submission
  const { setValue, submit, isPending, error } = useTamboThreadInput(contextKey);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  // Get fields based on selected reason
  const getFieldsForReason = (reason: string): FormField[] => {
    switch(reason) {
      case "too-expensive": return tooExpensiveFields;
      case "missing-features": return missingFeaturesFields;
      case "bugs-reliability": return bugsReliabilityFields;
      case "switching-tools": return switchingToolsFields;
      case "no-longer-needed": return noLongerNeededFields;
      case "poor-support": return poorSupportFields;
      case "hard-to-use": return hardToUseFields;
      default: return [];
    }
  };

  const allFields = getFieldsForReason(reason);
  
  // Handle individual question submission
  const handleQuestionSubmit = async (data: Record<string, string>) => {
    try {
      // Update form data with the new field data
      const updatedFormData = {
        ...state?.formData,
        ...data
      };
      
      const isLastQuestion = (state?.currentQuestionIndex || 0) >= allFields.length - 1;
      const currentIndex = state?.currentQuestionIndex || 0;
      
      if (isLastQuestion) {
        // For the last question, only submit the complete feedback
        setState({
          ...state,
          formData: updatedFormData,
          isComplete: true,
          submitted: false,
          currentQuestionIndex: currentIndex,
          awaitingNextQuestion: false,
          answeredQuestions: [...(state?.answeredQuestions || []), currentIndex]
        });
        
        // Submit full feedback
        const fullMessage = `Feedback submission: ${reason}\n${JSON.stringify(updatedFormData, null, 2)}`;
        setValue(fullMessage);
        await submit({
          contextKey,
          streamResponse: true,
        });
        setValue("");
        
        // Mark as successfully submitted
        setState({
          formData: updatedFormData,
          isComplete: true,
          submitted: true,
          currentQuestionIndex: currentIndex,
          awaitingNextQuestion: false,
          answeredQuestions: [...(state?.answeredQuestions || []), currentIndex]
        });
        
        if (onSubmit) {
          onSubmit(reason, updatedFormData);
        }
      } else {
        // For non-last questions, submit individual answer
        // Prepare a message for this specific answer
        const fieldId = Object.keys(data)[0];
        const fieldValue = data[fieldId];
        const currentField = allFields[currentIndex];
        const message = `Feedback submission: "${currentField.label}": ${fieldValue}`;
        
        // Send the answer to the thread
        setValue(message);
        await submit({
          contextKey,
          streamResponse: true,
        });
        setValue("");
        
        // Update state for next question and mark this question as answered
        setState({
          ...state,
          formData: updatedFormData,
          awaitingNextQuestion: true,
          currentQuestionIndex: currentIndex + 1,
          submitted: false,
          isComplete: false,
          answeredQuestions: [...(state?.answeredQuestions || []), currentIndex]
        });
      }
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Failed to send feedback. Please try again."
      );
    }
  };

  if (!state) return null;

  // Show error message if there's a submission error
  if (submitError || error) {
    return (
      <div className={className}>
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 mb-4">
          <p className="text-sm text-destructive">
            {submitError || (error instanceof Error ? error.message : "An error occurred")}
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
      {state.answeredQuestions.map((index) => {
        const field = allFields[index];
        const value = state.formData[field.id];
        
        return (
          <div key={field.id} className="p-4 rounded-lg bg-muted/50 border border-border mb-4">
            <div className="flex flex-col">
              <span className="text-sm font-medium">{field.label}</span>
              <span className="text-sm text-muted-foreground">{value}</span>
            </div>
          </div>
        );
      })}
      
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