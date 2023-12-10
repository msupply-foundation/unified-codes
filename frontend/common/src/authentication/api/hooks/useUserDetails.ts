import { useMutation } from 'react-query';
import { useAuthApi } from './useAuthApi';

export const useUserDetails = () => {
  const api = useAuthApi();
  return useMutation(api.get.me);
};
