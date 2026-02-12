import React, { useEffect, useState } from 'react';
import Login from './Login';
import Register from './Register';
import VerifyOTP from './VerifyOTP';
import logo from '../../sound/logo.png';
const Auth = () => {
  const [step, setStep] = useState('login');
  const [email, setEmail] = useState('');

  const handleStepChange = (newStep, userEmail = '') => {
    setStep(newStep);
    if (userEmail) setEmail(userEmail);
  };

  const handleVerified = () => {
    setStep('login');
    setEmail('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-400 via-green-500 to-green-600">
      <div className="bg-white p-8 max-w-md w-full rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#00ff00' }}>
            {/* <span className="text-white text-2xl font-bold">W</span> */}
            <img
              src={`${logo}`}
              alt={`Bidhan Sutradahr`}
              className="rounded-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            {step === 'verify' ? 'Verify OTP' : step === 'login' ? 'Sign In' : 'Create Account'}
          </h1>
          <p className="text-gray-600 mt-1">
            {step === 'verify' 
              ? `Enter the code sent to ${email}` 
              : step === 'login' 
              ? 'Sign in to continue' 
              : 'Join the conversation'}
          </p>
        </div>
        {step === 'login' && <Login onStepChange={handleStepChange} />}
        {step === 'register' && <Register onStepChange={handleStepChange} />}
        {step === 'verify' && <VerifyOTP email={email} onVerified={handleVerified} />}
        {step !== 'verify' && (
          <div className="mt-4 text-center">
            {step === 'login' ? (
              <p>
                Don't have an account? <button onClick={() => setStep('register')} className="text-green-600 font-semibold">Sign Up</button>
              </p>
            ) : (
              <p>
                Already have an account? <button onClick={() => setStep('login')} className="text-green-600 font-semibold">Sign In</button>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
