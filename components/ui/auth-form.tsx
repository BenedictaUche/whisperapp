'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs'
import { Eye, EyeOff, AlertTriangle, Loader2, EarIcon, User } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface AuthFormProps {
  onSuccess: () => void
}

export const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('signin')

  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    avatar: '',
  })

  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  })

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) return

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (signUpData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    try {
      // Store selected avatar temporarily for profile creation
      if (signUpData.avatar) {
        sessionStorage.setItem('selectedAvatar', signUpData.avatar)
      }

      const { error } = await supabase.auth.signUp({
        email: signUpData.email,
        password: signUpData.password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      })

      if (error) throw error

      setSuccess('Check your email to confirm your account')
      setSignUpData({ email: '', password: '', confirmPassword: '', avatar: '' })
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) return

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: signInData.email,
        password: signInData.password,
      })

      if (error) throw error

      onSuccess()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.03\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"1\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
        }}
      ></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="text-center pb-4 pt-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-br from-primary to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <EarIcon className="w-8 h-8 text-white" />
            </motion.div>
            <CardTitle className="text-3xl font-bold text-white">WhisperMap</CardTitle>
            <CardDescription className="text-white/80 text-sm">
              Connect anonymously, share freely
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">
              <TabsList className="grid grid-cols-2 bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20">
                <TabsTrigger
                  value="signin"
                  className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-md text-sm rounded-full px-4 py-2 text-white/80 data-[state=active]:text-slate-900 transition-all duration-200"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-md text-sm rounded-full px-4 py-2 text-white/80 data-[state=active]:text-slate-900 transition-all duration-200"
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
                    <Label className="text-white/90">Email</Label>
                    <Input
                      type="email"
                      value={signInData.email}
                      onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                      className="rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary"
                    />
                  </div>
                  <div className="relative">
                    <Label className="text-white/90">Password</Label>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={signInData.password}
                      onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                      placeholder="••••••••"
                      required
                      className="rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-8 text-white/70 hover:text-white hover:bg-white/10"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-500/90 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="animate-spin w-4 h-4" />
                        Signing in...
                      </div>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <Label className="text-white/90">Email</Label>
                    <Input
                      type="email"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                      className="rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary"
                    />
                  </div>
                  <div>
                    <Label className="text-white/90">Password</Label>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                      placeholder="Create a strong password"
                      required
                      className="rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary"
                    />
                  </div>
                  <div>
                    <Label className="text-white/90">Confirm Password</Label>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={signUpData.confirmPassword}
                      onChange={(e) =>
                        setSignUpData({ ...signUpData, confirmPassword: e.target.value })
                      }
                      placeholder="Confirm your password"
                      required
                      className="rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary"
                    />
                  </div>
                  <div>
                    <Label className="text-white/90">Choose Avatar (Optional)</Label>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      <button
                        type="button"
                        onClick={() => setSignUpData({ ...signUpData, avatar: '/assets/images/anonymous-man.jpg' })}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                          signUpData.avatar === '/assets/images/anonymous-man.jpg'
                            ? 'border-primary bg-primary/20'
                            : 'border-white/20 bg-white/10 hover:border-white/40'
                        }`}
                      >
                        <img
                          src="/assets/images/anonymous-man.jpg"
                          alt="Anonymous Man"
                          className="w-12 h-12 rounded-full mx-auto mb-2"
                        />
                        <span className="text-xs text-white/80">Man</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSignUpData({ ...signUpData, avatar: '/assets/images/anonymous-woman.png' })}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                          signUpData.avatar === '/assets/images/anonymous-woman.png'
                            ? 'border-primary bg-primary/20'
                            : 'border-white/20 bg-white/10 hover:border-white/40'
                        }`}
                      >
                        <img
                          src="/assets/images/anonymous-woman.png"
                          alt="Anonymous Woman"
                          className="w-12 h-12 rounded-full mx-auto mb-2"
                        />
                        <span className="text-xs text-white/80">Woman</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSignUpData({ ...signUpData, avatar: '' })}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                          signUpData.avatar === ''
                            ? 'border-primary bg-primary/20'
                            : 'border-white/20 bg-white/10 hover:border-white/40'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full mx-auto mb-2 bg-white/20 flex items-center justify-center">
                          <User className="w-6 h-6 text-white/60" />
                        </div>
                        <span className="text-xs text-white/80">Skip</span>
                      </button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-500/90 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="animate-spin w-4 h-4" />
                        Creating account...
                      </div>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            <p className="text-xs text-center text-white/60 mt-6 px-4">
              Your privacy is our priority. All data is encrypted and anonymous.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
