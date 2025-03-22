export const verifySecret = async (accountId: string, password: string) => {
  return await $fetch("/api/verify-secret", {
    method: "POST",
    body: {
      accountId: accountId,
      password: password,
    },
  });
};

export const resendEmailOtp = async (email: string) => {
  return await $fetch("/api/resend-email-otp", {
    method: "POST",
    body: {
      email: email,
    },
  });
};

export const signUp = async (email: string, fullName: string) => {
  return await $fetch("/api/sign-in", {
    method: "POST",
    body: {
      fullName: fullName,
      email: email,
    },
  });
};

export const signIn = async (email: string) => {
  return await $fetch("/api/sign-in", {
    method: "POST",
    body: {
      email: email,
    },
  });
};

export const signOut = async () => {
  return await $fetch("/api/sign-out", {
    method: "POST",
  });
};

export const currentUser = async () => {
  return await $fetch("/api/current-user", {
    method: "GET",
  });
};
