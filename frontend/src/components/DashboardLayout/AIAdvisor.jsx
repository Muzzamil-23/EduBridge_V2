import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import advisorService from "../../supabase/advisorService";
import { OwlAvatar } from "../../components/DashboardLayout/OwlMascot"; // adjust path to where OwlMascot.jsx lives

const INITIAL_MESSAGE = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi! I'm your AI University Advisor. Ask me about universities, programs, admissions, or choosing a degree that fits your goals.",
};

const MarkdownContent = ({ content }) => {
  return (
    <div className="advisor-markdown min-w-0 break-words text-sm leading-6">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-3 mt-5 text-xl font-bold text-[#2E1F4D] first:mt-0">
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2 className="mb-2 mt-5 text-lg font-semibold text-[#2E1F4D] first:mt-0">
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3 className="mb-2 mt-4 text-base font-semibold text-[#2E1F4D] first:mt-0">
              {children}
            </h3>
          ),

          p: ({ children }) => (
            <p className="mb-3 last:mb-0">{children}</p>
          ),

          ul: ({ children }) => (
            <ul className="mb-3 list-disc space-y-1 pl-6 marker:text-[#8B6FD0] last:mb-0">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="mb-3 list-decimal space-y-1 pl-6 marker:text-[#8B6FD0] last:mb-0">
              {children}
            </ol>
          ),

          li: ({ children }) => (
            <li className="pl-1">{children}</li>
          ),

          strong: ({ children }) => (
            <strong className="font-semibold text-[#2E1F4D]">
              {children}
            </strong>
          ),

          em: ({ children }) => (
            <em className="italic">{children}</em>
          ),

          a: ({ href, children }) => {
            const safeHref =
              href &&
              /^(https?:\/\/|mailto:)/i.test(href)
                ? href
                : undefined;

            return (
              <a
                href={safeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-[#6B4FBB] underline underline-offset-2 hover:text-[#4B2F9B]"
              >
                {children}
              </a>
            );
          },

          table: ({ children }) => (
            <div className="my-4 w-full max-w-full overflow-x-auto rounded-lg border border-[#CBB1EF]/60">
              <table className="w-full min-w-[600px] border-collapse text-left text-sm">
                {children}
              </table>
            </div>
          ),

          thead: ({ children }) => (
            <thead className="bg-[#CBB1EF]/30">{children}</thead>
          ),

          tbody: ({ children }) => (
            <tbody className="divide-y divide-[#CBB1EF]/30">
              {children}
            </tbody>
          ),

          tr: ({ children }) => (
            <tr className="even:bg-[#DAF6C0]/25">{children}</tr>
          ),

          th: ({ children }) => (
            <th className="whitespace-nowrap border-b border-[#CBB1EF]/60 px-3 py-2 font-semibold text-[#2E1F4D]">
              {children}
            </th>
          ),

          td: ({ children }) => (
            <td className="border-t border-[#CBB1EF]/30 px-3 py-2 align-top text-gray-700">
              {children}
            </td>
          ),

          blockquote: ({ children }) => (
            <blockquote className="my-3 border-l-4 border-[#CBB1EF] pl-4 text-gray-600">
              {children}
            </blockquote>
          ),

          hr: () => <hr className="my-4 border-[#CBB1EF]/50" />,

          pre: ({ children }) => (
            <pre className="my-3 max-w-full overflow-x-auto rounded-lg bg-[#2E1F4D] p-4 text-sm text-white">
              {children}
            </pre>
          ),

          code: ({ children, className }) => {
            const isCodeBlock = Boolean(className);

            return isCodeBlock ? (
              <code className="font-mono">{children}</code>
            ) : (
              <code className="break-words rounded bg-[#CBB1EF]/25 px-1 py-0.5 font-mono text-[0.9em] text-[#5B3FA6]">
                {children}
              </code>
            );
          },

          img: ({ alt }) => (
            <span className="text-gray-500">
              {alt || "Image omitted"}
            </span>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

// Past messages keep a still owl so only the header owl and the
// thinking / error owls animate.
const STILL_OWL = "shrink-0 [&_.owl-root]:[animation:none]";

const AIAdvisor = () => {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  const handleSend = async (event) => {
    event.preventDefault();

    const message = input.trim();

    if (!message || loading || limitReached) return;

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
    };

    setMessages((previous) => [...previous, userMessage]);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const answer = await advisorService.sendMessage(message);

      setMessages((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: answer,
        },
      ]);
    } catch (err) {
      const errorMessage =
        err.message || "Something went wrong. Please try again.";

      if (
        errorMessage.toLowerCase().includes("daily advisor message limit")
      ) {
        setLimitReached(true);
        setError(
          "You've reached your daily Advisor message limit. Please try again tomorrow."
        );
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Owl mood is derived from existing state, no extra logic needed.
  const owlState = error
    ? limitReached
      ? "sleeping"
      : "error"
    : loading
    ? "thinking"
    : input.trim()
    ? "listening"
    : "idle";

  return (
    <div className="mx-auto mt-4 flex h-[calc(100vh-7rem)] min-h-[400px] max-w-5xl flex-col overflow-hidden rounded-2xl border border-[#CBB1EF]/60 bg-white shadow-sm">
      <header className="flex shrink-0 items-center gap-4 border-b border-[#CBB1EF]/60 bg-gradient-to-r from-[#CBB1EF]/50 to-[#DAF6C0]/50 px-5 py-3 sm:px-6">
        <OwlAvatar state={owlState} size={52} className="shrink-0" />

        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-[#2E1F4D]">
            AI University Advisor
          </h1>

          <p className="mt-0.5 text-sm text-[#5B4A7A]">
            Get guidance on universities, programs, and admissions.
          </p>
        </div>
      </header>

      <div
        className="min-h-0 flex-1 space-y-5 overflow-y-auto bg-[#DAF6C0]/20 p-4 sm:p-6"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.map((message) => {
          const isUser = message.role === "user";

          return (
            <div
              key={message.id}
              className={`flex min-w-0 items-end gap-2 ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              {!isUser && (
                <OwlAvatar state="idle" size={36} className={STILL_OWL} />
              )}

              <div
                className={`min-w-0 max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[85%] ${
                  isUser
                    ? "whitespace-pre-wrap break-words rounded-br-sm bg-[#CBB1EF] text-[#2E1F4D]"
                    : "rounded-bl-sm border border-[#CBB1EF]/60 bg-white text-gray-800"
                }`}
              >
                {isUser ? (
                  <div className="whitespace-pre-wrap break-words text-sm leading-6">
                    {message.content}
                  </div>
                ) : (
                  <MarkdownContent content={message.content} />
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-end justify-start gap-2">
            <OwlAvatar state="thinking" size={36} className="shrink-0" />

            <div className="rounded-2xl rounded-bl-sm border border-[#CBB1EF]/60 bg-white px-4 py-3 text-sm text-[#5B4A7A]">
              Advisor is thinking...
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center gap-2">
            <OwlAvatar
              state={limitReached ? "sleeping" : "error"}
              size={36}
              className="shrink-0"
            />

            <div
              role="alert"
              className="max-w-lg rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="shrink-0 border-t border-[#CBB1EF]/60 bg-white p-4 sm:p-5"
      >
        <div className="flex items-end gap-3">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            placeholder={
              limitReached
                ? "Daily message limit reached"
                : "Ask about universities or admissions..."
            }
            rows={2}
            maxLength={2000}
            disabled={loading || limitReached}
            aria-label="Message to AI Advisor"
            className="max-h-36 min-h-12 min-w-0 flex-1 resize-y rounded-xl border border-[#CBB1EF] px-4 py-3 text-sm outline-none transition focus:border-[#8B6FD0] focus:ring-2 focus:ring-[#CBB1EF]/50 disabled:cursor-not-allowed disabled:bg-gray-100"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading || limitReached}
            className="shrink-0 rounded-xl bg-[#CBB1EF] px-5 py-3 text-sm font-semibold text-[#2E1F4D] transition hover:bg-[#DAF6C0] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>

        <p className="mt-2 text-xs text-[#7A6A99]">
          Press Enter to send, or Shift + Enter for a new line.
        </p>
      </form>
    </div>
  );
};

export default AIAdvisor;