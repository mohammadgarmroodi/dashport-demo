import type { FC, ReactNode } from 'react';
import { createContext, useCallback, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { setCookie,deleteCookie,getCookie } from 'cookies-next';
import axios from 'axios';
import { serverInstance } from '@/hooks';

const STORAGE_KEY = "Authorization";

interface State {
  isInitialized: boolean;
  isAuthenticated: boolean;
  accessToken:string
}

enum ActionType {
  INITIALIZE = 'INITIALIZE',
  SIGN_IN = 'SIGN_IN',
  SIGN_OUT = 'SIGN_OUT'
}

type InitializeAction = {
  type: ActionType.INITIALIZE;
  payload: {
    isAuthenticated: boolean;
    accessToken:string
  };
};

type SignInAction = {
  type: ActionType.SIGN_IN;
  payload: {
    accessToken: string;
  };
};


type SignOutAction = {
  type: ActionType.SIGN_OUT;
};

type Action =
  | InitializeAction
  | SignInAction
  | SignOutAction;

type Handler = (state: State, action: any) => State;

const initialState: State = {
  isAuthenticated: false,
  isInitialized: false,
  accessToken: ""
};

const handlers: Record<ActionType, Handler> = {
  INITIALIZE: (state: State, action: InitializeAction): State => {
    const { isAuthenticated, accessToken } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      accessToken
    };
  },
  SIGN_IN: (state: State, action: SignInAction): State => {
    const { accessToken } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      accessToken
    };
  },
  SIGN_OUT: (state: State): State => ({
    ...state,
    isAuthenticated: false,
    accessToken: ""
  })
};

const reducer = (state: State, action: Action): State => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

export interface AuthContextType extends State {
  signIn: (accessToken:string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  ...initialState,
  signIn: () => Promise.resolve(),
  signOut: () => Promise.resolve()
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(
    async (): Promise<void> => {
      try {
        const accessToken = getCookie(STORAGE_KEY,{}) as string;
        if (accessToken) {
          dispatch({
            type: ActionType.INITIALIZE,
            payload: {
              isAuthenticated: true,
              accessToken
            }
          });
        } else {
          dispatch({
            type: ActionType.INITIALIZE,
            payload: {
              isAuthenticated: false,
              accessToken:""
            }
          });
        }
      } catch (err) {
        dispatch({
          type: ActionType.INITIALIZE,
          payload: {
            isAuthenticated: false,
            accessToken: ""
          }
        });
      }
    },
    [dispatch]
  );

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const signIn = useCallback(
    async (accessToken:string): Promise<void> => {

      setCookie(STORAGE_KEY,  accessToken);

      dispatch({
        type: ActionType.SIGN_IN,
        payload: {
          accessToken
        }
      });
    },
    [dispatch]
  );


  const signOut = useCallback(
    async (): Promise<void> => {
      deleteCookie(STORAGE_KEY);

      dispatch({ type: ActionType.SIGN_OUT });
    },
    [dispatch]
  );

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const AuthConsumer = AuthContext.Consumer;
