"use client";

import {
  MessageInput,
  MessageInputTextarea,
  MessageInputToolbar,
  MessageInputSubmitButton,
  MessageInputError,
} from "@/components/ui/message-input";
import {
  MessageSuggestions,
  MessageSuggestionsStatus,
  MessageSuggestionsList,
} from "@/components/ui/message-suggestions";
import type { messageVariants } from "@/components/ui/message";
import {
  ThreadContent,
  ThreadContentMessages,
} from "@/components/ui/thread-content";
import {
  ThreadContainer,
  useThreadContainerContext,
} from "@/components/ui/thread-container";
import { ScrollableMessageContainer } from "@/components/ui/scrollable-message-container";
import { CancellationReasonForm } from "@/components/CancellationReasonForm";
import { useMergedRef } from "@/lib/thread-hooks"
import { Suggestion, useTambo } from "@tambo-ai/react";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";

/**
 * Props for the MessageThreadFull component
 */
export interface MessageThreadFullProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional context key for the thread */
  contextKey?: string;
  /**
   * Controls the visual styling of messages in the thread.
   * Possible values include: "default", "compact", etc.
   * These values are defined in messageVariants from "@/components/ui/message".
   * @example variant="compact"
   */
  variant?: VariantProps<typeof messageVariants>["variant"];
}

/**
 * A full-screen chat thread component with message history, input, and suggestions
 */
export const MessageThreadFull = React.forwardRef<
  HTMLDivElement,
  MessageThreadFullProps
>(({ className, contextKey, variant, ...props }, ref) => {
  const { containerRef } = useThreadContainerContext();
  const mergedRef = useMergedRef<HTMLDivElement | null>(ref, containerRef);

  // Get MessageThread from Tambo
  const { thread } = useTambo();

  const cancellationSuggestions: Suggestion[] = [
    {
      id: "cancel-suggestion-1",
      title: "Too expensive",
      detailedSuggestion: "I'm cancelling because the product is too expensive for my budget.",
      messageId: "cancellation-reason",
    },
    {
      id: "cancel-suggestion-2",
      title: "Missing features",
      detailedSuggestion: "I'm cancelling because the product is missing critical features I need.",
      messageId: "cancellation-reason",
    },
    {
      id: "cancel-suggestion-3",
      title: "Bugs or reliability issues",
      detailedSuggestion: "I'm cancelling due to bugs and reliability problems I've experienced.",
      messageId: "cancellation-reason",
    }
  ];

  return (
    <>

      <ThreadContainer ref={mergedRef} className={className} {...props}>
        <ScrollableMessageContainer className="p-4">
          {(!thread || thread.messages.length === 0) && (
            <div className="w-full min-w-xl p-4">
              <CancellationReasonForm />
            </div>
          )}
          <ThreadContent variant={variant}>
            <ThreadContentMessages />
          </ThreadContent>
        </ScrollableMessageContainer>

        {/* Message suggestions status */}
        <MessageSuggestions>
          <MessageSuggestionsStatus />
        </MessageSuggestions>

        {/* Message input */}
        <div className="p-4">
          <MessageInput contextKey={contextKey}>
            <MessageInputTextarea />
            <MessageInputToolbar>
              <MessageInputSubmitButton />
            </MessageInputToolbar>
            <MessageInputError />
          </MessageInput>
        </div>

        {/* Message suggestions */}
        <MessageSuggestions initialSuggestions={cancellationSuggestions}>
          <MessageSuggestionsList />
        </MessageSuggestions>
      </ThreadContainer>
    </>
  );
});
MessageThreadFull.displayName = "MessageThreadFull";
