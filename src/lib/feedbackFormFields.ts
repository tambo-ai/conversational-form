import { FormField } from "@/components/ui/form";

/**
 * Form field definitions for the "too expensive" cancellation reason
 * Collects information about fair pricing and discount receptiveness
 * 
 * @type {FormField[]}
 */
export const tooExpensiveFields: FormField[] = [
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

/**
 * Form field definitions for the "missing features" cancellation reason
 * Collects information about which features were expected but missing
 * 
 * @type {FormField[]}
 */
export const missingFeaturesFields: FormField[] = [
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

/**
 * Form field definitions for the "bugs or reliability issues" cancellation reason
 * Collects information about specific bugs, their frequency, and reporting history
 * 
 * @type {FormField[]}
 */
export const bugsReliabilityFields: FormField[] = [
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

/**
 * Form field definitions for the "switching to another tool" cancellation reason
 * Collects information about competitor selection and comparative advantages
 * 
 * @type {FormField[]}
 */
export const switchingToolsFields: FormField[] = [
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

/**
 * Form field definitions for the "no longer needed" cancellation reason
 * Collects information about changed circumstances and potential future use
 * 
 * @type {FormField[]}
 */
export const noLongerNeededFields: FormField[] = [
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

/**
 * Form field definitions for the "poor support" cancellation reason
 * Collects information about specific support issues and pain points
 * 
 * @type {FormField[]}
 */
export const poorSupportFields: FormField[] = [
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

/**
 * Form field definitions for the "hard to use" cancellation reason
 * Collects information about usability issues and intended usage
 * 
 * @type {FormField[]}
 */
export const hardToUseFields: FormField[] = [
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

/**
 * Returns the appropriate form fields array based on the cancellation reason
 * 
 * @param {string} reason - The reason for cancellation (e.g., "too-expensive", "missing-features")
 * @returns {FormField[]} Array of form fields for the specified reason, or empty array if reason is invalid
 * 
 * @example
 * // Get fields for the "too-expensive" reason
 * const fields = getFieldsForReason("too-expensive");
 * 
 * @example
 * // Get fields based on a dynamically determined reason
 * const reason = userSelectedReason;
 * const fields = getFieldsForReason(reason);
 */
export function getFieldsForReason(reason: string): FormField[] {
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
} 