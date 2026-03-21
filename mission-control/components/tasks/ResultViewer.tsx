"use client";

import OutputGateBanner from "@/components/gates/OutputGateBanner";

interface ResultViewerProps {
  result: string;
  resultStatus?: string;
}

export default function ResultViewer({ result, resultStatus }: ResultViewerProps) {
  return (
    <div className="space-y-3">
      <OutputGateBanner resultText={result} />

      {resultStatus && (
        <div className="flex items-center gap-2">
          <span className="text-label">Status:</span>
          <span
            className={`text-xs font-data px-2 py-0.5 rounded ${
              resultStatus === "Completed"
                ? "bg-green-500/20 text-green-400"
                : resultStatus === "Failed"
                ? "bg-red-500/20 text-red-400"
                : "bg-orange-500/20 text-orange-400"
            }`}
          >
            {resultStatus}
          </span>
        </div>
      )}

      <div className="glass p-4 rounded-lg">
        <p className="text-sm font-body text-slate-300 whitespace-pre-wrap">{result}</p>
      </div>
    </div>
  );
}
