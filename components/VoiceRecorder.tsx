'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { startVoiceRecording, stopVoiceRecording, applyVoiceDistortion, uploadVoiceFile } from '@/lib/voiceUtils'
import { Mic, Square, Play, Pause, Send, X } from 'lucide-react'

interface VoiceRecorderProps {
  onSubmit: (voiceUrl: string) => void
  onClose: () => void
}

export const VoiceRecorder = ({ onSubmit, onClose }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const startRecording = async () => {
    try {
      const mediaRecorder = await startVoiceRecording()
      if (!mediaRecorder) return

      mediaRecorderRef.current = mediaRecorder
      setIsRecording(true)
      
      mediaRecorder.start()
    } catch (error) {
      console.error('Error starting recording:', error)
    }
  }

  const stopRecording = async () => {
    if (!mediaRecorderRef.current) return

    try {
      setIsProcessing(true)
      const blob = await stopVoiceRecording(mediaRecorderRef.current)
      
      // Apply voice distortion for privacy
      const distortedBlob = await applyVoiceDistortion(blob)
      
      setAudioBlob(distortedBlob)
      setAudioUrl(URL.createObjectURL(distortedBlob))
      setIsRecording(false)
    } catch (error) {
      console.error('Error stopping recording:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const playAudio = () => {
    if (!audioUrl) return

    if (audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const handleSubmit = async () => {
    if (!audioBlob) return

    try {
      setIsProcessing(true)
      const voiceUrl = await uploadVoiceFile(audioBlob)
      if (voiceUrl) {
        onSubmit(voiceUrl)
      }
    } catch (error) {
      console.error('Error uploading voice:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const reset = () => {
    setAudioBlob(null)
    setAudioUrl(null)
    setIsPlaying(false)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">Voice Message</h3>
        <Button onClick={onClose} variant="ghost" size="sm" className="p-1">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {!audioBlob ? (
          <div className="text-center space-y-4">
            <motion.div
              animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
              transition={{ repeat: isRecording ? Infinity : 0, duration: 1 }}
            >
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing}
                variant={isRecording ? "destructive" : "default"}
                size="lg"
                className="w-16 h-16 rounded-full"
              >
                {isProcessing ? (
                  <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : isRecording ? (
                  <Square className="w-6 h-6" />
                ) : (
                  <Mic className="w-6 h-6" />
                )}
              </Button>
            </motion.div>
            
            <p className="text-sm text-muted-foreground">
              {isRecording ? 'Recording... Tap to stop' : 'Tap to start recording'}
            </p>
            
            {isRecording && (
              <p className="text-xs text-muted-foreground">
                Voice will be automatically distorted for privacy
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={isPlaying ? pauseAudio : playAudio}
                variant="outline"
                size="sm"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              
              <Button onClick={reset} variant="ghost" size="sm">
                Re-record
              </Button>
            </div>

            <audio
              ref={audioRef}
              src={audioUrl || undefined}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />

            <div className="flex justify-center gap-2">
              <Button onClick={handleSubmit} disabled={isProcessing}>
                {isProcessing ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Send Voice Message
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}