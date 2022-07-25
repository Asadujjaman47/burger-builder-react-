import axios from 'axios';
import * as actionTypes from './actionTypes';


export const addIngredient = igtype => {
    return {
        type: actionTypes.ADD_INGREDIENT,
        payload: igtype,
    }
}

export const removeIngredient = igtype => {
    return {
        type: actionTypes.REMOVE_INGREDIENT,
        payload: igtype,
    }
}

export const updatePurchasable = () => {
    return {
        type: actionTypes.UPDATE_PURCHASABLE,
    }
}

export const resetIngredients = () => {
    return {
        type: actionTypes.RESET_INGREDIENTS,
    }
}

export const loadOrders = orders => {
    return {
        type: actionTypes.LOAD_ORDERS,
        payload: orders
    }
}

export const orderLoadFailed = () => {
    return {
        type: actionTypes.ORDER_LOAD_FAILED,
    }
}

// here disptach LoadOrders and orderLoadFailed,
// function go next step => handle Asynchronous code handle
// for dispatch, we use middleware, thunk
// dispatch in dispatch
export const fetchOrders = (token, userId) => dispatch => {
    const queryParams = '&orderBy="userId"&equalTo="' + userId + '"';
    axios.get('https://burger-builder-bd25c-default-rtdb.asia-southeast1.firebasedatabase.app/orders.json?auth=' + token + queryParams)
        .then(response => {
            dispatch(loadOrders(response.data));
        })
        .catch(err => {
            dispatch(orderLoadFailed());
        })
}