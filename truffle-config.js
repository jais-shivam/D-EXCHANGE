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

    kovan:{
      provider: function(){
        return new HDWalletProvider(
          // Private Key
          privateKeys.split(','),
          // URL to an eth node
          `https://kovan.infura.io/v3/${infuraApiKey}`

        )
      },
      gas: 5000000,
      gasPrice: 25000000000,
      network_id: 42
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
