'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import { Eye, EyeOff, Mail, Lock, AlertTriangle, Loader2, Smile, EarIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AuthFormProps {
  onSuccess: () => void;
}

export const AuthForm = ({ onSuccess }: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('signin');

  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (signUpData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: signUpData.email,
        password: signUpData.password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });

      if (error) throw error;

      setSuccess('Check your email to confirm your account');
      setSignUpData({ email: '', password: '', confirmPassword: '' });
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: signInData.email,
        password: signInData.password,
      });

      if (error) throw error;

      onSuccess();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <Card className="bg-yellow-50 border-none shadow-2xl rounded-3xl">
          <CardHeader className="text-center pb-4">
          <EarIcon className="text-pink-500 w-6 h-6 animate-bounce" />
            <CardTitle className="text-3xl font-bold text-pink-600">Whispr</CardTitle>
            <CardDescription className="text-sm text-gray-600">
              Anonymous, playful, and way too real.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">
              <TabsList className="grid grid-cols-2 bg-pink-100 rounded-full p-1">
                <TabsTrigger
                  value="signin"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-md text-sm rounded-full px-3 py-1"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-md text-sm rounded-full px-3 py-1"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-100 p-3 rounded-lg text-sm text-red-800"
                  >
                    <AlertTriangle className="w-4 h-4 inline-block mr-1" /> {error}
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-green-100 p-3 rounded-lg text-sm text-green-800"
                  >
                    {success}
                  </motion.div>
                )}
              </AnimatePresence>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={signInData.email}
                      onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                      placeholder="email@whispr.fun"
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div className="relative">
                    <Label>Password</Label>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={signInData.password}
                      onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                      placeholder="••••••••"
                      required
                      className="rounded-xl pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-8"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  <Button type="submit" className="w-full bg-pink-500 text-white rounded-xl">
                    {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Let me in'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                      placeholder="email@whispr.fun"
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <Label>Password</Label>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                      placeholder="Create something strong"
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <Label>Confirm Password</Label>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={signUpData.confirmPassword}
                      onChange={(e) =>
                        setSignUpData({ ...signUpData, confirmPassword: e.target.value })
                      }
                      placeholder="Type it again"
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-pink-500 text-white rounded-xl">
                    {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Create account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            <p className="text-xs text-center text-gray-500 mt-4">
              You stay anonymous. We just keep things tidy.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
