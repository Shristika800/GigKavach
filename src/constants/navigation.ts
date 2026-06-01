export type RootStackParamList = {

  Splash: undefined;

  Login: undefined;

  Register: undefined;

  OTP: {
    fromScreen:
      "Login" | "Register";

    phone: string;
  };

  Permission: undefined;

  WorkerDetails: undefined;

  Dashboard: undefined;
};