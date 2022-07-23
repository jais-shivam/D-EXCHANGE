import { createSlice } from '@reduxjs/toolkit';

export const exchangeSlice= createSlice({
    name: 'exchange',
    initialState:{
       contract:{},
       cancelledOrderLoaded:[],
       filledOrdersLoaded:[],
       allOrders:[],
       openOrder:[],
       orderCancelling:false,
       orderCancelled:null,
       orderFilling:false,
       orderFilled:null,
       buyOrderAmountChanged:null,
       buyOrderPriceChanged:null,
       buyOrderMaking:false,
       sellOrderAmountChanged:null,
       sellOrderPriceChanged:null,
       sellOrderMaking:false,
       orderMade:null,
       buyOrder:{amount:null, price:null, making:false},
       sellOrder:{amount:null, price:null,making:false}
    },
    reducers:{
        setExchangeContract: (state,action)=>{
            state.contract=action.payload;
        },
        setCancelledOrdersLoaded: (state,action)=>{
            state.cancelledOrderLoaded=action.payload;
        },
        setFilledOrdersLoaded: (state,action)=>{
            state.filledOrdersLoaded=action.payload;
        },
        setAllOrdersLoaded: (state,action)=>{
            state.allOrders=action.payload;
        },
        setOpenOrder: (state,action)=>{
            state.openOrder=action.payload;
        },
        setOrderCancelling:(state,action)=>{
            state.orderCancelling=action.payload;
        },
        setOrderCancelled:(state,action)=>{
            // state.orderCancelling=false;
            state.cancelledOrderLoaded=[...state.cancelledOrderLoaded,action.payload];
        },
        setOrderFilling:(state,action)=>{
            state.orderFilling=action.payload;
        },
        setOrderFilled:(state,action)=>{
            console.log('action.payload',action.payload.id);
            let data;
            const index=state.filledOrdersLoaded.findIndex(order=>order.id===action.payload.id);
            if(index===-1){
                state.filledOrdersLoaded=[...state.filledOrdersLoaded,action.payload]
            }else{
                // state.filledOrdersLoaded=state.filledOrdersLoaded
            }
            // state.filledOrdersLoaded=[...state.filledOrdersLoaded, data];
        },
        // Buy Order
        setBuyOrderAmountChanged:(state,action)=>{
            state.buyOrderAmountChanged=action.payload;
            state.buyOrder={...state.buyOrder, amount:action.payload}
        },
        setBuyOrderPriceChanged:(state,action)=>{
            state.buyOrderPriceChanged=action.payload;
            state.buyOrder={...state.buyOrder, price:action.payload}
        },
        setBuyOrderMaking:(state,action)=>{
            state.buyOrder={...state.buyOrder, making:action.payload}
            state.buyOrder.amount=null;
            state.buyOrder.price=null;
        },
        // Sell Order
        setSellOrderAmountChanged:(state,action)=>{
            state.sellOrderAmountChanged=action.payload;
            state.sellOrder={...state.sellOrder, amount:action.payload}
        },
        setSellOrderPriceChanged:(state,action)=>{
            state.sellOrderPriceChanged=action.payload;
            state.sellOrder={...state.sellOrder, price:action.payload}
        },
        setSellOrderMaking:(state,action)=>{
            state.sellOrder={...state.sellOrder, making:action.payload}
            state.sellOrder.amount=null;
            state.sellOrder.price=null;
        },
        // Generic Order
        setOrderMade:(state,action)=>{
            const index=state.allOrders.findIndex(order=>order.id===action.payload.id);
            if(index===-1){
                state.allOrders=[...state.allOrders,action.payload]
            }
        },
    }
});

export const {
    setExchangeContract,
    setCancelledOrdersLoaded, 
    setFilledOrdersLoaded, 
    setAllOrdersLoaded,
    setOpenOrder,
    setOrderCancelling,
    setOrderCancelled,
    setOrderFilling,
    setOrderFilled,
    setBuyOrderAmountChanged,setBuyOrderPriceChanged,setBuyOrderMaking,
    setSellOrderAmountChanged,setSellOrderPriceChanged,setSellOrderMaking,
    setOrderMade
}= exchangeSlice.actions;
export default exchangeSlice.reducer;

export const selectExchangeContract=(state)=> state.exchange.contract;
export const selectCancelledOrdersLoaded=(state)=> state.exchange.cancelledOrderLoaded;
export const selectFilledOrdersLoaded=(state)=> state.exchange.filledOrdersLoaded;
export const selectAllOrdersLoaded=(state)=> state.exchange.allOrders;
export const selectOpenOrder=(state)=> state.exchange.openOrder;
export const selectOrderCancelling=(state)=> state.exchange.orderCancelling;
export const selectOrderCancelled=(state)=> state.exchange.orderCancelled;
export const selectOrderFilling=(state)=> state.exchange.orderFilling;
export const selectOrderFilled=(state)=> state.exchange.orderFilled;
export const selectBuyOrderAmountChanged=(state)=> state.exchange.buyOrderAmountChanged;
export const selectBuyOrderPriceChanged=(state)=> state.exchange.buyOrderPriceChanged;
export const selectBuyOrderMaking=(state)=> state.exchange.buyOrderMaking;
export const selectBuyOrder=(state)=> state.exchange.buyOrder;
export const selectSellOrderAmountChanged=(state)=> state.exchange.sellOrderAmountChanged;
export const selectSellOrderPriceChanged=(state)=> state.exchange.sellOrderPriceChanged;
export const selectSellOrderMaking=(state)=> state.exchange.sellOrderMaking;
export const selectSellOrder=(state)=> state.exchange.sellOrder;
export const selectOrderMade=(state)=> state.exchange.orderMade;