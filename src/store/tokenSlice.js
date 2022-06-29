import { createSlice } from '@reduxjs/toolkit';

export const tokenSlice= createSlice({
    name: 'token',
    initialState:{
       contract:null
    },
    reducers:{
        setTokenLoaded: (state,action)=>{
            state.contract=action.payload;
        },
        
    }
});

export const {setTokenLoaded}= tokenSlice.actions;
export default tokenSlice.reducer;

export const selectTokenContract=(state)=> state.token.contract;
