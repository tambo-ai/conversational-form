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
    <div className="bg-white rounded-lg shadow-md p-6 max-w-xl w-full mb-8">
      <h2 className="text-xl font-bold mb-4">We&apos;re sorry to see you go</h2>
      <p className="mb-4">
        Please help us understand why you&apos;re cancelling so we can improve
        our product.
      </p>
      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
        <p className="text-gray-600 text-sm mb-2">
          What&apos;s your primary reason for cancelling?
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {Object.keys(elaborations).map((reason) => (
            <button
              key={reason}
              onClick={() => handleReasonSelect(reason)}
              className={`p-2 border rounded text-left ${
                selectedReason === reason
                  ? "bg-blue-100 border-blue-500"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              {reason}
            </button>
          ))}
        </div>
        <p className="text-gray-600 text-sm mt-2">
          If you wish you can elaborate on your reason for cancellation below.
        </p>
      </div>
    </div>
  );
};
