import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RegistrationForm from '../components/RegistrationForm/RegistrationForm';
import Mediator from '../utils/mediator/mediator';

const RegisterPage = () => {
  const navigate = useNavigate();

  // Function to handle registration success
  const handleRegistrationSuccess = () => {
    navigate('/home');
    alert('Registration successful');
  };

  // // Subscribe to registration success event
  // Mediator.subscribe('registrationSuccess', handleRegistrationSuccess);

  // Subscribe to registration success event when component mounts
  useEffect(() => {
    Mediator.subscribe('registrationSuccess', handleRegistrationSuccess);

    // Unsubscribe when component unmounts
    return () => {
      Mediator.unsubscribe('registrationSuccess', handleRegistrationSuccess);
    };
  }, []); // Empty dependency array ensures subscription only happens once

  // Render the registration form component
  return (
    <RegistrationForm />
  );
};

export default RegisterPage;
