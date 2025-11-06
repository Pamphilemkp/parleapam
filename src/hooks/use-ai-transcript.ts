'use client';

import { useEffect, useRef, useState } from 'react';
import type { Call } from '@stream-io/video-react-sdk';

interface UseAITranscriptOptions {
  call?: Call;
  agentId?: string;
  onTranscript?: (text: string) => void;
  onTeachingCommand?: (command: string) => void;
}

/**
 * Hook to listen for AI agent transcriptions and detect teaching/demonstration commands
 */
export function useAITranscript({ 
  call, 
  agentId, 
  onTranscript,
  onTeachingCommand 
}: UseAITranscriptOptions) {
  const [lastTranscript, setLastTranscript] = useState<string>('');
  const transcriptBufferRef = useRef<string[]>([]);

  useEffect(() => {
    if (!call || !agentId) return;

    // Teaching/demonstration keywords that should trigger whiteboard
    const teachingKeywords = [
      'demonstrate', 'demonstration', 'show', 'draw', 'explain visually',
      'formula', 'equation', 'diagram', 'graph', 'chart', 'illustrate',
      'let me show', 'let me draw', 'let me demonstrate', 'i\'ll show',
      'on the whiteboard', 'on the board', 'visual explanation',
      'physical example', 'chemical formula', 'mathematical', 'calculate',
      'step by step', 'visualize', 'sketch', 'plot'
    ];

    // Check for teaching commands in transcript
    const checkForTeachingCommands = (text: string) => {
      const lowerText = text.toLowerCase();
      const hasTeachingKeyword = teachingKeywords.some(keyword => 
        lowerText.includes(keyword)
      );

      if (hasTeachingKeyword && onTeachingCommand) {
        onTeachingCommand(text);
      }
    };

    // Enhanced transcript detection: Also listen to user speech via browser Speech Recognition
    // This allows the AI to respond to user commands like "demonstrate X" or "show me Y"
    const setupSpeechRecognition = (): SpeechRecognition | null => {
      if (typeof window === 'undefined') return null;
      
      const SpeechRecognitionCtor = (window as WindowWithSpeechRecognition).webkitSpeechRecognition || 
                                     (window as WindowWithSpeechRecognition).SpeechRecognition;
      
      if (!SpeechRecognitionCtor) return null;
      
      const recognition = new SpeechRecognitionCtor();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join(' ');
        
        if (transcript && transcript.trim().length > 0) {
          // Check if user is asking for demonstration
          const lowerText = transcript.toLowerCase();
          if (lowerText.includes('demonstrate') || lowerText.includes('show me') || 
              lowerText.includes('explain') || lowerText.includes('draw') ||
              lowerText.includes('formula') || lowerText.includes('diagram')) {
            // Trigger whiteboard command
            if (onTeachingCommand) {
              onTeachingCommand(transcript);
            }
          }
        }
      };
      
      recognition.onerror = () => {
        // Silently fail - speech recognition is optional
      };
      
      try {
        recognition.start();
      } catch {
        // Speech recognition may not be available
      }
      
      return recognition;
    };
    
    interface WindowWithSpeechRecognition extends Window {
      webkitSpeechRecognition?: typeof SpeechRecognition;
      SpeechRecognition?: typeof SpeechRecognition;
    }
    
    const recognition = setupSpeechRecognition();

    // Listen for transcript events from window (triggered by webhook/OpenAI Realtime)
    const handleTranscriptEvent = (e: CustomEvent<{ text: string; userId?: string }>) => {
      if (e.detail.userId === agentId && e.detail.text) {
        const newText = e.detail.text.trim();
        
        // Avoid duplicate processing
        if (newText !== lastTranscript && newText.length > 0) {
          setLastTranscript(newText);
          transcriptBufferRef.current.push(newText);
          
          // Keep only last 10 transcripts
          if (transcriptBufferRef.current.length > 10) {
            transcriptBufferRef.current.shift();
          }

          // Call transcript callback
          if (onTranscript) {
            onTranscript(newText);
          }

          // Check for teaching commands
          checkForTeachingCommands(newText);
        }
      }
    };

    window.addEventListener('ai-transcript', handleTranscriptEvent as EventListener);

    return () => {
      window.removeEventListener('ai-transcript', handleTranscriptEvent as EventListener);
      if (recognition) {
        try {
          recognition.stop();
        } catch {
          // Ignore errors on cleanup
        }
      }
    };
  }, [call, agentId, lastTranscript, onTranscript, onTeachingCommand]);

  return {
    lastTranscript,
    transcriptHistory: transcriptBufferRef.current,
  };
}

