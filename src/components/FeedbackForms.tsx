"use client";

import React from "react";
import { FormComponent, FormField } from "@/components/ui/form";
import { useTamboComponentState, useTambo, useTamboThreadInput } from "@tambo-ai/react";

interface FeedbackState {
  submitted: boolean;
  formData: Record<string, string>;
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
}

export function FeedbackForm({ className, onSubmit, reason }: FeedbackFormProps) {
  // Get the thread and contextKey from Tambo
  const { thread } = useTambo();
  const contextKey = thread?.contextKey || "tambo-template";
  
  // Use Tambo component state - simpler now without reason management
  const [state, setState] = useTamboComponentState<FeedbackState>(
    `feedback-form-${reason}`,
    {
      submitted: false,
      formData: {}
    }
  );
  
  // Use Tambo thread input for submission
  const { setValue, submit, isPending, error } = useTamboThreadInput(contextKey);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  // Handle form submission with Tambo thread
  const handleFormSubmit = async (data: Record<string, string>) => {
    try {
      // Update local state
      const updatedState = {
        ...state,
        formData: data
      };
      setState(updatedState as FeedbackState);
      
      // Prepare message for submission
      const message = `Feedback submission: ${reason}\n${JSON.stringify(data, null, 2)}`;
      setValue(message);
      
      // Submit to Tambo thread
      await submit({
        contextKey,
        streamResponse: true,
      });
      
      // Clear the input after successful submission
      setValue("");
      
      // Mark as successfully submitted
      setState({
        ...updatedState,
        submitted: true
      });
      
      // Call the onSubmit callback if provided
      if (onSubmit) {
        onSubmit(reason, data);
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

  // If the form has been submitted, show a summary of what was submitted
  if (state.submitted) {
    return (
      <div className={className}>
        <div className="p-4 rounded-lg bg-muted/50 border border-border mb-4">
          <h3 className="text-lg font-medium mb-3">Your feedback summary:</h3>
          <div className="space-y-2">
            {Object.entries(state.formData).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <span className="text-sm font-medium">{key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                <span className="text-sm text-muted-foreground">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show the form based on the reason provided
  return (
    <div className={className}>
      <FormComponent
        fields={getFieldsForReason(reason)}
        onSubmit={handleFormSubmit}
        variant="solid"
        submitText={isPending ? "Submitting..." : "Submit Feedback"}
        _tambo_displayMessage={isPending}
        _tambo_statusMessage="Sending your feedback..."
      />
    </div>
  );
} 