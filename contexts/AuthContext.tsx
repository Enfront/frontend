import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { showNotification } from '@mantine/notifications';
import axios, { AxiosError, AxiosResponse } from 'axios';

import axiosConfig from '../axiosConfig';
import { LoginData, RegisterData, ResetPasswordData, User } from '../types/types';

interface AuthExports {
  authError: string;
  isProcessing: boolean;
  isAuthenticated: boolean;
  userDetails: User;
  login: (data: LoginData, recaptcha: string) => Promise<void>;
  register: (data: RegisterData, recaptcha: string) => Promise<void>;
  forgotPassword: (data: { email: string }, recaptcha: string) => Promise<void>;
  resetPassword: (data: ResetPasswordData) => Promise<void>;
  logout: () => Promise<void>;
}

interface AuthProvider {
  children: ReactNode;
}

const userDetailsInitialState: User = {
  email: '',
  first_name: '',
  last_name: '',
  ref_id: '',
  subscription_tier: 0,
  username: '',
  created_at: '',
  is_active: false,
};

export const AuthContext = createContext<AuthExports>({
  authError: '',
  isProcessing: true,
  isAuthenticated: false,
  userDetails: userDetailsInitialState,
  login: async () => undefined,
  register: async () => undefined,
  logout: async () => undefined,
  forgotPassword: async () => undefined,
  resetPassword: async () => undefined,
});

export function AuthProvider({ children }: AuthProvider): JSX.Element {
  const router = useRouter();

  const [authError, setAuthError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<User>(userDetailsInitialState);

  const getUserDetails = async (): Promise<void> => {
    await axiosConfig
      .get(`${process.env.NEXT_PUBLIC_API_URL}/users/self`)
      .then((response: AxiosResponse) => {
        setUserDetails(response.data.data);
      })
      .catch((error: AxiosError) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });

    setIsProcessing(false);
  };

  const register = async (data: RegisterData, recaptchaToken: string): Promise<void> => {
    setIsProcessing(true);

    await axiosConfig
      .post(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, {
        email: data.email,
        username: data.username,
        password: data.password,
        password_confirmation: data.passwordConfirmation,
        first_name: data.firstName,
        last_name: data.lastName,
        recaptcha: recaptchaToken,
        shop: true,
      })
      .then(() => {
        showNotification({
          title: `Thank you for registering.`,
          message: `Please check ${data.email} for a verification email. After clicking the activation link you will be able to login.`,
          color: 'green',
          autoClose: false,
        });

        router.push('/');
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          setAuthError(error.response.data.message);
        }
      });
  };

  const login = async (data: LoginData, recaptchaToken: string): Promise<void> => {
    setIsProcessing(true);

    await axiosConfig
      .post(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
        email: data.email,
        password: data.password,
        shop: true,
        recaptcha: recaptchaToken,
      })
      .then(() => {
        setAuthError('');
        getUserDetails();
        setIsAuthenticated(true);

        router.push('/dashboard');
      })
      .catch((error: AxiosError) => {
        if (error.response && error.response.status === 401) {
          setAuthError(error.response.data.message);
        } else {
          setAuthError('There was an unknown error. Please contact support for further assistance.');
        }
      });

    setIsProcessing(false);
  };

  const forgotPassword = async (data: { email: string }, recaptchaToken: string): Promise<void> => {
    setIsProcessing(true);

    await axiosConfig
      .post(`${process.env.NEXT_PUBLIC_API_URL}/users/forgot`, {
        email: data.email,
        recaptcha: recaptchaToken,
        shop: true,
      })
      .then(() => {
        showNotification({
          title: 'Success!',
          message: `An email has been sent to ${data.email} with instructions to reset your password.`,
          color: 'green',
          autoClose: false,
        });

        setAuthError('');
        router.push('/sign-in');
      })
      .catch((error: AxiosError) => {
        if (error.response && error.response.status === 404) {
          setAuthError(error.response.data.message);
        } else {
          setAuthError('There was an unknown error. Please contact support for further assistance.');
        }
      });

    setIsProcessing(false);
  };

  const resetPassword = async (data: ResetPasswordData): Promise<void> => {
    setIsProcessing(true);

    await axiosConfig
      .post(`${process.env.NEXT_PUBLIC_API_URL}/users/reset`, {
        password: data.password,
        password_confirmation: data.passwordConfirmation,
        ue: data.ue,
        token: data.token,
        shop: true,
      })
      .then(() => {
        showNotification({
          title: 'Success!',
          message: `Your password has been reset.`,
          color: 'green',
        });

        setAuthError('');
        router.push('/sign-in');
      })
      .catch((error: AxiosError) => {
        if (error.response && error.response.status === 422) {
          setAuthError(error.response.data.message);
        } else {
          setAuthError('There was an unknown error. Please contact support for further assistance.');
        }
      });

    setIsProcessing(false);
  };

  const logout = async (): Promise<void> => {
    setIsProcessing(true);

    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/logout`,
        {
          shop: true,
        },
        {
          withCredentials: true,
        },
      )
      .then(() => {
        router.push('/sign-in');
        setIsAuthenticated(false);
      });

    setIsProcessing(false);
  };

  useEffect(() => {
    const isLoggedIn = async (): Promise<void> => {
      setIsProcessing(true);

      await axiosConfig
        .get(`${process.env.NEXT_PUBLIC_API_URL}/users/status`)
        .then(() => {
          getUserDetails();
          setIsAuthenticated(true);
          setIsProcessing(false);
        })
        .catch(() => {
          setIsAuthenticated(false);
          setIsProcessing(false);
        });
    };

    isLoggedIn();

    return () => {
      setIsAuthenticated(false);
      setIsProcessing(false);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        resetPassword,
        forgotPassword,
        register,
        login,
        logout,
        userDetails,
        isAuthenticated,
        isProcessing,
        authError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default function useAuth(): AuthExports {
  return useContext(AuthContext);
}

export const ProtectedRoute = (WrappedComponent: (props: never) => JSX.Element): ((props: never) => void) => {
  const AuthGuard = (props: never) => {
    const { isProcessing, isAuthenticated } = useAuth();
    const router = useRouter();

    if (isProcessing && !isAuthenticated) {
      return <h1>Loading...</h1>;
    }

    if (!isProcessing && !isAuthenticated) {
      router.push('/sign-in');
    }

    if (!isProcessing && isAuthenticated) {
      return <WrappedComponent {...props} />;
    }

    return null;
  };

  return AuthGuard;
};
