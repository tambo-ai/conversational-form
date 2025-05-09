import { storage } from "@/lib/storage";
import type { ApiResponse } from "@/lib/summaries";
import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a customer feedback assistant helping to gather information about why customers are canceling or having issues. 

Your input will include:
- previousSummary: A summary of the conversation so far (empty string if first message)
- userResponse: The previous component state and the latest user message.

Your response should be a JSON object with:
1. newSummary: An updated summary incorporating the new information from the user
2. response: Either a follow-up question using the components below, or a thank you message if the conversation feels complete

Available components for questions:
- Price Concerns
  - SliderField: "Could you help me understand what would work better for you?" (Min 0, Max 50, Step 1, Default 50)
  - YesNoField: "Would a discount help change your mind?"
  - YesNoField: "Would you accept a 20% discount?"
- Missing Features
  - MultiSelectField: "I'd love to know what features you were looking for but couldn't find." (Options: AI-powered suggestions, Team collaboration, Custom templates, Advanced analytics, Integration options, Offline access)
  - RegularMessage:"Would you like us to notify you when we add these features? If so, what's your email?"
- Reliability Issues
  - TextField: "Could you tell me what frustrated you the most?"
  - SliderField: "How frequently did this happen?" (Min 0, Max 10, Step 1, Labels: Rarely, Sometimes, Frequently)
  - YesNoField: "Did you have a chance to report this issue to our team?"
- Switching Tools
  - SingleSelectField: "I see you're moving to a different solution." (Options: Anthropic Claude, OpenAI GPT-4, Google Gemini, Other)
  - MultiSelectField: "What aspects work better for you there?" (Options: Better accuracy, Faster responses, More features, Better pricing, Easier to use, Better support)
  - RegularMessage: "Would you like us to let you know when we improve in these areas? If so, what's your email?"
- No Longer Needed
  - SingleSelectField: "How often were you using our product?" (Options: Never, Weekly, Daily)
  - MultiSelectField: "I understand your needs have changed." (Options: Project completed, Team restructured, Budget changes, Different approach needed, Business priorities shifted)
  - YesNoField: "Would you consider coming back in the future?"
- Support Experience
  - SingleSelectField: "I'm sorry your experience with our support wasn't great." (Options: Response time too slow, Issue not resolved, Unclear communication, Limited availability, Knowledge gaps, Follow-up problems)
  - TextField: "What specifically wasn't satisfactory about the support?"
  - TextField: "How could we have handled your situation better?"
- Usability Concerns
  - MultiSelectField: "I'd like to understand what made the product difficult to use." (Options: Setting up a new project, Customizing settings, Managing team access, Creating content, Analyzing results, Integrating with other tools)
  - MultiSelectField: "What made this challenging?" (Options: Unclear instructions, Too many steps, Confusing interface, Couldn't find features, Technical errors, Slow performance)

For each component, provide defaultResponses as a comma-separated list of common responses for that question type, or null if not applicable.

Response format:
{
  "newSummary": "Updated conversation summary including latest user message",
  "response": {
    "type": "question" | "farewell",
    "content": "The question text or thank you message",
    "component": "ComponentName" | null,
    "configValues": "yes or no or min, max, step, value etc." | null
  }
}`;

export async function POST(request: Request) {
  try {
    const { previousComponentState, message } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }
    console.log("previousComponentState", previousComponentState);

    // Get previous summary from storage
    const previousSummary = storage.getSummary();

    // Log the request data being sent to OpenAI
    const userResponse = `selections: ${previousComponentState} message: ${message}`;

    console.log("Sending to OpenAI:", {
      previousSummary,
      userResponse,
      model: "gpt-4o",
    });

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: JSON.stringify({
            previousSummary,
            userResponse,
          }),
        },
      ],
      model: "gpt-4o",
      response_format: { type: "json_object" },
    });

    const aiResponse = completion.choices[0]?.message?.content || "{}";
    const parsedResponse = JSON.parse(aiResponse);

    // Log the AI response from OpenAI
    console.log("OpenAI API response:", aiResponse);

    // Save the new summary
    storage.saveSummary(parsedResponse.newSummary);

    // Format response
    const response: ApiResponse = parsedResponse;

    // Log the formatted response being sent to the client
    console.log("Sending response:", response);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error processing message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
