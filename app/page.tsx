'use client'

import { useEffect, useState, Suspense, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { AuthForm } from '@/components/ui/auth-form'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { FloatingActionButton } from '@/components/ui/floating-action-button'
import { Header } from '@/components/Header'
import { WhisperForm, CompactWhisperForm } from '@/components/WhisperForm'
import { WhisperList } from '@/components/WhisperList'
import { UserBadges } from '@/components/UserBadges'
import { LocationRadiusControl } from '@/components/LocationRadiusControl'
import { useLocation } from '@/hooks/useLocation'
import { useWhispers } from '@/hooks/useWhispers'
import { useUserProfile } from '@/hooks/useUserProfile'
import { checkAuthStatus } from '@/lib/auth'
import { requestNotificationPermission } from '@/lib/notifications'
import { Map, List, AlertCircle, Plus, Edit3, EarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { reportReasons, type ReportReason } from '@/lib/contentModeration'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import Image from 'next/image'
import LandingPage from '@/components/LandingPage'
import Sidebar from '@/components/Sidebar'

// Dynamic import for MapView to avoid SSR issues
const MapView = dynamic(() => import('@/components/MapView').then(mod => ({ default: mod.MapView })), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-muted/50 rounded-xl">
      <LoadingSpinner text="Loading map..." />
    </div>
  )
})

