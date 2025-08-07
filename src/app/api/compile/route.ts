import fs from "fs";
import solc from "solc";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

import type { CompilationResult, CompilationRequest } from "@/types";

// OpenZeppelin contract resolver
function findImports(importPath: string): {
  contents?: string;
  error?: string;
} {
  try {
    // Handle OpenZeppelin imports
    if (importPath.startsWith("@openzeppelin/contracts/")) {
      const contractPath = path.join(process.cwd(), "node_modules", importPath);

      if (fs.existsSync(contractPath)) {
        const contents = fs.readFileSync(contractPath, "utf8");
        return { contents };
      }
    }

    return { error: `File not found: ${importPath}` };
  } catch (error) {
    return { error: `Error reading ${importPath}: ${error}` };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { contractName, sourceCode }: CompilationRequest =
      await request.json();

    if (!contractName || !sourceCode) {
      return NextResponse.json(
        { success: false, errors: ["Missing contractName or sourceCode"] },
        { status: 400 },
      );
    }

    const input = {
      language: "Solidity",
      sources: {
        [`${contractName}.sol`]: {
          content: sourceCode,
        },
      },
      settings: {
        outputSelection: {
          "*": {
            "*": ["abi", "evm.bytecode.object", "evm.deployedBytecode.object"],
          },
        },
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    };

    const compilationResult = JSON.parse(
      solc.compile(JSON.stringify(input), { import: findImports }),
    );

    const errors: string[] = [];
    const warnings: string[] = [];

    if (compilationResult.errors) {
      for (const error of compilationResult.errors) {
        if (error.severity === "error") {
          errors.push(error.formattedMessage || error.message);
        } else if (error.severity === "warning") {
          warnings.push(error.formattedMessage || error.message);
        }
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({
        success: false,
        errors,
        warnings,
      });
    }

    const contractOutput =
      compilationResult.contracts[`${contractName}.sol`]?.[contractName];

    if (!contractOutput) {
      return NextResponse.json({
        success: false,
        errors: [`Contract ${contractName} not found in compilation output`],
        warnings,
      });
    }

    const result: CompilationResult = {
      success: true,
      bytecode: contractOutput.evm.bytecode.object,
      abi: contractOutput.abi,
      warnings,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Compilation error:", error);
    return NextResponse.json(
      {
        success: false,
        errors: [
          `Compilation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        ],
      },
      { status: 500 },
    );
  }
}
