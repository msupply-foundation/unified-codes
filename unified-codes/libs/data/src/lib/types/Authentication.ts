export type JsonWebToken = {
  access_token: string;
  expires_in: number;
  id_token: string;
  not_before_policy: number;
  refresh_expires_in: number;
  refresh_token: string;
  scope: string;
  session_state: string;
  token_type: string;
};
