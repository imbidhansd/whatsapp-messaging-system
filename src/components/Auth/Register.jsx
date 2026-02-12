import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Lock, Phone } from 'lucide-react';
import { registerUser, clearError } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

const Register = ({ onStepChange }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });

  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) dispatch(clearError());
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    const submitData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      password_confirmation: formData.confirmPassword
    };

    try {
      await dispatch(registerUser(submitData)).unwrap();
      toast.success('Registration successful! Check your email for OTP.');
      onStepChange('verify', formData.email);
    } catch (err) {
      const data = err?.response?.data || err;
      toast.error(data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} className="w-full pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
      </div>

      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="w-full pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
      </div>

      <div className="relative">
        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} className="w-full pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
      </div>

      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} className="w-full pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
      </div>

      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleInputChange} className="w-full pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
      </div>

      <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg">
        {loading ? 'Processing...' : 'Sign Up'}
      </button>
    </form>
  );
};

export default Register;
