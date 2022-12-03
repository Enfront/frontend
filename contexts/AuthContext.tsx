import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { useSessionStorage } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import axios, { AxiosError, AxiosResponse } from 'axios';

import axiosConfig from '../axiosConfig';
import LoadingAnimation from '../components/dashboard/LoadingAnimation';
import { LoginData, RegisterData, ResetPasswordData, User } from '../types/types';

interface AuthExports {
  authError: string;
  isProcessing: boolean;
  isAuthenticated: boolean;
  userDetails: User;
  needsVerification: boolean;
  resetTwoFactor: boolean;
  login: (data: LoginData, recaptcha: string) => Promise<void>;
  checkTwoFactor: (code: string) => Promise<void>;
  disableTwoFactor: (code: string) => Promise<void>;
  setResetTwoFactor: (value: boolean) => void;
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
  needsVerification: false,
  resetTwoFactor: false,
  login: async () => undefined,
  checkTwoFactor: async () => undefined,
  disableTwoFactor: async () => undefined,
  setResetTwoFactor: async () => undefined,
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
  const [needsVerification, setNeedsVerification] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<User>(userDetailsInitialState);
  const [userRefId, setUserRefId] = useState<string>('');
  const [resetTwoFactor, setResetTwoFactor] = useState<boolean>(false);

  const [ephToken, setEphToken, removeEphToken] = useSessionStorage({
    key: '_enfront_ephemeral_token',
    defaultValue: '',
  });

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

    setIsProcessing(false);
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
      .then((response: AxiosResponse) => {
        if (response.status === 200) {
          setAuthError('');
          getUserDetails();
          setIsAuthenticated(true);

          router.push('/dashboard');
        } else if (response.status === 202) {
          setUserRefId(response.data.data.user);
          setEphToken(response.data.data.ephemeral_token);
          setNeedsVerification(true);
        }
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

  const checkTwoFactor = async (code: string): Promise<void> => {
    setIsProcessing(true);

    await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/users/login/two-factor`, { code, ephemeral_token: ephToken })
      .then((response: AxiosResponse) => {
        if (response.status === 200) {
          removeEphToken();
          getUserDetails();
          setIsAuthenticated(true);

          router.push('/dashboard').then(() => {
            setNeedsVerification(false);
          });
        }
      })
      .catch((error: AxiosError) => {
        setAuthError(error?.response?.data[0]);
      });

    setIsProcessing(false);
  };

  const disableTwoFactor = async (code: string): Promise<void> => {
    setIsProcessing(true);

    await axiosConfig
      .post(`${process.env.NEXT_PUBLIC_API_URL}/users/two-factor/disable`, {
        method: 'app',
        user: userRefId,
        code,
      })
      .then(() => {
        getUserDetails();
        setNeedsVerification(false);
        setResetTwoFactor(false);
        setAuthError('');

        showNotification({
          title: 'Two Factor Authentication Disabled',
          message: 'We strongly suggest you reactivate it after logging in.',
          color: 'green',
        });
      })
      .catch((error: AxiosError) => {
        setAuthError(error?.response?.data.code[0]);
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
        ref_id: data.ref_id,
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
        .then((response: AxiosResponse) => {
          if (response.status === 200 && response.data.data.success === true) {
            getUserDetails();
            setIsAuthenticated(true);
            setIsProcessing(false);
          } else {
            setIsAuthenticated(false);
            setIsProcessing(false);
          }
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
        checkTwoFactor,
        disableTwoFactor,
        logout,
        setResetTwoFactor,
        resetTwoFactor,
        userDetails,
        isAuthenticated,
        isProcessing,
        authError,
        needsVerification,
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
      return <LoadingAnimation />;
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
