// It helps us to work with es6 feature
// import { Provider } from 'react-redux';
// import { HDWalletProvider } from '@truffle-hdwallet-provider-privkey';
// import { HDWalletProvider } from '@truffle/hdwallet-provider';
const HDWalletProvider =require('@truffle/hdwallet-provider');
require('babel-register');
require('babel-polyfill');

// Inject env veriables to truffle
require('dotenv').config();
const privateKeys= process.env.PRIVATE_KEYS;
const infuraApiKey= process.env.INFURA_API_KEY;

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },

    ropsten:{
      provider: function(){
        return new HDWalletProvider(
          // Private Key
          privateKeys.split(','),
          // URL to an eth node
          `https://ropsten.infura.io/v3/${infuraApiKey}`
        )
      },
      gas: 4000000,
      gasPrice: 25000000000,
      network_id: 3
    }
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: "^0.8.4",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}

// Network: kovan (id: 42)
//   Exchange: 0x0A22b49D21A3dF2C75a3E98C5134515457438D29
//   Migrations: 0x085e130Ff5f8dD0F94d629599128845509A3a4cD
//   Token: 0xC9b3F0D1a977C6748f3Cf3cB6BF6928Eec9c5cdB