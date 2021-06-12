// FIXME needs to be separated until the swa issue is fixed.
export const links = {
  login:
    process.env.NODE_ENV === "development" ? "/.auth/login/github" : "/login",
  logout: process.env.NODE_ENV === "development" ? "/.auth/logout" : "/logout",
};
