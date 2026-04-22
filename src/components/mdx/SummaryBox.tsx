import type { ReactNode } from "react";

interface SummaryBoxProps {
  children: ReactNode;
}

export default function SummaryBox({ children }: SummaryBoxProps) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.08) 100%)",
        border: "1px solid rgba(99,102,241,0.2)",
        borderRadius: "16px",
        padding: "2rem",
        margin: "2rem 0",
      }}
    >
      <div className="prose dark:prose-invert max-w-none">{children}</div>
    </div>
  );
}
