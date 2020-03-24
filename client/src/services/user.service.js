import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/auth/';

class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'secret-route');
  }

  getUserBoard() {
    return axios.get(API_URL + 'user', { headers: authHeader() });
  }
}

export default new UserService();
