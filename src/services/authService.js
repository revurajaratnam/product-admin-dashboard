const authService = {
  async login(username, password) {
    const validUser = "admin";
    const validPass = "admin123";

    if (username === validUser && password === validPass) {
      return {
        id: 1,
        username: "admin",
        firstName: "Admin",
        lastName: "User",
        email: "admin@example.com",
        token: "custom-demo-token",
      };
    }

    throw {
      status: 401,
      message: "Invalid username or password.",
    };
  },
};