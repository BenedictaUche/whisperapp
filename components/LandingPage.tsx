'use client'

import React from 'react'
import { EarIcon, Sparkles, Shield, MapPin, Users } from 'lucide-react'
import { Button } from './ui/button'
import { motion } from 'framer-motion'

interface LandingPageProps {
  onGetStarted: () => void
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/10 via-transparent to-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Grid overlay */}
      <div
  className="absolute inset-0 opacity-40"
  style={{
    backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.03\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"1\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
  }}
></div>


      {/* Header */}
      <div className="relative z-10 flex justify-between items-center p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="p-3 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-xl flex items-center justify-center shadow-2xl">
            <EarIcon className="w-6 h-6 text-primary" />
          </div>
          <span className="text-white font-bold text-2xl tracking-wide">WhisperMap</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Button
            onClick={onGetStarted}
            className="bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-background text-foreground px-6 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Get Started
          </Button>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[80vh] px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-primary" />
                <p className="text-primary text-sm font-medium tracking-wider uppercase">
                  WHISPERMAP
                </p>
              </motion.div>

              <div className="space-y-2">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-white text-4xl lg:text-5xl xl:text-6xl font-black leading-tight"
                >
                  Share <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">secrets</span>
                </motion.h1>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-white text-4xl lg:text-5xl xl:text-6xl font-black leading-tight"
                >
                  Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-primary">stories</span>
                </motion.h1>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-white text-4xl lg:text-5xl xl:text-6xl font-black leading-tight"
                >
                  Stay <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-primary">anonymous</span>
                </motion.h1>
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-white/80 text-lg leading-relaxed max-w-lg"
            >
              Connect with your community through anonymous location-based whispers.
              Share thoughts, discover stories, and explore what&apos;s happening around you.
            </motion.p>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-4 py-4"
            >
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm text-white/90">100% Anonymous</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-white/90">Location-Based</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm text-white/90">Community Driven</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-500/90 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden group"
              >
                <span className="relative z-10">Start Whispering</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right side - Futuristic visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Glassmorphism card with floating elements */}
            <div className="relative">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
              >
                {/* Floating geometric shapes */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/30 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-cyan-400/30 rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }}></div>

                <div className="relative z-10 space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <EarIcon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-white text-2xl font-bold mb-2">Anonymous Connection</h3>
                    <p className="text-white/80 text-sm leading-relaxed">
                      Share your thoughts freely without fear of judgment. Your identity stays protected.
                    </p>
                  </motion.div>

                  {/* Interactive elements */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                      <MapPin className="w-6 h-6 text-primary mb-2" />
                      <p className="text-white text-sm font-medium">Location-Based</p>
                      <p className="text-white/60 text-xs">Nearby whispers only</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                      <Shield className="w-6 h-6 text-cyan-400 mb-2" />
                      <p className="text-white text-sm font-medium">Privacy First</p>
                      <p className="text-white/60 text-xs">Zero tracking</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Floating particles */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: Math.random() * 200 - 100,
                      y: Math.random() * 200 - 100
                    }}
                    transition={{
                      duration: 3,
                      delay: i * 0.5,
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                    className="absolute w-2 h-2 bg-primary/40 rounded-full"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${20 + i * 10}%`
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
    </div>
  )
}

export default LandingPage
