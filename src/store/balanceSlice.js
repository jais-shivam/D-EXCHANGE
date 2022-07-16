import { createSlice } from '@reduxjs/toolkit';

export const balanceSlice= createSlice({
    name: 'balances',
    initialState:{
        exchangeEtherBalance:null,
        exchangeTokenBalance:null,
        balancesLoaded: false,
        balancesLoading:false,
        etherDepositAmountChanged:null,
        etherWithdrawAmountChanged:null,
        tokenDepositAmountChanged:null,
        tokenWithdrawAmountChanged:null
    },
    reducers:{

        setExchangeEtherBalance:(state,action)=>{
            state.exchangeEtherBalance=action.payload;
        },
        setExchangeTokenBalance:(state,action)=>{
            state.exchangeTokenBalance=action.payload;
        },
        setBalancesLoaded:(state,action)=>{
            // state.balancesLoaded=action.payload;
            // state.exchangeEtherBalance=[...state.exchangeEtherBalanceaction.payload]
        },
        setBalancesLoading:(state,action)=>{
            state.balancesLoading=action.payload;
        },
        setEtherDepositAmountChanged:(state,action)=>{
            state.etherDepositAmountChanged=action.payload;
        },
        setEtherWithdrawAmountChanged:(state,action)=>{
            state.etherWithdrawAmountChanged=action.payload;
        },
        setTokenDepositAmountChanged:(state,action)=>{
            state.tokenDepositAmountChanged=action.payload;
        },
        setTokenWithdrawAmountChanged:(state,action)=>{
            state.tokenWithdrawAmountChanged=action.payload;
        },
    }
}); 

export const {
    setExchangeEtherBalance,
    setExchangeTokenBalance,
    setBalancesLoaded,
    setBalancesLoading,
    setEtherDepositAmountChanged,
    setEtherWithdrawAmountChanged,
    setTokenDepositAmountChanged,
    setTokenWithdrawAmountChanged
}= balanceSlice.actions;
export default balanceSlice.reducer;

export const selectExchangeEtherBalance=(state)=> state.balances.exchangeEtherBalance;
export const selectExchangeTokenBalance=(state)=> state.balances.exchangeTokenBalance;
export const selectBalancesLoaded=(state)=> state.balances.balancesLoaded;
export const selectBalancesLoading=(state)=> state.balances.balancesLoading;
export const selectEtherDepositAmountChanged=(state)=> state.balances.etherDepositAmountChanged;
export const selectEtherWithdrawAmountChanged=(state)=> state.balances.etherWithdrawAmountChanged;
export const selectTokenDepositAmountChanged=(state)=> state.balances.tokenDepositAmountChanged;
export const selectTokenWithdrawAmountChanged=(state)=> state.balances.tokenWithdrawAmountChanged;