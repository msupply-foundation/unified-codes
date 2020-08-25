import { useQuery, gql } from '@apollo/client';
import { IAuthenticationResponse, IUserAuthentication, JsonWebToken } from './types';

export const authenticate = async (auth: IUserAuthentication) => {
  const url = process.env.NX_AUTHENTICATION_URL;
  if (!url) return;

  const formData = new FormData();
  formData.append('client_id', process.env.NX_CLIENT_ID || '');
  formData.append('grant_type', 'password');
  formData.append('client_secret', process.env.NX_CLIENT_SECRET || '');
  formData.append('username', auth.username);
  formData.append('password', auth.password);

  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });
  return response.json();
};

export const fetchUser = async (): Promise<IAuthenticationResponse> => {
  //const accessToken = jwt.access_token || "";
  const query = gql`
    query allEntities {
      user {
        isAuthenticated
        name
        roles
      }
    }
  `;
  const { error, data } = useQuery(query);
  const authenticated = error ? false : true;
  const user = data;
  const response = { authenticated, message: error?.message, user };

  return response;
};
