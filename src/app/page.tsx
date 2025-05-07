import Image from "next/image";

const KeyFilesSection = () => (
  <div className="bg-white px-8 py-4">
    <h2 className="text-xl font-semibold mb-4">How it works:</h2>
    <ul className="space-y-4 text-gray-600">
      <li className="flex items-start gap-2">
        <span>📄</span>
        <span>
          <code className="font-medium">src/layout.tsx</code> - Main layout with
          TamboProvider
        </span>
      </li>
      <li className="flex items-start gap-2">
        <span>📄</span>
        <span>
          <code className="font-medium font-mono">/chat/page.tsx</code> - Chat
          page
        </span>
      </li>
      <li className="flex items-start gap-2">
        <span>📄</span>
        <span>
          <code className="font-medium font-mono">
            /components/ui/message-thread-full.tsx
          </code>{" "}
          - Chat UI
        </span>
      </li>

      <li className="flex items-start gap-2">
        <span>📄</span>
        <span>
          <code className="font-medium font-mono">/components/ui/form.tsx</code>{" "}
          - A generative form component
        </span>
      </li>
      <li className="flex items-start gap-2">
        <span>📄</span>
        <span>
          <code className="font-medium font-mono">
            /components/FeedbackForms.tsx
          </code>{" "}
          - Dynamic feedback form component
        </span>
      </li>
      <li className="flex items-start gap-2">
        <span className="text-blue-500">📄</span>
        <span>
          <code className="font-medium font-mono">
            /components/CancellationReasonForm.tsx
          </code>{" "}
          - Initial cancellation reason form
        </span>
      </li>
      <li className="flex items-start gap-2">
        <span className="text-blue-500">📄</span>
        <span>
          <code className="font-medium font-mono">tambo.ts</code> - Component
          and tool registration
        </span>
      </li>
      <li className="flex items-start gap-2">
        <span className="text-blue-500">📄</span>
        <span>
          <code className="font-medium font-mono">README.md</code> - For more
          details check out the README
        </span>
      </li>
    </ul>
    <div className="flex gap-4 flex-wrap mt-4">
      <a
        href="https://tambo.co/docs"
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-3 rounded-md font-medium transition-colors text-lg mt-4 border border-gray-300 hover:bg-gray-50"
      >
        View Docs
      </a>
      <a
        href="https://tambo.co/dashboard"
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-3 rounded-md font-medium transition-colors text-lg mt-4 border border-gray-300 hover:bg-gray-50"
      >
        Dashboard
      </a>
    </div>
  </div>
);

export default function Home() {
  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-2xl w-full space-y-8">
        <div className="flex flex-col items-center">
          <a href="https://tambo.co" target="_blank" rel="noopener noreferrer">
            <Image
              src="/Octo-Icon.svg"
              alt="Tambo AI Logo"
              width={80}
              height={80}
              className="mb-4"
            />
          </a>
          <h1 className="text-4xl text-center">
            Tambo AI Conversational Form Template
          </h1>
        </div>

        <div className="w-full space-y-8">
          <div className="flex gap-4 flex-wrap">
            <a
              href="/chat"
              className="px-6 py-3 rounded-md font-medium shadow-sm transition-colors text-lg mt-4 bg-[#7FFFC3] hover:bg-[#72e6b0] text-gray-800"
            >
              Go to Chat →
            </a>
          </div>
        </div>

        <KeyFilesSection />
      </main>
    </div>
  );
}
