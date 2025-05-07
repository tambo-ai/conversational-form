# Tambo Conversational Form Template

This is a complete NextJS app with Tambo to demonstrate a conversational feedback/cancellation flow with dynamic forms.

## Get Started

1. Run `npm create-tambo@latest my-tambo-app` for a new project

2. `npm install`

3. `npx tambo init`

- or rename `example.env.local` to `.env.local` and add your tambo API key you can get for free [here](https://tambo.co/dashboard).

4. Run `npm run dev` and go to `localhost:3000` to use the app!

## What This Template Demonstrates

This template showcases a conversational cancellation flow with:

1. An initial cancellation reason form (`CancellationReasonForm.tsx`)
2. Dynamic feedback forms based on the selected reason (`FeedbackForms.tsx`)
3. AI-powered conversation that responds appropriately to user feedback

### Key Components

#### FeedbackForm Component

The `FeedbackForm` component demonstrates how to create an AI-controlled form with:
- Reason-specific form fields
- State management with `useTamboComponentState`
- Thread interaction with `useTamboThreadInput`
- Proper submission handling

```tsx
const components: TamboComponent[] = [
  {
    name: "FeedbackForm",
    description: "A component for collecting detailed cancellation feedback with customized forms based on the reason selected.",
    component: FeedbackForm,
    propsSchema: z.object({
      className: z.string().optional().describe("CSS class name for styling"),
      onSubmit: z.function()
        .args(z.string(), z.record(z.string()))
        .returns(z.void())
        .optional()
        .describe("Callback function triggered when form is submitted"),
      reason: z.enum([
        "too-expensive", 
        "missing-features", 
        // ... other reasons
      ]).optional().describe("The reason for cancellation")
    }),
  },
];
```

## Customizing

### Change what components tambo can control

You can modify the components tambo can use in `src/lib/tambo.ts`:

```tsx
export const components: TamboComponent[] = [
  {
    name: "FeedbackForm",
    description: "A component for collecting detailed cancellation feedback with customized forms based on the reason selected.",
    component: FeedbackForm,
    propsSchema: z.object({
      // Component props schema
    }),
  },
  // Add more components for Tambo to control here!
];
```

You can find more information about the options [here](https://tambo.co/docs/concepts/registering-components)

### Add tools for tambo to use

```tsx
export const tools: TamboTool[] = [
  {
    name: "toolName",
    description: "Description of what the tool does",
    tool: myToolFunction,
    toolSchema: z.function().args(
      z.object({
        // Tool arguments schema
      })
    ),
  },
];
```

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

For more detailed documentation, visit [Tambo's official docs](https://tambo.co/docs).
