export type User = {
  id: string;
  email: string;
  name: string;
};

export interface IAuthResponse {
  message: string;
  token: string;
  user: User;
}
