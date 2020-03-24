import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth/';

class AuthService {
  login(user) {
    return axios
      .post(API_URL + 'login', {
        email: user.email,
        password: user.password
      })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem('Spectory', JSON.stringify(response.data.token));
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('Spectory');
  }

  register(user) {
    return axios.post(API_URL + 'signup', {
      username: user.username,
      email: user.email,
      password: user.password,
      password_repeat: user.password
    });
  }
}

export default new AuthService();
