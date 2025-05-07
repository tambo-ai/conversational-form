import { useTamboThreadInput } from "@tambo-ai/react";
import { useState } from "react";

export const WelcomeCard = () => {
  const [selectedReason, setSelectedReason] = useState("");
  const { setValue } = useTamboThreadInput("tambo-template");

  const handleReasonSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const reason = e.target.value;
    setSelectedReason(reason);
  };

  const elaborations: Record<string, string> = {
    "Too expensive": "I'm cancelling because the product is too expensive for my budget.",
    "Missing features": "I'm cancelling because the product is missing critical features I need.",
    "Bugs or reliability issues": "I'm cancelling due to bugs and reliability problems I've experienced.",
    "Switching to another tool": "I'm cancelling because I'm switching to a different solution.",
    "No longer needed": "I'm cancelling because I no longer need this product.",
    "Poor support": "I'm cancelling because the customer support wasn't helpful.",
    "Hard to use": "I'm cancelling because the product was difficult to use.",
    "Other": "I'm cancelling for another reason."
  };

  const getElaboratedReason = (reason: string): string => {
    return elaborations[reason] || reason;
  };

  const handleSubmit = () => {
    if (selectedReason) {
      // Trigger the next step with elaborated message
      const elaboratedMessage = getElaboratedReason(selectedReason);
      setValue(elaboratedMessage);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-xl w-full mb-8">
      <h2 className="text-xl font-bold mb-4">We're sorry to see you go</h2>
      <p className="mb-4">
        Please help us understand why you're cancelling so we can improve our product.
      </p>
      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
        <p className="text-gray-600 text-sm mb-2">What's your primary reason for cancelling?</p>
        <select 
          value={selectedReason}
          onChange={handleReasonSelect}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        >
          <option value="" disabled>Select a reason</option>
          {Object.keys(elaborations).map((reason) => (
            <option key={reason} value={reason}>{reason}</option>
          ))}
        </select>
        <button
          onClick={() => {
            handleSubmit();
            setSelectedReason("");
          }}
          disabled={!selectedReason}
          className="w-full px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
};