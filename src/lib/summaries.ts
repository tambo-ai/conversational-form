import { z } from "zod";

export const messageResponseSchema = z.object({
  type: z.enum(["question", "farewell"]),
  content: z.string(),
  component: z.string().nullable(),
  configValues: z.string().nullable(),
});

export const apiResponseSchema = z.object({
  newSummary: z.string(),
  response: messageResponseSchema,
});

export const getSummarySchema = z
  .function()
  .args(
    z
      .object({
        previousComponentState: z
          .string()
          .describe("The previous AI generatedcomponent state."),
        message: z.string().describe("The user's message."),
      })
      .describe("Always")
  )
  .returns(apiResponseSchema);

export type MessageResponse = z.infer<typeof messageResponseSchema>;
export type ApiResponse = z.infer<typeof apiResponseSchema>;

export async function sendMessage(
  previousComponentState: string,
  message: string
): Promise<ApiResponse> {
  if (!message?.trim()) {
    throw new Error("Message cannot be empty");
  }

  const response = await fetch("/api/message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ previousComponentState, message }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return apiResponseSchema.parse(data);
}
