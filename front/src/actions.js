export const loginSuccess = (userData) => ({
    type: 'LOGIN_SUCCESS',
    payload: userData,
  });
  
  export const loginFailure = (error) => ({
    type: 'LOGIN_FAILURE',
    payload: error,
  });
  
  export const logoutSucceed = () => ({
    type: 'LOGOUT_SUCCEED',
  });
  

const initialState = {
    isLoggedIn: false,
    user: null,
    error: null,
    showRegister: false, 
  };
  
  const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'LOGIN_SUCCESS':
        return {
          ...state,
          isLoggedIn: true,
          user: action.payload,
          error: null,
        };
      case 'LOGIN_FAILURE':
        return {
          ...state,
          isLoggedIn: false,
          user: null,
          error: action.payload,
        };
      case 'LOGOUT_SUCCEED':
        return {
          ...state,
          isLoggedIn: false,
          user: null,
          error: null,
        };
      default:
        return state;
    }
  };
  
  export default authReducer;
  