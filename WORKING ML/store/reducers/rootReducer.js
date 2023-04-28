import { combineReducers } from 'redux';
import modelReducer from './modelReducer';

const rootReducer = combineReducers({
  model: modelReducer,
  // Add other reducers here if needed
});

export default rootReducer;
