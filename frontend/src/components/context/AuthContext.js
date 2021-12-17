import React, { createContext, useReducer } from "react";
// import { auth } from "../../firebase";

// const authContext = createContext();

// export const useAuth = () => {
//   return useContext(authContext);
// };

export const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
      };
  }
};

const initialState = {
  user: null,
};

export const AuthContext = createContext();

export const AuthProvider = (props) => {
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  return (
    <AuthContext.Provider
      value={{ user: state.user, dispatch }}
    >
        {props.children}
    </AuthContext.Provider>
  );
};
