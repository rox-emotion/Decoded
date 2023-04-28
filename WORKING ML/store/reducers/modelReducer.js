const initialState = {
    model: null,
  };
  
  const modelReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_MODEL':
        return {
          ...state,
          model: action.payload,
        };
      case 'GET_MODEL':
        return state;
      default:
        return state;
    }
  };
  
  export default modelReducer;
  