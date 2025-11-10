import React from 'react'
import { EarIcon } from 'lucide-react'
import { Button } from './ui/button'
import { motion } from 'framer-motion'
import Image from 'next/image'

const LandingPage = ({ onGetStarted }: { onGetStarted: () => void }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#33a7d6] via-[#dce9f7] to-[#349bc6] relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-pink-500/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Header */}
            <div className="relative z-10 flex justify-between items-center p-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                        <EarIcon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-bold text-xl tracking-wide" style={{ fontFamily: '"Space Grotesk", "Inter", sans-serif' }}>whispr</span>
                </div>
                <Button
                    onClick={onGetStarted}
                    className="bg-[#2f2f2f] border border-white/20 px-6 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105"
                >
                    Get Started
                </Button>
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
                        <div className="space-y-4">
                            <p className="text-pink-300 text-lg font-medium tracking-wider uppercase" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                                whispr
                            </p>
                            <div className="space-y-3">
                                <h1 className="text-white text-5xl lg:text-6xl font-black leading-tight" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                                    Latest <span className="text-pink-400">gists</span>.
                                </h1>
                                <h1 className="text-white text-5xl lg:text-6xl font-black leading-tight" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                                    Juiciest <span className="text-purple-400">gossips</span>.
                                </h1>
                                <h1 className="text-white text-5xl lg:text-6xl font-black leading-tight" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                                    From <span className="text-cyan-400">anywhere</span>.
                                </h1>
                            </div>
                        </div>

                        <p className="text-white/70 text-lg leading-relaxed max-w-md" style={{ fontFamily: '"Inter", sans-serif' }}>
                            Share secrets, spill tea, and discover what's happening around you—all completely anonymous.
                        </p>

                        <Button
                            onClick={onGetStarted}
                            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-10 py-4 rounded-full font-bold text-lg shadow-2xl transition-all duration-300 relative overflow-hidden"
                            style={{ fontFamily: '"Space Grotesk", sans-serif' }}
                        >
                            Start Whispering Now
                        </Button>
                    </motion.div>

                    {/* Right side - Hero image with better overlay */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >


                        {/* Image container */}
                        <div className="relative overflow-hidden">
                            <Image
                                src="./assets/images/anonymous-woman.png"
                                alt="Anonymous person"
                                width={600}
                                height={800}
                                className="object-cover w-full h-[600px] opacity-90"
                            />

                            {/* Text overlay with better positioning and contrast */}
                            <div className="absolute inset-0 z-20 flex flex-col justify-center items-end pr-8 text-right space-y-2">
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-white text-6xl lg:text-7xl font-black leading-none drop-shadow-2xl"
                                    style={{
                                        fontFamily: '"Space Grotesk", sans-serif',
                                        textShadow: '0 0 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6), 2px 2px 4px rgba(0,0,0,0.9)'
                                    }}
                                >
                                    The only
                                </motion.h2>
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                    className="text-pink-200 text-5xl lg:text-6xl font-black leading-none drop-shadow-2xl"
                                    style={{
                                        fontFamily: '"Space Grotesk", sans-serif',
                                        textShadow: '0 0 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6), 2px 2px 4px rgba(0,0,0,0.9)'
                                    }}
                                >
                                    place to talk
                                </motion.h2>
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.9 }}
                                    className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 text-6xl lg:text-7xl font-black leading-none"
                                    style={{
                                        fontFamily: '"Space Grotesk", sans-serif',
                                        filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.8)) drop-shadow(2px 2px 4px rgba(0,0,0,0.9))'
                                    }}
                                >
                                    Anonymously.
                                </motion.h2>
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
