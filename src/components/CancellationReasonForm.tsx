import { cn } from "@/lib/utils";
import { useTamboThreadInput } from "@tambo-ai/react";
import { useState } from "react";

/**
 * Form component that allows users to select a reason for cancellation
 * and submit it to the Tambo thread. On selection, it sends an elaborated
 * message based on the selected reason.
 *
 * @component
 * @returns {React.ReactNode} A form with buttons for cancellation reasons
 *
 * @example
 * <CancellationReasonForm />
 */
export const CancellationReasonForm = () => {
  const [selectedReason, setSelectedReason] = useState("");
  const { setValue } = useTamboThreadInput("tambo-template");

  /**
   * Handles the selection of a cancellation reason from the buttons
   * and immediately submits the elaborated message to the Tambo thread
   *
   * @param {string} reason - The selected cancellation reason
   */
  const handleReasonSelect = (reason: string) => {
    setSelectedReason(reason);

    if (reason) {
      // Immediately trigger the next step with elaborated message
      const elaboratedMessage = getElaboratedReason(reason);
      setValue(elaboratedMessage);
    }
  };

  /**
   * Predefined elaboration messages for each cancellation reason
   * These provide more context when submitted to the Tambo thread
   *
   * @type {Record<string, string>}
   */
  const elaborations: Record<string, string> = {
    "Too expensive":
      "I'm cancelling because the product is too expensive for my budget.",
    "Missing features":
      "I'm cancelling because the product is missing critical features I need.",
    "Bugs or reliability issues":
      "I'm cancelling due to bugs and reliability problems I've experienced.",
    "Switching to another tool":
      "I'm cancelling because I'm switching to a different solution.",
    "No longer needed": "I'm cancelling because I no longer need this product.",
    "Poor support":
      "I'm cancelling because the customer support wasn't helpful.",
    "Hard to use": "I'm cancelling because the product was difficult to use.",
    Other: "I'm cancelling for another reason.",
  };

  /**
   * Retrieves the elaborated message for a given cancellation reason
   *
   * @param {string} reason - The selected cancellation reason
   * @returns {string} The elaborated message for the selected reason
   */
  const getElaboratedReason = (reason: string): string => {
    return elaborations[reason] || reason;
  };

  return (
    <div className="bg-background rounded-lg shadow-md p-6 w-full max-w-xs mb-8">
      <h2 className="text-xl font-bold mb-4">Why are you leaving?</h2>
      <div className="flex flex-col gap-2 mb-4">
        {Object.keys(elaborations).map((reason) => (
          <button
            key={reason}
            onClick={() => handleReasonSelect(reason)}
            className={cn(
              "py-2 px-2.5 rounded-2xl text-xs transition-colors",
              "border border-flat",
              selectedReason === reason
                ? "bg-accent text-accent-foreground"
                : "bg-background hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <span className="font-medium">{reason}</span>
          </button>
        ))}
      </div>
      <p className="text-muted-foreground text-sm">
        You can always just respond below.
      </p>
    </div>
  );
};
