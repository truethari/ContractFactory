import { contractCode as ERC20Code } from "./ERC20";
import { contractCode as ERC721Code } from "./ERC721";

interface IContractDefinition {
  name: string;
  description: string;
  code: string;
  inputs: Array<{ name: string; type: string; replaceWith: string }>;
}

export const AVAILABLE_CONTRACTS: IContractDefinition[] = [
  {
    name: "ERC20",
    description: "ERC20 Token Standard Implementation",
    code: ERC20Code,
    inputs: [
      { name: "Name", type: "string", replaceWith: "CONTRACT_NAME" },
      { name: "Symbol", type: "string", replaceWith: "TOKEN_SYMBOL" },
      { name: "Decimals", type: "uint8", replaceWith: "DECIMALS" },
    ],
  },
  {
    name: "ERC721",
    description: "ERC721 Non-Fungible Token Standard Implementation",
    code: ERC721Code,
    inputs: [
      { name: "Name", type: "string", replaceWith: "CONTRACT_NAME" },
      { name: "Symbol", type: "string", replaceWith: "TOKEN_SYMBOL" },
      { name: "Max Supply", type: "uint256", replaceWith: "MAX_SUPPLY_" },
    ],
  },
];
