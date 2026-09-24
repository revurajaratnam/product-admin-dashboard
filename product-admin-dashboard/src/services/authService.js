import api from "../lib/axios";

const authService = {
  async login(username, password) {
    const { data } = await api.post("/auth/login", {
      username,
      password,
      expiresInMins: 60 * 24 * 7,
    });
    return data;
  },
};

export default authService;