export default function Home() {
  const [view, setView] = useState<'map' | 'list'>('list')
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [showAuthForm, setShowAuthForm] = useState(false)
  const [locationRadius, setLocationRadius] = useState(5)
  const [incognitoMode, setIncognitoMode] = useState(false)
  const [showWhisperForm, setShowWhisperForm] = useState(false)
  const [reportDialog, setReportDialog] = useState<{ open: boolean; whisperId?: string }>({ open: false })
  const [reportReason, setReportReason] = useState<ReportReason>('Spam or unwanted content')
  const [reportDescription, setReportDescription] = useState('')
  const [activeMenuItem, setActiveMenuItem] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { location, error: locationError, loading: locationLoading, refreshLocation } = useLocation()
  const { profile } = useUserProfile()
  const { whispers, loading: whispersLoading, createWhisper, deleteWhisper, refreshWhispers, currentUserId } = useWhispers(
    location?.latitude,
    location?.longitude,
    locationRadius
  )

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await checkAuthStatus()
        setUser(session?.user || null)
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setAuthLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setUser(session?.user || null)
          if (session?.user) {
            requestNotificationPermission()
          }
        }
      )

      return () => subscription.unsubscribe()
    }
  }, [])

  // Update radius and incognito mode from user profile
  useEffect(() => {
    if (profile?.preferences) {
      setLocationRadius(profile.preferences.location_radius)
      setIncognitoMode(profile.preferences.incognito_mode)
    }
  }, [profile])

  const handleCreateWhisper = async (data: { text?: string; voice_url?: string; category_id?: string }) => {
    try {
      await createWhisper(data)
      setShowWhisperForm(false)
    } catch (error) {
      console.error('Error creating whisper:', error)
    }
  }

  const handleReportWhisper = useCallback((whisperId: string) => {
    setReportDialog({ open: true, whisperId })
  }, [])

  const submitReport = async () => {
    // In a real implementation, submit to abuse_reports table
    console.log('Report submitted:', {
      whisperId: reportDialog.whisperId,
      reason: reportReason,
      description: reportDescription
    })

    setReportDialog({ open: false })
    setReportReason('Spam or unwanted content')
    setReportDescription('')
  }

  const handleSignOut = () => {
    setUser(null)
  }

  const handleAuthSuccess = () => {
    setShowAuthForm(false)
    // Auth state will be updated by the listener
  }

  const handleGetStarted = () => {
    setShowAuthForm(true)
  }

  // Show loading screen while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <LoadingSpinner text="Initializing WhisperMap..." />
      </div>
    )
  }

  // Show landing page if not authenticated and auth form not requested
  if (!user && !showAuthForm) {
    return <LandingPage onGetStarted={handleGetStarted} />
  }

  // Show auth form if not authenticated and auth form was requested
  if (!user && showAuthForm) {
    return <AuthForm onSuccess={handleAuthSuccess} />
  }

  // Show location error
  if (locationError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
        <Header user={user} onSignOut={handleSignOut} />
        <div className="max-w-2xl mx-auto pt-8">
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Location access is required to find nearby whispers. Please enable location services and refresh the page.
            </AlertDescription>
          </Alert>

          <div className="text-center">
            <Button onClick={refreshLocation} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Show location loading
  if (locationLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-6xl"
          >
            📍
          </motion.div>
          <LoadingSpinner text="Getting your location..." />
        </div>
      </div>
    )
  }

  // Responsive layout logic
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024
  const showSidebar = !isMobile

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onSignOut={handleSignOut} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-6">
        <div className={`grid gap-6 ${showSidebar ? 'lg:grid-cols-4' : 'grid-cols-1'}`}>
          {/* Main Content */}

          <div className={`${showSidebar ? 'lg:col-span-3' : 'col-span-1'} space-y-6`}>
            {/* Desktop Whisper Form */}
            {!isMobile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <WhisperForm
                  onSubmit={handleCreateWhisper}
                  userLocation={location}
                />
              </motion.div>
            )}

            {/* View Toggle */}
            <div className="flex justify-center">
              <div className="bg-muted p-1 rounded-lg flex gap-1">
                <Button
                  onClick={() => setView('list')}
                  variant={view === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">List</span>
                </Button>
                <Button
                  onClick={() => setView('map')}
                  variant={view === 'map' ? 'default' : 'ghost'}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Map className="w-4 h-4" />
                  <span className="hidden sm:inline">Map</span>
                </Button>
              </div>
            </div>

            {/* Content Area */}
            <motion.div
              layout
              className="min-h-[400px]"
            >
              {view === 'map' && location ? (
                <div className="h-96 lg:h-[500px] rounded-xl overflow-hidden border border-border">
                  <Suspense fallback={
                    <div className="h-full bg-muted rounded-xl">
                      <LoadingSpinner text="Loading map..." />
                    </div>
                  }>
                    <MapView
                      userLat={location.latitude}
                      userLon={location.longitude}
                      whispers={whispers}
                      className="h-full"
                      currentUserId={currentUserId}
                      onDeleteWhisper={deleteWhisper}
                    />
                  </Suspense>
                </div>
              ) : (
                <WhisperList
                  whispers={whispers}
                  loading={whispersLoading}
                  onRefresh={refreshWhispers}
                  currentUserId={currentUserId}
                  onDeleteWhisper={deleteWhisper}
                  onReportWhisper={handleReportWhisper}
                />
              )}
            </motion.div>
          </div>

          {/* Sidebar - Desktop Only */}
          {showSidebar && (
            <div className="lg:col-span-1 space-y-6">
              <UserBadges />

              <Sidebar
        activeItem={activeMenuItem}
        onItemClick={setActiveMenuItem}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

              {/* <LocationRadiusControl
                onRadiusChange={setLocationRadius}
                onIncognitoToggle={setIncognitoMode}
              /> */}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Floating Action Button */}
      {isMobile && (
        <FloatingActionButton
          onClick={() => setShowWhisperForm(true)}
          icon={<Edit3 className="w-6 h-6" />}
        />
      )}

      {/* Mobile Whisper Form Dialog */}
      <Dialog open={showWhisperForm} onOpenChange={setShowWhisperForm}>
        <DialogContent className="sm:max-w-md p-0 gap-0">
          <CompactWhisperForm
            onSubmit={handleCreateWhisper}
            userLocation={location}
            onClose={() => setShowWhisperForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Report Dialog */}
      <Dialog open={reportDialog.open} onOpenChange={(open) => setReportDialog({ open })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Report Inappropriate Content</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Reason for reporting</label>
              <Select value={reportReason} onValueChange={(value: ReportReason) => setReportReason(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reportReasons.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Additional details (optional)</label>
              <Textarea
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="Provide more context about why you're reporting this content..."
                className="min-h-[80px]"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                onClick={() => setReportDialog({ open: false })}
                variant="outline"
              >
                Cancel
              </Button>
              <Button onClick={submitReport} variant="destructive">
                Submit Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
