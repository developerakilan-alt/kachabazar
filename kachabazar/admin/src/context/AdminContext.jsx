import React, { createContext, useReducer } from 'react';
import { getAdminInfoFromCookie } from '@/utils/adminCookie';

export const AdminContext = createContext();

const initialState = {
  adminInfo: getAdminInfoFromCookie(),
};

function reducer(state, action) {
  switch (action.type) {
    case 'USER_LOGIN':
      return { ...state, adminInfo: action.payload };

    case 'USER_LOGOUT':
      return {
        ...state,
        adminInfo: null,
      };

    default:
      return state;
  }
}

export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};
