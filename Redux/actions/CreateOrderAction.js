import * as ActionTypes from '../constants/ActionTypes'


export const SET_HIVES = (hives) => {
    return (dispatch) => {
        dispatch({
            type: ActionTypes.SET_HIVES,
            hives: hives     
    })
}}

export const TOTAL_ORDER_VALUE = (visited) => {
    return (dispatch) => {
    dispatch({
    type: ActionTypes.TOTAL_ORDER_VALUE,
    totalOrderValue: visited
    
})

    }}
  

    export const TOTAL_ORDER_AMOUNT = (visited) => {
        return (dispatch) => {    
        dispatch({
        type: ActionTypes.TOTAL_ORDER_AMOUNT,
        totalOrderAmount: visited
        
    })
    
        }}
    
export const BASE64_STRING = (base64string) => {
    return (dispatch) => {

    dispatch({
    type: ActionTypes.BASE64_STRING,
    base64string: base64string
    
})

    }}