// Voice recording and processing utilities

export const startVoiceRecording = async (): Promise<MediaRecorder | null> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mediaRecorder = new MediaRecorder(stream)
    return mediaRecorder
  } catch (error) {
    console.error('Error accessing microphone:', error)
    return null
  }
}

export const stopVoiceRecording = (mediaRecorder: MediaRecorder): Promise<Blob> => {
  return new Promise((resolve) => {
    const chunks: BlobPart[] = []
    
    mediaRecorder.ondataavailable = (event) => {
      chunks.push(event.data)
    }
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' })
      resolve(blob)
    }
    
    mediaRecorder.stop()
    mediaRecorder.stream.getTracks().forEach(track => track.stop())
  })
}

export const applyVoiceDistortion = (audioBlob: Blob): Promise<Blob> => {
  return new Promise((resolve) => {
    const audioContext = new AudioContext()
    const reader = new FileReader()
    
    reader.onload = async () => {
      try {
        const arrayBuffer = reader.result as ArrayBuffer
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
        
        // Apply simple pitch shift for voice distortion
        const offlineContext = new OfflineAudioContext(
          audioBuffer.numberOfChannels,
          audioBuffer.length,
          audioBuffer.sampleRate
        )
        
        const source = offlineContext.createBufferSource()
        source.buffer = audioBuffer
        source.playbackRate.value = 0.8 // Lower pitch for anonymity
        
        const gainNode = offlineContext.createGain()
        gainNode.gain.value = 0.7 // Reduce volume slightly
        
        source.connect(gainNode)
        gainNode.connect(offlineContext.destination)
        source.start()
        
        const renderedBuffer = await offlineContext.startRendering()
        
        // Convert back to blob (simplified - in production use proper encoding)
        resolve(audioBlob) // For now, return original blob
      } catch (error) {
        console.error('Voice distortion failed:', error)
        resolve(audioBlob)
      }
    }
    
    reader.readAsArrayBuffer(audioBlob)
  })
}

export const uploadVoiceFile = async (audioBlob: Blob): Promise<string | null> => {
  // In a real implementation, upload to Supabase Storage or similar
  // For now, return a mock URL
  return `voice_${Date.now()}.webm`
}