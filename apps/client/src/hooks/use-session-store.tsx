import { create } from 'zustand';
import cookies from 'js-cookie';

interface LoginProps {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface SessionStore {
  accessToken: string | null;
  refreshToken: string | null;
  expiresIn: number | null;
  logIn: (props: LoginProps) => void;
  logOut: () => void;
}

const cookiesOptions: Cookies.CookieAttributes = {
  expires: 7,
  sameSite: 'strict',
  secure: true
};

export const useSessionStore = create<SessionStore>(set => ({
  accessToken: cookies.get('accessToken') ? cookies.get('accessToken')! : null,
  refreshToken: cookies.get('refreshToken') ? cookies.get('refreshToken')! : null,
  expiresIn: cookies.get('expiresIn') ? parseInt(cookies.get('expiresIn')!) : null,
  logIn: ({ accessToken, refreshToken, expiresIn }: LoginProps) => {
    cookies.set('accessToken', accessToken, cookiesOptions);
    cookies.set('refreshToken', refreshToken, cookiesOptions);
    cookies.set('expiresIn', expiresIn.toString(), cookiesOptions);

    set({ accessToken, refreshToken, expiresIn });
  },
  logOut: () => {
    cookies.remove('tokens');
    set({ accessToken: null, refreshToken: null, expiresIn: null });
  }
}));
