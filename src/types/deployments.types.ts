export enum EDeploymentStatus {
  PENDING = "PENDING",
  COMPILED = "COMPILED",
  DEPLOYED = "DEPLOYED",
  FAILED = "FAILED",
}

export interface ICreateDeploymentPayload {
  name: string;
  category: string;
  description: string;
  sourceCode: string;
}

export interface ICreateDeploymentResponse {
  deployment: {
    id: string;
    name: string;
    category: string;
    description: string;
    sourceCode: string;
    accountId: string;
  };
  compilationResult: {
    success: boolean;
    bytecode: string;
    abi: string;
    warnings: string[];
  };
}

export interface IDeployment {
  id: string;
  name: string;
  description?: string;
  category: string; // ERC20, ERC721, etc.
  address?: string; // null if not deployed
  abi?: string; // null if not compiled
  deployedTx?: string; // null if not deployed
  status: EDeploymentStatus;
  wallet: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDeployUpdatePayload {
  id: string;
  deployedTx: string;
  address: string;
}
