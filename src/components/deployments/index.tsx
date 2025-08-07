"use client";

import { useState, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";

import { AVAILABLE_CONTRACTS } from "@/contracts";

export default function Deployments() {
  const [selectedContract, setSelectedContract] = useState<string>("");
  const [contractInputs, setContractInputs] = useState<Record<string, string>>(
    {},
  );

  const currentContract = useMemo(() => {
    return AVAILABLE_CONTRACTS.find(
      (contract) => contract.name === selectedContract,
    );
  }, [selectedContract]);

  const handleInputChange = (inputName: string, value: string) => {
    setContractInputs((prev) => ({
      ...prev,
      [inputName]: value,
    }));
  };

  const handleContractChange = (contractName: string) => {
    setSelectedContract(contractName);
    setContractInputs({});
  };

  const getPreviewCode = () => {
    if (!currentContract) return "";

    let code = currentContract.code;

    try {
      currentContract.inputs.forEach((input) => {
        const value = contractInputs[input.name] || input.replaceWith;
        code = code.replaceAll(input.replaceWith, value);
      });
    } catch (error) {
      console.error("Error generating preview:", error);
    }

    return code;
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Contract Deployment</h1>
          <p className="mt-2 text-gray-400">
            Select a contract template and configure its parameters
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="border-gray-800 bg-gray-900">
            <CardHeader>
              <CardTitle className="text-white">
                Contract Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="contract-select" className="text-gray-300">
                  Select Contract Type
                </Label>
                <Select onValueChange={handleContractChange}>
                  <SelectTrigger className="border-gray-700 bg-gray-800 text-white">
                    <SelectValue placeholder="Choose a contract template" />
                  </SelectTrigger>
                  <SelectContent className="border-gray-700 bg-gray-800">
                    {AVAILABLE_CONTRACTS.map((contract) => (
                      <SelectItem
                        key={contract.name}
                        value={contract.name}
                        className="text-white focus:bg-gray-700"
                      >
                        <div className="font-medium">{contract.name}</div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {currentContract && (
                <div className="space-y-4">
                  <div className="border-t border-gray-700 pt-4">
                    <h3 className="mb-4 text-lg font-semibold text-white">
                      Contract Parameters
                    </h3>
                    <div className="space-y-4">
                      {currentContract.inputs.map((input) => (
                        <div key={input.name} className="space-y-2">
                          <Label htmlFor={input.name} className="text-gray-300">
                            {input.name}{" "}
                            <span className="text-sm text-gray-500">
                              ({input.type})
                            </span>
                          </Label>
                          <Input
                            id={input.name}
                            type={
                              input.type === "uint256" || input.type === "uint8"
                                ? "number"
                                : "text"
                            }
                            placeholder={`Enter ${input.name.toLowerCase()}`}
                            value={contractInputs[input.name] || ""}
                            onChange={(e) =>
                              handleInputChange(input.name, e.target.value)
                            }
                            className="border-gray-700 bg-gray-800 text-white placeholder:text-gray-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-4">
                    <Button
                      className="w-full bg-blue-600 text-white hover:bg-blue-700"
                      disabled={
                        !currentContract ||
                        currentContract.inputs.some(
                          (input) => !contractInputs[input.name],
                        )
                      }
                    >
                      Compile & Deploy Contract
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gray-900">
            <CardHeader>
              <CardTitle className="text-white">Contract Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {currentContract ? (
                <div className="rounded-lg bg-gray-950 p-4">
                  <pre className="max-h-96 overflow-auto text-sm text-gray-300">
                    <code>{getPreviewCode()}</code>
                  </pre>
                </div>
              ) : (
                <div className="flex h-64 items-center justify-center rounded-lg bg-gray-950">
                  <p className="text-gray-500">
                    Select a contract to see the preview
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
