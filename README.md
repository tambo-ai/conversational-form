# Tambo Conversational Form Template

This is a complete NextJS app with Tambo to demonstrate a conversational feedback/cancellation flow with dynamic forms.

Cancelling an app is about to get a whole lot more annoying ;)

## Demo Video

![Demo Video](2025-05-09-conversational-form.mp4)

## Get Started

1. Git clone the repo `git clone https://github.com/tambo-ai/conversational-form.git`

2. `npm install`

3. `npm run init`

- or rename `example.env.local` to `.env.local` and add your tambo API key you can get for free [here](https://tambo.co/dashboard).
- you will need your own OpenAI API key for the LLM tool call

4. Run `npm run dev` and go to `localhost:3000` to use the app!

## What This Template Demonstrates

This template showcases a conversational cancellation flow with:

1. An initial cancellation reason form (`CancellationReasonForm.tsx`)
2. Dynamic feedback forms based on the selected reason:

- /ui/form/multi-select.tsx
- /ui/form/single-select.tsx
- /ui/form/slider-field.tsx
- /ui/form/yes-no-field.tsx

3. AI-powered conversation that responds appropriately to user feedback

### Key Components

#### Interactive Components

The `MultiSelectField` and `SingleSelectField` components demonstrate how to create an AI-controlled form with:

- Reason-specific form fields
- State management with `useTamboComponentState`
- Thread interaction with `useTamboThreadInput`
- Proper submission handling

```tsx
const components: TamboComponent[] = [
  {
    name: "MultiSelectField",
    description:
      "A group of checkboxes that allows selecting multiple options from a list. Used for gathering multiple responses.",
    component: MultiSelect,
    propsSchema: multiSelectSchema,
  },
  {
    name: "SingleSelectField",
    description:
      "A dropdown or radio group that allows selecting one option from a list. Used for single-choice questions.",
    component: SingleSelect,
    propsSchema: singleSelectSchema,
  },
  // continued.
];
```

see [src/lib/tambo.ts](src/lib/tambo.ts) for more examples.

You can find more information about the options [here](https://tambo.co/docs/concepts/registering-components)

### Add tools for tambo to use

We call a simple LLM tool here:

```tsx
export const tools: TamboTool[] = [
  {
    name: "CancelationAgentTool",
    description:
      "This tool is used to get the next action from the cancelation agent. Always call this tool with the users latest message and the state of previous component (if any).",
    tool: async ({
      previousComponentState,
      message,
    }: {
      previousComponentState: string;
      message: string;
    }) => {
      return sendMessage(previousComponentState, message);
    },
    toolSchema: getSummarySchema,
  },
  // Add tools here
];
```

see [src/lib/summaries.ts](src/lib/summaries.ts) for fetch/zod schema.

see [src/app/api/message/route.ts](src/app/api/message/route.ts) for the api route that is called when the tool is used.

> replace this with your own LLM framework of choice.

see [src/lib/tambo.ts](src/lib/tambo.ts) for more examples.

Find more information about tools [here.](https://tambo.co/docs/concepts/tools)

### The Magic of Tambo Requires the TamboProvider

Make sure in the TamboProvider wrapped around your app:

```tsx
...
<TamboProvider
  apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
  components={components} // Array of components to control
  tools={tools} // Array of tools it can use
>
  {children}
</TamboProvider>
```

In this example we do this in the `Layout.tsx` file, but you can do it anywhere in your app that is a client component.

### Change where component responses are shown

The components used by tambo are shown alongside the message resopnse from tambo within the chat thread, but you can have the result components show wherever you like by accessing the latest thread message's `renderedComponent` field:

```tsx
const { thread } = useTambo();
const latestComponent =
  thread?.messages[thread.messages.length - 1]?.renderedComponent;

return (
  <div>
    {latestComponent && (
      <div className="my-custom-wrapper">{latestComponent}</div>
    )}
  </div>
);
```

see [src/app/page.tsx](src/app/page.tsx) for more examples.

For more detailed documentation, visit [Tambo's official docs](https://tambo.co/docs).
