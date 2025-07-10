import React from "react";

interface CodeBlockProps {
  children?: React.ReactNode;
  className?: string;
  inline?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  children,
  className,
  inline,
  ...props
}) => {
  const language = className?.replace("language-", "") || "";

  if (inline) {
    return (
      <code
        className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded text-sm font-mono"
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <div className="relative">
      <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 overflow-x-auto">
        <code
          className={`text-sm font-mono text-zinc-300 ${className || ""}`}
          {...props}
        >
          {children}
        </code>
      </pre>
      {language && (
        <div className="absolute top-2 right-2 text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">
          {language}
        </div>
      )}
    </div>
  );
};
