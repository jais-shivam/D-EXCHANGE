import { createSlice } from '@reduxjs/toolkit';
export const tokenSlice= createSlice({
    name: 'token',
    initialState:{
       contract:null,
       tokenBalance:null
    },
    reducers:{
        setTokenLoaded: (state,action)=>{
            state.contract=action.payload;
        },
        setTokenBalance: (state,action)=>{
            state.tokenBalance=action.payload;
        },
        
    }
});

export const {setTokenLoaded, setTokenBalance}= tokenSlice.actions;
export default tokenSlice.reducer;

export const selectTokenContract=(state)=> state.token.contract;
export const selectTokenBalance= (state)=>state.token.tokenBalance;