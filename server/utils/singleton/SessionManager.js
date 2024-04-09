class SessionManager {
  constructor() {
    // Initialize an empty object to store session tokens and their details
    this.sessions = {};
  }

  static getInstance() {
    // Create a singleton instance of SessionManager
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  createSession(userId) {
    // Generate a unique session token and set expiration date to 24 hours from now
    const sessionToken = generateSessionToken();
    const expireDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    // Store the session token and its details in the sessions object
    this.sessions[sessionToken] = { userId, expireDate };
    return sessionToken;
  }

  getSession(sessionToken) {
    // Retrieve session details based on the provided session token
    return this.sessions[sessionToken];
  }

  deleteSession(sessionToken) {
    // Delete session details based on the provided session token
    delete this.sessions[sessionToken];
  }
}

function generateSessionToken() {
  // Generate a random session token with a length of 64 characters
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const tokenLength = 64;
  let token = '';

  for (let i = 0; i < tokenLength; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      token += chars[randomIndex];
  }

  // Add timestamp to ensure uniqueness
  const timestamp = Date.now();
  token += timestamp.toString();

  return token;
}

module.exports = SessionManager;
