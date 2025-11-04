'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export function VoiceInput({ onTranscript, disabled }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Check for browser support
  const isSpeechRecognitionSupported = 
    typeof window !== 'undefined' && 
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      // Try browser speech recognition first (more accurate, real-time)
      if (isSpeechRecognitionSupported) {
        // Type-safe access to SpeechRecognition constructors
        const WebkitSpeechRecognition = (window as unknown as { webkitSpeechRecognition?: { new (): SpeechRecognition } }).webkitSpeechRecognition;
        const StandardSpeechRecognition = (window as unknown as { SpeechRecognition?: { new (): SpeechRecognition } }).SpeechRecognition;
        const SpeechRecognitionCtor = WebkitSpeechRecognition || StandardSpeechRecognition;
        
        if (!SpeechRecognitionCtor) {
          // Fallback if constructor is unavailable
          await startAudioRecording();
          return;
        }
        const recognition = new SpeechRecognitionCtor();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        let finalTranscript = '';

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }

          // Update in real-time for better UX
          if (interimTranscript) {
            // You could show interim results in UI here
          }
        };

        recognition.onend = () => {
          if (finalTranscript.trim()) {
            onTranscript(finalTranscript.trim());
            toast.success('Voice instructions captured!');
          }
          setIsRecording(false);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          toast.error('Speech recognition failed. Trying audio recording...');
          // Fallback to audio recording
          startAudioRecording();
        };

        recognitionRef.current = recognition;
        recognition.start();
        setIsRecording(true);
        toast.success('Listening... Speak your instructions');
      } else {
        // Fallback to audio recording
        startAudioRecording();
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording. Please check microphone permissions.');
    }
  };

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        
        // Convert audio to text using OpenAI Whisper API
        if (audioChunksRef.current.length > 0) {
          await processAudioRecording();
        }
        setIsRecording(false);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      toast.success('Recording... Speak your instructions');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Microphone access denied. Please enable microphone permissions.');
      setIsRecording(false);
    }
  };

  const processAudioRecording = async () => {
    setIsProcessing(true);
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      // Convert to base64 for API
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        
        // Call your API endpoint to transcribe
        const response = await fetch('/api/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audio: base64Audio }),
        });

        if (!response.ok) {
          throw new Error('Transcription failed');
        }

        const data = await response.json();
        if (data.text) {
          onTranscript(data.text);
          toast.success('Voice instructions transcribed!');
        } else {
          toast.error('No speech detected. Please try again.');
        }
      };
    } catch (error) {
      console.error('Error processing audio:', error);
      toast.error('Failed to transcribe audio. Please try typing instead.');
    } finally {
      setIsProcessing(false);
      audioChunksRef.current = [];
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    
    setIsRecording(false);
  };

  const handleToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleToggle}
      disabled={disabled || isProcessing}
      className="gap-2"
    >
      {isProcessing ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : isRecording ? (
        <>
          <MicOff className="h-4 w-4 text-destructive" />
          Stop Recording
        </>
      ) : (
        <>
          <Mic className="h-4 w-4" />
          Record Voice
        </>
      )}
    </Button>
  );
}

