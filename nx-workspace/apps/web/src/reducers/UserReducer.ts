import { IUser } from "../types";
import { IUserAction, USER_ACTIONS } from "../actions/UserActions";

const initialState = () => {
  return {
    name: "",
    isValid: false,
    roles: [] as string[],
  } as IUser;
};

export const UserReducer = (state = initialState(), action: IUserAction) => {
  const { type } = action;

  switch (type) {
    case USER_ACTIONS.LOG_IN: {
      const { user } = action;
      const { name, roles } = user;

      return { ...state, isValid: true, name, roles };
    }
    case USER_ACTIONS.LOG_OUT: {
      return { ...initialState };
    }

    default:
      return state;
  }
};
