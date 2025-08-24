# Contract Factory

A modern, open-source platform for building, compiling, and deploying Solidity smart contracts with professional-grade tools. No coding required, zero fees, maximum security.

![Contract Factory](https://img.shields.io/badge/status-active-brightgreen) ![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4)

## ✨ Features

- **🔥 Smart Contract Compilation** - Compile Solidity contracts with OpenZeppelin libraries using our secure API
- **⚡ One-Click Deployment** - Deploy to Hyperliquid network directly from your wallet
- **🛡️ Secure & Trusted** - No private keys stored. All deployments happen directly from your wallet
- **🚀 Open Source & Free** - Built with transparency in mind. Use our tools without any fees

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Web3 wallet (MetaMask, WalletConnect)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/truethari/ContractFactory.git
   cd ContractFactory
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5001`

## 🏗️ Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run formatting and linting

### Project Structure

```
src/
├── app/                    # Next.js app router
├── components/
│   ├── dashboard/         # Dashboard components
│   ├── home/              # Landing page components
│   ├── providers/         # React context providers
│   └── ui/                # Reusable UI components
├── contracts/             # Contract templates and configurations
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── services/              # API and blockchain services
├── types/                 # TypeScript type definitions
└── utils/                 # Helper utilities
```

## 🔗 Wallet Integration

Contract Factory supports multiple wallet providers:

- **MetaMask** - Browser extension wallet
- **WalletConnect** - Connect with 300+ wallets
- **Injected Wallets** - Any injected Ethereum provider

## 🛠️ Built With

- **[Next.js 15](https://nextjs.org/)** - React framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[Ethers.js](https://ethers.org/)** - Ethereum library
- **[OpenZeppelin](https://openzeppelin.com/)** - Secure smart contract library
- **[Radix UI](https://www.radix-ui.com/)** - Accessible UI components
- **[TanStack Query](https://tanstack.com/query)** - Data fetching
- **[Reown AppKit](https://reown.com/)** - Wallet connection

## 🔒 Security

- All private keys remain in your wallet
- No sensitive data stored on our servers
- Open source code for full transparency
- Regular security audits and updates

## 📞 Support

- **Documentation** - Coming soon
- **Issues** - [GitHub Issues](https://github.com/truethari/ContractFactory/issues)

---

**Built with ❤️ by the Contract Factory team**
