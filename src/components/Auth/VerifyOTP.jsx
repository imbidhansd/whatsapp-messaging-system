import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOTP, resendOTPAction } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

const VerifyOTP = ({ email, onVerified }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.auth);

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(15);
  const inputRefs = useRef([]);

  // টাইমার লজিক
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (element, index) => {
    const value = element.value.slice(-1);
    if (isNaN(value)) return false;
    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value !== "" && index < 5) inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    try {
      await dispatch(resendOTPAction({ email })).unwrap();
      toast.success('New OTP sent to your email');
      setTimer(15);
    } catch (err) {
      toast.error(err?.message || 'Failed to resend OTP');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join("");
    if (finalOtp.length < 6) return toast.error("Please enter 6 digit OTP");
    
    try {
      await dispatch(verifyOTP({ email, otp: finalOtp })).unwrap();
      toast.success('Email verified successfully!');
      onVerified();
    } catch (err) {
      const data = err?.response?.data || err;
      toast.error(data?.message || 'Invalid OTP');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-center gap-2">
        {otp.map((data, index) => (
          <input
            key={index}
            type="text"
            ref={(el) => (inputRefs.current[index] = el)}
            maxLength={1}
            value={data}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-10 h-12 border-2 rounded-lg text-center text-xl font-bold focus:border-green-500 outline-none"
            required
          />
        ))}
      </div>

      <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50">
        {loading ? 'Verifying...' : 'Verify & Continue'}
      </button>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          Didn't receive a code?{' '}
          <button 
            type="button" 
            onClick={handleResend}
            disabled={timer > 0}
            className={`font-semibold ${timer > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-green-600 hover:underline'}`}
          >
            {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
          </button>
        </p>
      </div>
    </form>
  );
};

export default VerifyOTP;