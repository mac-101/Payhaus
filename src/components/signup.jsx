import React, { useState } from 'react';
import { User, Home, Mail, Lock, Phone, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase.config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set, serverTimestamp } from 'firebase/database';

export default function SignupPage({ login }) {
    const [role, setRole] = useState(null);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRoleSelect = (selectedRole) => {
        setRole(selectedRole);
        setError('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!role) {
            setError('Please select a role');
            return;
        }

        if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            // Create user with Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            const user = userCredential.user;

            // Store user data in Realtime Database
            await set(ref(db, `users/${user.uid}`), {
                uid: user.uid,
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                role: role,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            setSuccess(`Signup successful as ${role}!`);
            setError('');

            // Redirect after 1.5 seconds
            setTimeout(() => {
                navigate('/');
            }, 1500);

        } catch (err) {
            console.error('Signup error:', err);
            
            // Handle specific Firebase errors
            if (err.code === 'auth/email-already-in-use') {
                setError('This email is already registered');
            } else if (err.code === 'auth/invalid-email') {
                setError('Invalid email address');
            } else if (err.code === 'auth/weak-password') {
                setError('Password is too weak. Use at least 6 characters');
            } else {
                setError(err.message || 'Failed to create account');
            }
            setSuccess('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white shadow-lg border border-gray-200">
                {/* Header */}
                <div className="bg-gray-50 border-b border-gray-200 p-8">
                    <h1 className="text-3xl font-semibold text-gray-900">Create Account</h1>
                    <p className="text-gray-600 mt-2">Fill in your details to get started</p>
                </div>

                <div className="p-8">
                    {/* Role Selection */}
                    <div className="mb-8">
                        <label className="block text-sm font-semibold text-gray-900 mb-4">Select Your Role</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => handleRoleSelect('tenant')}
                                className={`flex items-center justify-center gap-3 p-4 border-2 transition-all ${role === 'tenant'
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-300 bg-white hover:border-gray-400'
                                    }`}
                            >
                                <User size={20} className={role === 'tenant' ? 'text-blue-600' : 'text-gray-600'} />
                                <span className={`font-medium ${role === 'tenant' ? 'text-blue-600' : 'text-gray-700'}`}>
                                    Tenant
                                </span>
                            </button>
                            <button
                                onClick={() => handleRoleSelect('landlord')}
                                className={`flex items-center justify-center gap-3 p-4 border-2 transition-all ${role === 'landlord'
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-300 bg-white hover:border-gray-400'
                                    }`}
                            >
                                <Home size={20} className={role === 'landlord' ? 'text-blue-600' : 'text-gray-600'} />
                                <span className={`font-medium ${role === 'landlord' ? 'text-blue-600' : 'text-gray-700'}`}>
                                    Landlord
                                </span>
                            </button>
                        </div>
                        <p className="text-sm mt-2 text-gray-600">
                            Already have an account? <span onClick={login} className="text-blue-600 cursor-pointer hover:text-blue-800">Log in</span>
                        </p>
                    </div>

                    {role && (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Full Name */}
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-semibold text-gray-900 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User size={18} className="absolute left-3 top-3.5 text-gray-400" />
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        placeholder="John Doe"
                                        disabled={loading}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail size={18} className="absolute left-3 top-3.5 text-gray-400" />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="john@example.com"
                                        disabled={loading}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <Phone size={18} className="absolute left-3 top-3.5 text-gray-400" />
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="+1 (555) 000-0000"
                                        disabled={loading}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-3 top-3.5 text-gray-400" />
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="••••••••"
                                        disabled={loading}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                                    />
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-3 top-3.5 text-gray-400" />
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        placeholder="••••••••"
                                        disabled={loading}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                                    />
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-300 text-red-800">
                                    <AlertCircle size={18} className="flex-shrink-0" />
                                    <span className="text-sm font-medium">{error}</span>
                                </div>
                            )}

                            {/* Success Message */}
                            {success && (
                                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-300 text-green-800">
                                    <CheckCircle size={18} className="flex-shrink-0" />
                                    <span className="text-sm font-medium">{success}</span>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 border border-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:border-blue-500 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Creating Account...' : `Sign Up as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
                            </button>

                            <p className="text-sm mt-2  text-gray-600">
                                Already have an account? <span onClick={login} className="text-blue-600 cursor-pointer hover:text-blue-800">Log in</span>
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}