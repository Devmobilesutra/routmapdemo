import * as ActionTypes from '../constants/ActionTypes'

import {Router, Scene, Actions, ActionConst,Stack} from 'react-native-router-flux';

const initialState = {
    totalOrderValue:0,base64stringss:'',totalOrderAmount:0,hives: [],
};


const CreateOrderReducer = (state=initialState, action) =>
 {
    const { type, payload } = action;
    
    switch (type){

        case ActionTypes.SET_HIVES:
            // return {
            //   ...state,
            //   hives: action.payload,
            // };
            console.log("hivesss=",JSON.stringify(action.hives))
            return Object.assign({}, state, {      
                hives: action.hives,           
                               
          });

        case ActionTypes.TOTAL_ORDER_VALUE:
                return Object.assign({}, state, {                 
                    totalOrderValue: action.totalOrderValue,                 
              });
              
              case ActionTypes.TOTAL_ORDER_AMOUNT:
                return Object.assign({}, state, {                 
                    totalOrderAmount: action.totalOrderAmount,                 
              });
              case ActionTypes.BASE64_STRING:
                  //console.log("rajani.............",action.base64string)
                return Object.assign({}, state, {                 
                    base64stringss: action.base64string,                 
              });
          default:
              return state
      }
  }
  export default CreateOrderReducer;

