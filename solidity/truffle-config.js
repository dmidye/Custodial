var HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();
const mnemonicPhrase = process.env.PRIVATE_KEYS;

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
      gasPrice: 1,
      gas: 6000000
    },
    rinkeby: {
      provider: () => 
         new HDWalletProvider({
          mnemonic: {
            phrase: mnemonicPhrase
          },
          providerOrUrl: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
        }),
          gas: 5000000,
          gasPrice: 5000000000, // 5 gwei
          network_id: 4
    }
  }
};