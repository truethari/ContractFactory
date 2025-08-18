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
  status: string;
  wallet: string;
  createdAt: Date;
  updatedAt: Date;
}
