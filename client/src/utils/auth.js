import decode from 'jwt-decode';

class AuthService {

    token_name = 'stance_user_token';

    getProfile() {
    return decode(this.getToken());
    }

    loggedIn() {
    const token = this.getToken();
    // If there is a token and it's not expired, return `true`
    return token && !this.isTokenExpired(token) ? true : false;
    }

    isTokenExpired(token) {
    // Decode the token to get its expiration time that was set by the server
    const decoded = decode(token);
    // If the expiration time is less than the current time (in seconds), the token is expired and we return `true`
    if (decoded.exp < Date.now() / 1000) {
        localStorage.removeItem(this.token_name);
        return true;
    }
    // If token hasn't passed its expiration time, return `false`
    return false;
    }

    getToken() {
        return localStorage.getItem(this.token_name);
    }

    login(idToken) {
    localStorage.setItem(this.token_name, idToken);
    window.location.assign('/');
    }

    logout() {
    localStorage.removeItem(this.token_name);
    window.location.reload();
    }
}

export default new AuthService();
