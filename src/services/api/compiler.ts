import type { CompilationResult, CompilerInput } from "@/types";

export async function compileContract({
  contractName,
  sourceCode,
}: CompilerInput): Promise<CompilationResult> {
  try {
    const response = await fetch("/api/compile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contractName,
        sourceCode,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        errors: [
          errorData.errors?.[0] ||
            `HTTP ${response.status}: ${response.statusText}`,
        ],
      };
    }

    const result: CompilationResult = await response.json();
    return result;
  } catch (error) {
    return {
      success: false,
      errors: [
        `Network error: ${error instanceof Error ? error.message : "Unknown error"}`,
      ],
    };
  }
}
