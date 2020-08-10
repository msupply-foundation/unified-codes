import { IUser } from "../types";
import { IUserAction, USER_ACTIONS } from "../actions/UserActions";

const initialState = () => {
  return {
    isValid: false,
    loggingIn: false,
    name: "",
    roles: [] as string[],
  } as IUser;
};

export const UserReducer = (state = initialState(), action: IUserAction) => {
  const { type } = action;

  switch (type) {
    case USER_ACTIONS.LOG_IN_FAILURE: {
      return { ...state, loggingIn: false };
    }
    case USER_ACTIONS.LOG_IN: {
      return { ...state, loggingIn: true };
    }
    case USER_ACTIONS.LOG_IN_SUCCESS: {
      const { user } = action;
      const { name, roles } = user;

      return { ...state, isValid: true, name, roles, loggingIn: false };
    }
    case USER_ACTIONS.LOG_OUT: {
      return { ...initialState, loggingIn: false };
    }

    default:
      return state;
  }
};
