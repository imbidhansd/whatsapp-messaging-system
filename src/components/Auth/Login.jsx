import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { loginUser, clearError } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

const Login = ({ onStepChange }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) dispatch(clearError());
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await dispatch(loginUser(formData)).unwrap();
      if (response.needsVerification) {
        toast.error(response.message || 'Please verify your email first');
        onStepChange('verify', formData.email);
        return;
      }

      toast.success('Login successful!');
    } catch (err) {        
      const data = err?.response?.data || err;
      if (data?.needsVerification) {
        toast.error(data.message || 'Please verify your email first');
        onStepChange('verify', formData.email);
        return;
      }
      toast.error(data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="w-full pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
      </div>

      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} className="w-full pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {showPassword ? <EyeOff /> : <Eye />}
        </button>
      </div>

      <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg">
        {loading ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
  );
};

export default Login;
