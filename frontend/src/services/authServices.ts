class AuthService {
  login(username: string, password: string): boolean {
    // Simulate authentication logic
    if (username === "admin" && password === "password") {
      localStorage.setItem("authToken", "dummy-token");
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem("authToken");
    }
}