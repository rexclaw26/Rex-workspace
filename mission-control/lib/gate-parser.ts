// lib/gate-parser.ts
// Parses Rex's LAW gate output text into structured data for the OutputGateBanner

export interface GateResult {
  law: number;
  name: string;
  passed: boolean;
}

export interface GateParseResult {
  gates: GateResult[];
  allPassed: boolean;
  anyFailed: boolean;
  hasMissing: boolean;
}

const EXPECTED_LAWS = [
  { law: 1, name: "Humanization" },
  { law: 4, name: "Injection" },
  { law: 5, name: "Sources" },
  { law: 6, name: "Approval" },
];

/**
 * Parses Rex's gate output format:
 * LAW 1 │ Humanization: ✅ PASS
 * LAW 4 │ Injection: ❌ FAIL
 */
export function parseGateOutput(rawText: string | undefined | null): GateParseResult {
  if (!rawText) {
    return {
      gates: EXPECTED_LAWS.map((l) => ({ ...l, passed: false })),
      allPassed: false,
      anyFailed: true,
      hasMissing: true,
    };
  }

  const regex = /LAW (\d+) │ (.+?): (✅ PASS|❌ FAIL)/g;
  const parsed: GateResult[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(rawText)) !== null) {
    parsed.push({
      law: parseInt(match[1], 10),
      name: match[2].trim(),
      passed: match[3] === "✅ PASS",
    });
  }

  // Fill in missing laws
  const gates: GateResult[] = EXPECTED_LAWS.map((expected) => {
    const found = parsed.find((p) => p.law === expected.law);
    if (found) return found;
    return { ...expected, passed: false };
  });

  const hasMissing = parsed.length < EXPECTED_LAWS.length;
  const allPassed = gates.every((g) => g.passed);
  const anyFailed = gates.some((g) => !g.passed);

  return { gates, allPassed, anyFailed, hasMissing };
}

/**
 * Extracts gate output section from a full result string.
 * Looks for lines starting with "LAW" and containing "│".
 */
export function extractGateSection(fullResult: string): string {
  const lines = fullResult.split("\n");
  const gateLines = lines.filter(
    (line) => line.trim().startsWith("LAW") && line.includes("│")
  );
  return gateLines.join("\n");
}
