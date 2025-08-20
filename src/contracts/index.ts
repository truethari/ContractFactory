import { contractCode as ERC20Code } from "./ERC20";
import { contractCode as ERC721Code } from "./ERC721";

interface IContractDefinition {
  name: string;
  description: string;
  category: string;
  code: string;
  inputs: Array<{ name: string; type: string; replaceWith: string }>;
}

export const AVAILABLE_CONTRACTS: IContractDefinition[] = [
  {
    name: "ERC20",
    description:
      "Advanced ERC20 Token with burning, minting controls, and security features",
    category: "ERC20",
    code: ERC20Code,
    inputs: [
      { name: "Contract Name", type: "string", replaceWith: "CONTRACT_NAME" },
      { name: "Token Symbol", type: "string", replaceWith: "TOKEN_SYMBOL" },
      { name: "Decimals", type: "uint8", replaceWith: "DECIMALS" },
      { name: "Max Supply", type: "uint256", replaceWith: "MAX_SUPPLY" },
      {
        name: "Initial Supply",
        type: "uint256",
        replaceWith: "INITIAL_SUPPLY",
      },
    ],
  },
  {
    name: "ERC721",
    description:
      "Advanced ERC721 NFT with minting controls, whitelist, and security features",
    code: ERC721Code,
    category: "ERC721",
    inputs: [
      { name: "Contract Name", type: "string", replaceWith: "CONTRACT_NAME" },
      { name: "Token Symbol", type: "string", replaceWith: "TOKEN_SYMBOL" },
      { name: "Max Supply", type: "uint256", replaceWith: "MAX_SUPPLY_" },
      { name: "Mint Price (ETH)", type: "string", replaceWith: "MINT_PRICE" },
      {
        name: "Max Mint Per Wallet",
        type: "uint256",
        replaceWith: "MAX_MINT_PER_WALLET",
      },
      { name: "Base URI", type: "string", replaceWith: "BASE_URI" },
      {
        name: "Public Mint Enabled",
        type: "boolean",
        replaceWith: "PUBLIC_MINT_ENABLED",
      },
    ],
  },
];
