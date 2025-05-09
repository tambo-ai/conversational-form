"use client";

import { CancellationReasonForm } from "@/components/CancellationReasonForm";
import type { messageVariants } from "@/components/ui/message";
import {
  MessageInput,
  MessageInputError,
  MessageInputSubmitButton,
  MessageInputTextarea,
  MessageInputToolbar,
} from "@/components/ui/message-input";
import {
  MessageSuggestions,
  MessageSuggestionsStatus,
} from "@/components/ui/message-suggestions";
import { ScrollableMessageContainer } from "@/components/ui/scrollable-message-container";
import {
  ThreadContainer,
  useThreadContainerContext,
} from "@/components/ui/thread-container";
import {
  ThreadContent,
  ThreadContentMessages,
} from "@/components/ui/thread-content";
import { useMergedRef } from "@/lib/thread-hooks";
import { useTambo } from "@tambo-ai/react";
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
            <MessageInputTextarea placeholder="Respond to the question here..." />
            <MessageInputToolbar>
              <MessageInputSubmitButton />
            </MessageInputToolbar>
            <MessageInputError />
          </MessageInput>
        </div>
      </ThreadContainer>
    </>
  );
});
MessageThreadFull.displayName = "MessageThreadFull";
