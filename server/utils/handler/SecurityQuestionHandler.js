const User = require('../../models/User');

// Base class for handling security questions
class SecurityQuestionHandler {
  constructor() {
    this.successor = null;
  }

  // Set the successor in the chain
  setSuccessor(successor) {
    this.successor = successor;
  }

  // Method to handle security question request, must be implemented in concrete classes
  async handleRequest(req, res) {
    throw new Error('handleRequest method must be implemented in concrete classes');
  }
}

// Handler for security question 1
class SecurityQuestion1Handler extends SecurityQuestionHandler {
  async handleRequest(req, res) {
    const { email, answers } = req.body;
    const user = await User.findOne({ email });
    if (user && user.securityQuestion1.answer === answers[0]) {
      return res.status(200).json({ message: 'Security question 1 answer is correct', status: true });
    }
    // Pass the request to the successor if it exists
    return this.successor ? this.successor.handleRequest(req, res) : null;
  }
}

// Handler for security question 2
class SecurityQuestion2Handler extends SecurityQuestionHandler {
  async handleRequest(req, res) {
    const { email, answers } = req.body;
    const user = await User.findOne({ email });
    if (user && user.securityQuestion2.answer === answers[1]) {
      return res.status(200).json({ message: 'Security question 2 answer is correct', status: true });
    }
    // Pass the request to the successor if it exists
    return this.successor ? this.successor.handleRequest(req, res) : null;
  }
}

// Handler for security question 3
class SecurityQuestion3Handler extends SecurityQuestionHandler {
  async handleRequest(req, res) {
    const { email, answers } = req.body;
    const user = await User.findOne({ email });
    if (user && user.securityQuestion3.answer === answers[2]) {
      return res.status(200).json({ message: 'Security question 3 answer is correct', status: true });
    }
    // Pass the request to the successor if it exists
    return this.successor ? this.successor.handleRequest(req, res) : null;
  }
}

// Export all handlers
module.exports = { 
  SecurityQuestionHandler, 
  SecurityQuestion1Handler, 
  SecurityQuestion2Handler, 
  SecurityQuestion3Handler 
};
