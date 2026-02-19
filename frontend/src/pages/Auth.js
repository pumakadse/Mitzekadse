import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const Auth = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ email: '', password: '', username: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(registerForm.email, registerForm.password, registerForm.username);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <Activity size={32} className="text-primary" />
            <h1 className="font-heading text-3xl font-black">
              FLASH<span className="text-primary">PULSE</span>
            </h1>
          </Link>
          <p className="text-text-tertiary text-sm mt-2">Live Football Scores</p>
        </div>

        <div className="card p-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="w-full bg-background-subtle mb-6">
              <TabsTrigger 
                value="login" 
                className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-black"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="register" 
                className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-black"
              >
                Register
              </TabsTrigger>
            </TabsList>

            {error && (
              <div className="mb-4 p-3 bg-secondary/10 border border-secondary/30 rounded-sm text-secondary text-sm">
                {error}
              </div>
            )}

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4" data-testid="login-form">
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      className="pl-10 bg-background-subtle border-border text-text-primary"
                      required
                      data-testid="login-email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-text-secondary mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className="pl-10 pr-10 bg-background-subtle border-border text-text-primary"
                      required
                      data-testid="login-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full btn-primary"
                  disabled={loading}
                  data-testid="login-submit"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4" data-testid="register-form">
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                    <Input
                      type="text"
                      placeholder="Your username"
                      value={registerForm.username}
                      onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                      className="pl-10 bg-background-subtle border-border text-text-primary"
                      required
                      data-testid="register-username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-text-secondary mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      className="pl-10 bg-background-subtle border-border text-text-primary"
                      required
                      data-testid="register-email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-text-secondary mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      className="pl-10 pr-10 bg-background-subtle border-border text-text-primary"
                      required
                      minLength={6}
                      data-testid="register-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full btn-primary"
                  disabled={loading}
                  data-testid="register-submit"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <Link to="/" className="text-text-tertiary text-sm hover:text-primary transition-colors">
              Continue as guest
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
