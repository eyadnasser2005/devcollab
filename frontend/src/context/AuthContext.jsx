import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as profileApi from '../api/profileApi';

const TOKEN_KEY = 'auth_token';

const AuthContext = createContext({
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
  setUser: () => {},
});

function resolveGetProfileHelper() {
  if (typeof profileApi.getProfile === 'function') {
    return profileApi.getProfile;
  }

  if (typeof profileApi.default === 'function') {
    return profileApi.default;
  }

  return null;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback((nextToken, nextUser) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    setToken(nextToken);
    setUser(nextUser ?? null);
  }, []);

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    const getProfile = resolveGetProfileHelper();
    if (!getProfile) {
      logout();
      return;
    }

    let isMounted = true;

    (async () => {
      try {
        const profile = await getProfile(token);
        if (isMounted) {
          setUser(profile);
        }
      } catch (error) {
        const status =
          error?.status ??
          error?.response?.status ??
          (typeof error?.message === 'string' && error.message.includes('401')
            ? 401
            : undefined);

        if (status === 401) {
          logout();
          return;
        }

        if (isMounted) {
          setUser(null);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [token, logout]);

  const value = useMemo(
    () => ({
      token,
      user,
      login,
      logout,
      setUser,
    }),
    [token, user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
