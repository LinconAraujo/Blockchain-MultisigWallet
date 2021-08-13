import "dotenv/config";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-truffle5";
import "@nomiclabs/hardhat-web3";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-ganache";
import "hardhat-deploy";

const { INFURA_API_KEY, MNEMONIC, MATICVIGIL } = process.env;

const accounts = {
  mnemonic:
    MNEMONIC || "test test test test test test test test test test test junk",
  // accountsBalance: "990000000000000000000",
};

const config = {
  solidity: "0.8.3",
  networks: {
    hardhat: {
      inject: false, // optional. If true, it will EXPOSE your mnemonic in your frontend code. Then it would be available as an "in-page browser wallet" / signer which can sign without confirmation.
      accounts,
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${INFURA_API_KEY}`,
      accounts,
      chainId: 42,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      gasPrice: 20000000000,
      gasMultiplier: 2,
    },
    matic: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [
        "5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
        "7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6",
        "47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a",
      ],
      chainId: 80001,
    },
    // mumbai: {
    //   url: `https://rpc-mumbai.maticvigil.com/v1/${MATICVIGIL}`,
    //   accounts,
    //   chainId: 80001,
    //   confirmations: 2,
    //   timeoutBlocks: 200,
    //   skipDryRun: true,
    //   // live: true,
    //   // saveDeployments: true,
    //   // tags: ["staging"],
    //   // gasMultiplier: 2,
    // },
  },
  namedAccounts: {
    deployer: 0,
  },
};

export default config;
