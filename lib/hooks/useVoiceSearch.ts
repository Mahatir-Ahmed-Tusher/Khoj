import { useState, useRef, useCallback } from 'react'

// Extend Window interface for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

interface UseVoiceSearchReturn {
  isRecording: boolean
  isListening: boolean
  error: string | null
  startVoiceSearch: () => Promise<void>
  stopVoiceSearch: () => void
  isSupported: boolean
}

export const useVoiceSearch = (): UseVoiceSearchReturn => {
  const [isRecording, setIsRecording] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // Check if browser supports speech recognition
  const isSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  const requestMicrophonePermission = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      // Stop the stream immediately as we just needed permission
      stream.getTracks().forEach(track => track.stop())
      return true
    } catch (err) {
      console.error('Microphone permission denied:', err)
      setError('মাইক্রোফোনের অনুমতি প্রয়োজন। অনুগ্রহ করে অনুমতি দিন।')
      return false
    }
  }, [])

  const startVoiceSearch = useCallback(async () => {
    if (!isSupported) {
      setError('আপনার ব্রাউজার ভয়েস সার্চ সাপোর্ট করে না।')
      return
    }

    try {
      setError(null)
      setIsRecording(true)

      // Request microphone permission first
      const hasPermission = await requestMicrophonePermission()
      if (!hasPermission) {
        setIsRecording(false)
        return
      }

      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognitionRef.current = recognition

      // Configure recognition
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'bn-BD' // Bengali language
      recognition.maxAlternatives = 1

      // Handle recognition start
      recognition.onstart = () => {
        setIsListening(true)
        console.log('🎤 Voice recognition started')
      }

      // Handle recognition result
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        console.log('🎤 Voice result:', transcript)
        
        // Dispatch custom event with the transcript
        const voiceSearchEvent = new CustomEvent('voiceSearchResult', {
          detail: { transcript }
        })
        window.dispatchEvent(voiceSearchEvent)
      }

      // Handle recognition end
      recognition.onend = () => {
        setIsRecording(false)
        setIsListening(false)
        console.log('🎤 Voice recognition ended')
      }

      // Handle recognition error
      recognition.onerror = (event) => {
        console.error('🎤 Voice recognition error:', event.error)
        setIsRecording(false)
        setIsListening(false)
        
        switch (event.error) {
          case 'no-speech':
            setError('কোনো কথা শোনা যায়নি। আবার চেষ্টা করুন।')
            break
          case 'audio-capture':
            setError('মাইক্রোফোন পাওয়া যায়নি।')
            break
          case 'not-allowed':
            setError('মাইক্রোফোনের অনুমতি দেওয়া হয়নি।')
            break
          case 'network':
            setError('নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।')
            break
          default:
            setError('ভয়েস রেকগনিশনে সমস্যা হয়েছে। আবার চেষ্টা করুন।')
        }
      }

      // Start recognition
      recognition.start()

    } catch (err) {
      console.error('Voice search error:', err)
      setError('ভয়েস সার্চ শুরু করতে সমস্যা হয়েছে।')
      setIsRecording(false)
      setIsListening(false)
    }
  }, [isSupported, requestMicrophonePermission])

  const stopVoiceSearch = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsRecording(false)
    setIsListening(false)
    setError(null)
  }, [])

  return {
    isRecording,
    isListening,
    error,
    startVoiceSearch,
    stopVoiceSearch,
    isSupported
  }
}
