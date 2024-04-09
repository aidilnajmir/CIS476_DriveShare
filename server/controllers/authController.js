// Import required modules and utilities
const bcrypt = require('bcrypt');
const User = require('../models/User');
const SessionManager = require('../utils/singleton/SessionManager');
const { 
  SecurityQuestion1Handler, 
  SecurityQuestion2Handler, 
  SecurityQuestion3Handler 
}  = require('../utils/handler/SecurityQuestionHandler');

// Get an instance of SessionManager
const sessionManager = SessionManager.getInstance();

// Register a new user
const register = async (req, res) => {
  try {
    // Hash the user's password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // Create a new User instance
    const user = new User({
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
      securityQuestion1: req.body.securityQuestion1,
      securityQuestion2: req.body.securityQuestion2,
      securityQuestion3: req.body.securityQuestion3
    });
    // Save the user to the database
    await user.save();
    // Create a new session token for the user
    const sessionToken = sessionManager.createSession(user.id);
    // Return success response with user ID and session token
    res.status(200).json({ userId: user.id, sessionToken: sessionToken });
  } catch (error) {
    // Return error response if registration fails
    res.status(500).json({ error: error.message });
  }
};

// Authenticate user
const auth = async (req, res) => {
  try {
    // Find the user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      // Return authentication failed if user not found
      return res.status(401).json({ message: 'Authentication failed' });
    }
    // Compare passwords
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) {
      // Return authentication failed if passwords don't match
      return res.status(401).json({ message: 'Authentication failed' });
    }
    // Create a new session token for the user
    const sessionToken = sessionManager.createSession(user.id);
    // Return success response with user ID and session token
    res.status(200).json({ userId: user.id, sessionToken: sessionToken});
  } catch (error) {
    // Return error response if authentication fails
    res.status(500).json({ error: error.message });
  }
};

// Verify user session
const verifySession = async (req, res) => {
  try {
    const sessionToken = req.body.sessionToken;
    if (!sessionToken) {
      // Return unauthorized if session token is not provided
      return res.status(401).json({ message: 'Unauthorized' });
    }
    // Retrieve session from SessionManager
    const session = sessionManager.getSession(sessionToken);
    if (!session || session.expireDate < new Date()) {
      // Return session expired if session is not found or has expired
      return res.status(401).json({ message: 'Session expired' });
    }
    res.status(200).json({ userId: session.userId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    const sessionToken = req.body.sessionToken;
    if (!sessionToken) {
      // Return unauthorized if session token is not provided
      return res.status(401).json({ message: 'Unauthorized' });
    }
    // Delete session from SessionManager
    sessionManager.deleteSession(sessionToken);
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get security questions for a user
const getSecurityQuestions = async (req, res) => {
  try {
    const { email } = req.body;
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Extract security questions from user document
    const { securityQuestion1, securityQuestion2, securityQuestion3 } = user;
    // Return security questions
    const questions = [
      securityQuestion1.question,
      securityQuestion2.question,
      securityQuestion3.question,
    ];
    res.status(200).json(questions);
  } catch (error) {
    console.error('Error retrieving security questions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Verify user's security questions answers
const verifySecurityQuestions = async (req, res) => {
  try {
    const { email, answers } = req.body;
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create the chain of responsibility
    const handler1 = new SecurityQuestion1Handler();
    const handler2 = new SecurityQuestion2Handler();
    const handler3 = new SecurityQuestion3Handler();
    handler1.setSuccessor(handler2);
    handler2.setSuccessor(handler3);

    // Start the chain with the first handler
    const response = await handler1.handleRequest({ body: { email, answers } }, res);
    
    if (response) {
      // Answer is correct, handle success
      return res.status(200).json(response.data);
    } else {
      // No handler in the chain was able to verify the answer
      return res.status(200).json({ message: 'Security questions answers are incorrect', status: false });
    }
    
  } catch (error) {
    console.error('Error verifying answers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Update user's password
const updatePassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Update user's password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  register,
  auth,
  verifySession,
  logout,
  getSecurityQuestions,
  verifySecurityQuestions,
  updatePassword
};
