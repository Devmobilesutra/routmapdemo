
  import createOrder from './reducers/CreateOrderReducer'
 
import { createStore, applyMiddleware } from 'redux';
import { combineReducers } from 'redux';
import ReduxThunk from 'redux-thunk';

// import {Router} from '../../Router'

// const navigation = (state,action) => {
//     const newState = Router.router.getStateForAction(action, state);
//     return newState || state;
// }

//const rootReducer={countReducer}
//const rootReducer = combineReducers({login:login,homHomeReducer})

const rootReducer = combineReducers({createOrder:createOrder})


const store = createStore(rootReducer,applyMiddleware(ReduxThunk));

export default store;