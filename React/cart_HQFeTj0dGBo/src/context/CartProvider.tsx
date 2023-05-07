import {useReducer, useMemo, createContext, ReactElement} from 'react'

export type CartItemType = {
  sku:string
  name:string
  price:number
  qty:number
}

type CartStateType = {
  cart:CartItemType[]
}

const initCartState:CartStateType={
  cart: []
};

const REDUCER_ACTION_TYPE = {
  ADD: 'ADD',
  REMOVE: 'REMOVE',
  QUANTITY: 'QUANTITY',
  SUBMIT: 'SUBMIT'
};

export type ReducerActionType = typeof REDUCER_ACTION_TYPE;

export type ReducerAction = {
  type:string
  payload?:CartItemType
}

const reducer = (state:CartStateType, action:ReducerAction):CartStateType=>{
  const type = action.type;
  const payload = action.payload;
  const cart = state.cart;
  
  function filterCart(sku:string):CartItemType[]{
    return cart.filter(item => item.sku !== sku);
  }
  
  function findItem(sku:string):CartItemType|undefined{
    return cart.find(item => item.sku === sku);
  }
  
  const error = 'action.payload missing in ' + type + ' action';
  
  if (type === REDUCER_ACTION_TYPE.ADD) {
    if (!payload) throw new Error(error);
    
    const {sku, name, price} = payload;
    const filteredCart = filterCart(sku);
    const existingItem = findItem(sku);
    const newQty:number = (existingItem) ? existingItem.qty + 1 : 1;
    const newItem:CartItemType = {
      sku,
      name,
      price,
      qty: newQty
    };
    return {
      ...state,
      cart: [
        ...filteredCart,
        newItem
      ]
    };
  }
  
  if (type === REDUCER_ACTION_TYPE.REMOVE) {
    if (!payload) throw new Error(error);
    
    const {sku} = payload;
    const filteredCart = filterCart(sku);
    return {
      ...state,
      cart: [
        ...filteredCart
      ]
    };
  }
  
  if (type === REDUCER_ACTION_TYPE.QUANTITY) {
    if (!payload) throw new Error(error);
    
    const {sku, qty} = payload;
    
    const existingItem = findItem(sku);
    if (!existingItem) {
      throw new Error('Item must exist in order to update quantity');
    }
    
    const filteredCart = filterCart(sku);
    const updatedItem:CartItemType = {
      ...existingItem,
      qty
    };
    return {
      ...state,
      cart: [
        ...filteredCart,
        updatedItem
      ]
    };
  }
  
  if (type === REDUCER_ACTION_TYPE.SUBMIT) {
    return {
      ...state,
      cart: []
    };
  }
  
  throw new Error('Invalid action type ' + type);
}

const useCartContext = (initCartState:CartStateType)=>{
  const [state, dispatch] = useReducer(reducer, initCartState);
  
  const REDUCER_ACTIONS = useMemo(() => {
    return REDUCER_ACTION_TYPE;
  }, []);
  
  const cart = state.cart;
  
  const totalItems = cart.reduce((previousValue, cartItem)=>{
    return previousValue + cartItem.qty;
  }, 0);
  
  const priceValue = cart.reduce((previousValue, cartItem)=>{
    return previousValue + cartItem.qty * cartItem.price;
  }, 0);
  const totalPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  })
  .format(priceValue);
  
  const sortedCart = cart.sort((a, b)=>{
    const itemA = Number(a.sku.slice(-4));
    const itemB = Number(b.sku.slice(-4));
    return itemA - itemB;
  });
  
  return {
    dispatch,
    REDUCER_ACTIONS,
    totalItems,
    totalPrice,
    cart: sortedCart
  };
}

export type UseCartContextType = ReturnType<typeof useCartContext>;

const initCartContextState:UseCartContextType = {
  dispatch: () => {},
  REDUCER_ACTIONS:REDUCER_ACTION_TYPE,
  totalItems: 0,
  totalPrice: '',
  cart: []
};

export const CartContext = createContext<UseCartContextType>(initCartContextState);

type ChildrenType = {
  children?:ReactElement|ReactElement[]
}

export const CartProvider = ({children}:ChildrenType):ReactElement=>{
  return (
    <CartContext.Provider value={useCartContext(initCartState)}>
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;
