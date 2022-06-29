import { createSlice } from '@reduxjs/toolkit';

export const web3Slice= createSlice({
    name: 'web3',
    initialState:{
        connection:null,
        account:null
    },
    reducers:{
        setWeb3Loaded: (state,action)=>{
            // return { ...state,  connection: action.payload }
            state.connection=action.payload;
        },
        setAccount:(state,action)=>{
            state.account=action.payload;
        }
    }
});

export const {setWeb3Loaded, setAccount}= web3Slice.actions;
export default web3Slice.reducer;

export const selectWeb3=(state)=> state.web3.connection;
export const selectAccount=(state)=> state.web3.account;