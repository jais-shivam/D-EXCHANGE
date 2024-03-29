import {configureStore} from '@reduxjs/toolkit';
import balanceSlice from './balanceSlice';
import exchangeSlice from './exchangeSlice';
import tokenSlice from './tokenSlice';
import web3Slice from './web3Slice';

export default configureStore({
    reducer:{
        web3:web3Slice,
        token:tokenSlice,
        exchange:exchangeSlice,
        balances: balanceSlice
    }
});

