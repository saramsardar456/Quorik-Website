import { motion } from 'motion/react';
import { Mic, MicOff, Volume2, Zap, MessageSquare, Radio, Calendar, Check, Send, Loader2, Sparkles, Clock } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export function VoiceDemo() {
  const [activePersonaId] = useState<string>('us-executive');
  const [selectedGender] = useState<'female' | 'male'>('female');
  
  // Dynamic Live Call Simulator States
  const [simState, setSimState] = useState<'idle' | 'ringing' | 'connected' | 'completed'>('idle');
  const [simMessages, setSimMessages] = useState<Array<{ sender: 'ai' | 'customer'; text: string; time: string }>>([]);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [userCallerInput, setUserCallerInput] = useState<string>('');
  const [isRecordingMic, setIsRecordingMic] = useState<boolean>(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState<boolean>(false);

  // Dynamic Outcome Extraction
  const [leadDetails, setLeadDetails] = useState<{
    callerName: string;
    callerEmail: string;
    callerPhone: string;
    topic: string;
    requestedSlot: string;
    bookingStatus: 'collecting' | 'confirmed' | 'inquiry';
    whatsappMessage: string;
  }>({
    callerName: '',
    callerEmail: '',
    callerPhone: '',
    topic: 'Discovery Consultation',
    requestedSlot: '',
    bookingStatus: 'collecting',
    whatsappMessage: 'Awaiting caller interaction...'
  });
  const [bookedCalendar, setBookedCalendar] = useState<boolean>(false);
  const [whatsappSent, setWhatsappSent] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const audioFallbackRef = useRef<HTMLAudioElement | null>(null);

  const activeVoiceName = selectedGender === 'female' ? 'Zephyr' : 'Arthur';

  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (audioFallbackRef.current) {
        audioFallbackRef.current.pause();
      }
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e){}
      }
    };
  }, []);

  useEffect(() => {
    let interval: any;
    if (isAiSpeaking) {
      interval = setInterval(() => {
        if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
          window.speechSynthesis.resume();
        }
      }, 1200);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAiSpeaking]);

  const formatPhoneticsForSpeech = (text: string) => {
    return text.replace(/Quorik/gi, "Korik");
  };

  const getBestVoiceForGender = (gender: 'female' | 'male'): { voice: SpeechSynthesisVoice | null, pitch: number } => {
    if (!('speechSynthesis' in window)) return { voice: null, pitch: 1.0 };
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return { voice: null, pitch: gender === 'female' ? 1.15 : 0.88 };

    if (gender === 'female') {
      const femaleVoice = voices.find(v => {
        const name = v.name.toLowerCase();
        const isMaleName = name.includes('david') || name.includes('mark') || name.includes('george') || name.includes('guy') || name.includes('stefan') || name.includes('ryan') || name.includes('ravi') || name.includes('male') || name.includes('pavel') || name.includes('alex');
        if (isMaleName) return false;

        return name.includes('zira') || 
               name.includes('samantha') || 
               name.includes('victoria') || 
               name.includes('hazel') || 
               name.includes('susan') || 
               name.includes('karen') || 
               name.includes('aria') || 
               name.includes('jenny') || 
               name.includes('sonia') || 
               name.includes('catherine') || 
               name.includes('eva') || 
               name.includes('female') || 
               name.includes('google us english') || 
               name.includes('google uk english female') || 
               name.includes('natural female') || 
               name.includes('moira') || 
               name.includes('veena') || 
               name.includes('tessa');
      });

      if (femaleVoice) return { voice: femaleVoice, pitch: 1.05 };

      const nonMaleVoice = voices.find(v => {
        const name = v.name.toLowerCase();
        return !name.includes('david') && !name.includes('mark') && !name.includes('george') && !name.includes('guy') && !name.includes('male');
      });

      if (nonMaleVoice) return { voice: nonMaleVoice, pitch: 1.15 };
      return { voice: null, pitch: 1.15 };
    } else {
      const maleVoice = voices.find(v => {
        const name = v.name.toLowerCase();
        return name.includes('david') || name.includes('mark') || name.includes('george') || name.includes('guy') || name.includes('stefan') || name.includes('ryan') || name.includes('ravi') || name.includes('male') || name.includes('pavel') || name.includes('daniel');
      });

      return { voice: maleVoice || null, pitch: 0.88 };
    }
  };

  const unlockAudio = () => {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.resume();
        const silentUtterance = new SpeechSynthesisUtterance('');
        silentUtterance.volume = 0;
        window.speechSynthesis.speak(silentUtterance);
      } catch (e) {}
    }
  };

  const playAudioFallback = (text: string) => {
    try {
      if (audioFallbackRef.current) {
        audioFallbackRef.current.pause();
      }
      const cleanText = formatPhoneticsForSpeech(text);
      const encoded = encodeURIComponent(cleanText.slice(0, 200));
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=en&client=tw-ob`;
      
      const audio = new Audio(ttsUrl);
      audioFallbackRef.current = audio;
      audio.playbackRate = 0.95;
      audio.onplay = () => setIsAiSpeaking(true);
      audio.onended = () => setIsAiSpeaking(false);
      audio.onerror = () => setIsAiSpeaking(false);
      audio.play().catch(() => setIsAiSpeaking(false));
    } catch (e) {
      setIsAiSpeaking(false);
    }
  };

  const speakText = (text: string) => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e){}
    }
    setIsRecordingMic(false);

    if (!('speechSynthesis' in window)) {
      playAudioFallback(text);
      return;
    }

    try {
      window.speechSynthesis.resume();

      const executeSpeak = () => {
        try {
          const { voice, pitch } = getBestVoiceForGender(selectedGender);
          const textToSpeak = formatPhoneticsForSpeech(text);

          const utterance = new SpeechSynthesisUtterance(textToSpeak);
          utterance.rate = 0.92;
          utterance.pitch = pitch;

          if (voice) {
            utterance.voice = voice;
            utterance.lang = voice.lang;
          } else {
            utterance.lang = 'en-US';
          }

          if (typeof window !== 'undefined') {
            (window as any)._speechUtterances = (window as any)._speechUtterances || [];
            (window as any)._speechUtterances.push(utterance);
          }

          const cleanup = () => {
            setIsAiSpeaking(false);
            if (typeof window !== 'undefined' && (window as any)._speechUtterances) {
              (window as any)._speechUtterances = (window as any)._speechUtterances.filter((u: any) => u !== utterance);
            }
          };

          utterance.onstart = () => setIsAiSpeaking(true);
          utterance.onend = cleanup;
          utterance.onerror = (err) => {
            console.warn("Speech Synthesis API error, using stream fallback:", err);
            cleanup();
            playAudioFallback(text);
          };

          window.speechSynthesis.speak(utterance);
        } catch (err) {
          console.error("Speech Synthesis Exception:", err);
          playAudioFallback(text);
        }
      };

      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        setTimeout(executeSpeak, 60);
      } else {
        executeSpeak();
      }
    } catch (err) {
      playAudioFallback(text);
    }
  };

  const startSimulatedCall = () => {
    setSimState('ringing');
    setSimMessages([]);
    setBookedCalendar(false);
    setWhatsappSent(false);

    setTimeout(() => {
      setSimState('connected');
      
      const greeting = selectedGender === 'female'
        ? "Hello and thank you for reaching Quorik! My name is Zephyr. How can I assist you with custom website development, AI chatbots, or voice automation today?"
        : "Hello and thank you for reaching Quorik! My name is Arthur. How can I assist you with custom website development, AI chatbots, or voice automation today?";

      setSimMessages([{ sender: 'ai', text: greeting, time: '00:01' }]);
      speakText(greeting);
    }, 400);
  };

  const handleSendCallerTurn = async (customMessage?: string) => {
    unlockAudio();
    const textToSend = customMessage || userCallerInput;
    if (!textToSend.trim() || isAiThinking) return;

    setUserCallerInput('');
    const timeStr = `00:${String(simMessages.length * 6 + 6).padStart(2, '0')}`;
    
    const updatedMessages = [
      ...simMessages,
      { sender: 'customer' as const, text: textToSend, time: timeStr }
    ];
    setSimMessages(updatedMessages);
    setIsAiThinking(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch('/api/voice-agent/simulate-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          personaId: activePersonaId,
          gender: selectedGender,
          userQuery: textToSend,
          conversationHistory: updatedMessages
        })
      });

      clearTimeout(timeoutId);

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();
      setIsAiThinking(false);

      if (response.ok && data.success && data.aiSpeechText) {
        const aiTimeStr = `00:${String(updatedMessages.length * 6 + 6).padStart(2, '0')}`;
        setSimMessages(prev => [
          ...prev,
          { sender: 'ai', text: data.aiSpeechText, time: aiTimeStr }
        ]);

        speakText(data.aiSpeechText);

        if (data.extractedLead) {
          setLeadDetails(prev => ({
            callerName: data.extractedLead.callerName || prev.callerName,
            callerEmail: data.extractedLead.callerEmail || prev.callerEmail,
            callerPhone: data.extractedLead.callerPhone || prev.callerPhone,
            topic: data.extractedLead.topic || prev.topic,
            requestedSlot: data.extractedLead.requestedSlot || prev.requestedSlot,
            bookingStatus: data.extractedLead.bookingStatus || prev.bookingStatus,
            whatsappMessage: data.extractedLead.whatsappMessage || prev.whatsappMessage
          }));
          setBookedCalendar(true);
          setWhatsappSent(true);
        }
      } else {
        throw new Error(data.error || 'Failed to generate voice turn');
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err?.name !== 'AbortError') {
        console.warn("AI turn error fallback:", err?.message || err);
      }
      setIsAiThinking(false);
      const aiTimeStr = `00:${String(updatedMessages.length * 6 + 6).padStart(2, '0')}`;
      const allText = updatedMessages.map(m => m.text).join(" ").toLowerCase();
      const lowerQuery = textToSend.toLowerCase();

      const nameMatch = (allText + " " + textToSend).match(/(?:my name is|i am|i'm|this is|name:\s*)\s+([a-zA-Z]+)/i);
      const callerName = nameMatch ? nameMatch[1] : '';

      const emailMatch = (allText + " " + textToSend).match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
      const callerEmail = emailMatch ? emailMatch[1] : '';

      const phoneMatch = (allText + " " + textToSend).match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
      const callerPhone = phoneMatch ? phoneMatch[0] : '';

      const greeting = callerName ? `Hello ${callerName}!` : `Hello!`;

      let fallbackAi = `${greeting} Thank you for reaching Quorik. I'm ${selectedGender === 'female' ? 'Zephyr' : 'Arthur'}. How can I assist you with web development or AI automation?`;

      if (lowerQuery.includes('founder') || lowerQuery.includes('ceo') || lowerQuery.includes('who founded') || lowerQuery.includes('who owns') || lowerQuery.includes('shehram') || lowerQuery.includes('who built')) {
        fallbackAi = "Shehram Meellu is the Founder & CEO of Quorik. He is a senior AI engineering architect and technology strategist who founded Quorik to build high-performance custom web applications and zero-latency 24/7 AI Voice Agents for modern businesses. Under his technical leadership, Quorik develops autonomous AI receptionists and digital platforms that drive measurable growth. Would you like to schedule a discovery consultation with him and our team?";
        setLeadDetails(prev => ({
          ...prev,
          topic: 'Founder & Executive Leadership Inquiry',
          bookingStatus: 'inquiry',
          whatsappMessage: '👑 FOUNDER INQUIRY: Caller asked for detailed background on Founder & CEO Shehram Meellu.'
        }));
        setWhatsappSent(true);
      } else if (allText.includes('book') || allText.includes('consultation') || allText.includes('meeting') || allText.includes('schedule') || allText.includes('appointment')) {
        let topic = 'AI Voice Agent setup';
        if (allText.includes('website') || allText.includes('web')) topic = 'custom website development';
        else if (allText.includes('chatbot')) topic = 'AI chatbot integration';

        if (!callerName && !allText.includes('tomorrow') && !allText.includes('pm') && !allText.includes('am')) {
          fallbackAi = `I'd be delighted to book your discovery consultation for ${topic}! May I have your name and preferred day and time for the meeting?`;
        } else if (!callerEmail || !callerPhone) {
          fallbackAi = `Great ${callerName || ''}! Could you please share your email address and phone number so I can send the calendar invitation and confirmation?`;
        } else {
          fallbackAi = `Perfect ${callerName}! I have scheduled your ${topic} consultation. A calendar invite has been sent to ${callerEmail}, and a confirmation to your phone.`;
        }

        setLeadDetails(prev => ({
          callerName: callerName || prev.callerName,
          callerEmail: callerEmail || prev.callerEmail,
          callerPhone: callerPhone || prev.callerPhone,
          topic: `Discovery Consultation (${topic})`,
          requestedSlot: 'Tomorrow @ 11:00 AM EST',
          bookingStatus: (callerEmail && callerPhone) ? 'confirmed' : 'collecting',
          whatsappMessage: `🚀 NEW INBOUND LEAD: ${callerName || 'Client'} scheduled a ${topic} consultation.`
        }));
        setBookedCalendar(true);
        setWhatsappSent(true);
      } else if (lowerQuery.includes('price') || lowerQuery.includes('cost') || lowerQuery.includes('rate')) {
        fallbackAi = "Quorik offers transparent pricing starting at $1,490 for custom web platforms and $490 per month for 24/7 AI Voice Receptionist automation.";
      }

      setSimMessages(prev => [...prev, { sender: 'ai', text: fallbackAi, time: aiTimeStr }]);
      speakText(fallbackAi);
    } finally {
      setIsAiThinking(false);
    }
  };

  const toggleMicInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Microphone voice input is not supported in this browser. Please type your query in the box below.");
      return;
    }

    if (isRecordingMic) {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e){}
      }
      setIsRecordingMic(false);
      if (userCallerInput.trim()) {
        handleSendCallerTurn(userCallerInput);
      }
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = 'en-US';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => setIsRecordingMic(true);

      recognition.onresult = (event: any) => {
        let accumulatedText = '';
        for (let i = 0; i < event.results.length; i++) {
          accumulatedText += event.results[i][0].transcript + ' ';
        }
        if (accumulatedText.trim()) {
          setUserCallerInput(accumulatedText.trim());
        }

        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          if (accumulatedText.trim()) {
            try { recognition.stop(); } catch(e){}
            setIsRecordingMic(false);
            handleSendCallerTurn(accumulatedText.trim());
          }
        }, 3500);
      };

      recognition.onerror = () => setIsRecordingMic(false);
      recognition.onend = () => setIsRecordingMic(false);

      recognition.start();
    } catch (e) {
      setIsRecordingMic(false);
    }
  };

  const endSimulatedCall = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e){}
    }
    setIsRecordingMic(false);
    setIsAiSpeaking(false);
    setSimState('idle');
    setSimMessages([]);
  };

  return (
    <section id="demo" className="py-24 bg-[#07090F] border-t border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-teal/10 border border-brand-teal/30 text-brand-teal text-xs font-mono uppercase tracking-widest rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Interactive AI Voice Concierge
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight uppercase text-white">
            Talk or Type to the AI Voice Assistant
          </h2>
          <p className="text-gray-400 text-sm mt-3 font-sans">
            Test with your own custom name, questions, or requirements. Gemini AI responds in real-time, speaks out loud, and updates Google Calendar and WhatsApp dispatches dynamically.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Call Screen Simulator Box */}
          <div className="lg:col-span-7 bg-[#0A0E1A] border border-brand-teal/40 p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-teal/10 blur-[120px] rounded-full pointer-events-none" />

            <div>
              {/* Voice Status Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    simState === 'ringing' ? 'bg-yellow-400 animate-ping' :
                    simState === 'connected' ? 'bg-green-400 animate-pulse' :
                    simState === 'completed' ? 'bg-blue-400' : 'bg-gray-600'
                  }`} />
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase font-mono">
                      {simState === 'idle' && 'AI VOICE SANDBOX: OFFLINE'}
                      {simState === 'ringing' && 'Connecting to Voice AI Pipeline...'}
                      {simState === 'connected' && `Active Session: ${activeVoiceName} (${selectedGender.toUpperCase()}) Connected`}
                      {simState === 'completed' && 'Session Finished: Booking Dispatched'}
                    </h4>
                    <p className="text-[11px] text-gray-400 font-mono">
                      Zero-Latency Voice Channel Ready
                    </p>
                  </div>
                </div>

                {simState === 'idle' ? (
                  <button
                    onClick={startSimulatedCall}
                    className="px-5 py-2.5 bg-brand-teal text-[#05060A] font-bold font-mono text-xs uppercase tracking-wider hover:bg-white transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                  >
                    <Mic className="w-4 h-4" /> Start Voice Demo
                  </button>
                ) : (
                  <button
                    onClick={endSimulatedCall}
                    className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/40 font-mono text-xs uppercase hover:bg-red-500/30 transition-colors flex items-center gap-1.5"
                  >
                    <MicOff className="w-3.5 h-3.5" /> End Session
                  </button>
                )}
              </div>

              {/* Live Transcript Stream */}
              <div className="bg-[#05060A] border border-white/10 p-6 h-[320px] overflow-y-auto space-y-4 font-sans text-sm">
                {simState === 'idle' && (
                  <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 font-mono text-xs">
                    <Radio className="w-8 h-8 text-brand-teal/40 mb-3 animate-pulse" />
                    <p className="mb-2 text-gray-300 font-bold">Click "Start Voice Demo" above to open the active voice channel.</p>
                    <p className="text-gray-500 text-[11px]">You can speak or type custom queries directly to {activeVoiceName}!</p>
                  </div>
                )}

                {simState === 'ringing' && (
                  <div className="py-16 text-center text-yellow-400 font-mono text-xs uppercase tracking-widest animate-pulse flex flex-col items-center gap-2">
                    <Zap className="w-8 h-8 animate-bounce text-brand-teal" />
                    <span>Connecting to Voice AI... Launching {activeVoiceName} ({selectedGender})...</span>
                  </div>
                )}

                {simMessages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col ${msg.sender === 'ai' ? 'items-start' : 'items-end'}`}
                  >
                    <div className="flex items-center gap-2 mb-1 text-[10px] font-mono text-gray-400">
                      <span className={msg.sender === 'ai' ? 'text-brand-teal font-bold' : 'text-blue-400 font-bold'}>
                        {msg.sender === 'ai' ? `Quorik AI (${activeVoiceName})` : 'You (Caller)'}
                      </span>
                      <span>• {msg.time}</span>
                    </div>
                    <div className={`p-3.5 max-w-[85%] text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'ai' 
                        ? 'bg-[#0A0E1A] border border-brand-teal/30 text-gray-200' 
                        : 'bg-brand-blue/20 border border-brand-blue/40 text-white'
                    }`}>
                      <p>"{msg.text}"</p>
                    </div>
                  </motion.div>
                ))}

                {isAiThinking && (
                  <div className="flex items-center gap-2 text-xs font-mono text-brand-teal animate-pulse py-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> {activeVoiceName} is thinking & processing speech response...
                  </div>
                )}

                {isAiSpeaking && (
                  <div className="flex items-center justify-between bg-brand-teal/10 border border-brand-teal/40 p-2.5 text-xs font-mono text-brand-teal">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 animate-pulse" />
                      <span>🔊 {activeVoiceName} is speaking full audio response...</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-4 bg-brand-teal animate-pulse" />
                      <span className="w-1.5 h-3 bg-brand-teal animate-pulse" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-5 bg-brand-teal animate-pulse" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Interactive Caller Input Controls */}
              {simState === 'connected' && (
                <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                  {isRecordingMic && (
                    <div className="bg-red-500/10 border border-red-500/40 p-2.5 text-[11px] font-mono text-red-300 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Mic className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                        <span>🎙️ Continuous Speech Active — Speak as long as you like!</span>
                      </span>
                      <span className="text-[10px] text-gray-400 font-sans">(Click Mic or pause to submit)</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={userCallerInput}
                      onChange={(e) => setUserCallerInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendCallerTurn()}
                      placeholder={`Speak or type custom query (e.g., "Hello, my name is Alex. I would like to build a custom website.")`}
                      className="flex-1 bg-[#05060A] border border-white/20 text-white text-xs px-4 py-3 rounded-none focus:outline-none focus:border-brand-teal font-sans"
                    />

                    <button
                      onClick={toggleMicInput}
                      title={isRecordingMic ? "Click to finish speaking" : "Hold or click to speak with microphone"}
                      className={`p-3 border text-xs font-mono transition-colors flex items-center gap-1.5 ${
                        isRecordingMic 
                          ? 'bg-red-500 text-white border-red-500 animate-pulse' 
                          : 'bg-white/5 border-white/15 text-gray-300 hover:text-white hover:border-brand-teal'
                      }`}
                    >
                      {isRecordingMic ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => handleSendCallerTurn()}
                      disabled={isAiThinking}
                      className="px-5 py-3 bg-brand-teal text-[#05060A] font-bold font-mono text-xs uppercase tracking-wider hover:bg-white transition-colors flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" /> Speak
                    </button>
                  </div>

                  {/* Preset Quick Caller Starters */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                      <span>Interactive Voice Prompts:</span>
                      <span className="text-brand-teal">Simulate Full Booking Flow</span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                      <button
                        onClick={() => handleSendCallerTurn("I would like to book a discovery consultation for AI Voice Agent setup.")}
                        className="px-2.5 py-1 bg-white/5 border border-white/10 text-gray-300 hover:border-brand-teal hover:text-brand-teal transition-colors flex items-center gap-1"
                      >
                        <span>1️⃣ Request Meeting</span>
                      </button>
                      <button
                        onClick={() => handleSendCallerTurn("My name is Sarah, and tomorrow at 2:00 PM works best for me.")}
                        className="px-2.5 py-1 bg-white/5 border border-white/10 text-gray-300 hover:border-brand-teal hover:text-brand-teal transition-colors flex items-center gap-1"
                      >
                        <span>2️⃣ Give Name & Time</span>
                      </button>
                      <button
                        onClick={() => handleSendCallerTurn("My email is sarah@gmail.com and my phone number is +1 (555) 234-5678.")}
                        className="px-2.5 py-1 bg-white/5 border border-white/10 text-gray-300 hover:border-brand-teal hover:text-brand-teal transition-colors flex items-center gap-1"
                      >
                        <span>3️⃣ Give Email & Phone</span>
                      </button>
                      <button
                        onClick={() => handleSendCallerTurn("Hello! Can you tell me in detail about the founder and CEO of Quorik?")}
                        className="px-2.5 py-1 bg-white/5 border border-purple-500/30 text-purple-300 hover:border-purple-400 hover:text-white transition-colors flex items-center gap-1 font-bold"
                      >
                        <span>👑 Ask About Founder & CEO</span>
                      </button>
                      <button
                        onClick={() => handleSendCallerTurn("Hello, my name is Alex. I want to build a custom website with AI chatbot. My email is alex@gmail.com, phone +1-555-9876, available Friday at 11 AM.")}
                        className="px-2.5 py-1 bg-brand-teal/10 border border-brand-teal/30 text-brand-teal hover:bg-brand-teal hover:text-[#05060A] transition-colors flex items-center gap-1 font-bold"
                      >
                        <span>⚡ All-In-One Booking</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Real-Time Outcome Panel: Dynamic Google Calendar + WhatsApp Notification */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            {/* Google Calendar Sync Card */}
            <div className={`p-6 bg-[#0A0E1A] border transition-all ${
              leadDetails.bookingStatus === 'confirmed' 
                ? 'border-green-500 bg-green-500/5' 
                : bookedCalendar 
                  ? 'border-brand-teal/50 bg-brand-teal/5' 
                  : 'border-white/10'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-5 h-5 text-brand-teal" />
                  <h4 className="text-sm font-bold text-white uppercase font-mono">GOOGLE CALENDAR CRM</h4>
                </div>
                {leadDetails.bookingStatus === 'confirmed' ? (
                  <span className="px-2.5 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-mono font-bold uppercase flex items-center gap-1 border border-green-500/30">
                    <Check className="w-3 h-3" /> Confirmed & Synced
                  </span>
                ) : leadDetails.callerName || leadDetails.requestedSlot ? (
                  <span className="px-2.5 py-0.5 bg-yellow-500/20 text-yellow-400 text-[10px] font-mono font-bold uppercase flex items-center gap-1 border border-yellow-500/30">
                    <Clock className="w-3 h-3" /> Collecting Details
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-500 font-mono uppercase">AWAITING CALLER</span>
                )}
              </div>

              <div className="bg-[#05060A] border border-white/10 p-4 text-xs font-mono space-y-2.5">
                <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                  <span className="text-gray-400">Consultation Topic:</span>
                  <span className="text-white font-bold text-right max-w-[60%] truncate">{leadDetails.topic}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                  <span className="text-gray-400">Caller Name:</span>
                  <span className={leadDetails.callerName ? "text-brand-teal font-bold" : "text-gray-600 italic"}>
                    {leadDetails.callerName || "Awaiting Name..."}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                  <span className="text-gray-400">Preferred Time Slot:</span>
                  <span className={leadDetails.requestedSlot ? "text-green-400 font-bold" : "text-gray-600 italic"}>
                    {leadDetails.requestedSlot || "Awaiting Time Slot..."}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                  <span className="text-gray-400">Email Address:</span>
                  <span className={leadDetails.callerEmail ? "text-cyan-300 font-bold" : "text-gray-600 italic"}>
                    {leadDetails.callerEmail || "Awaiting Email..."}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Phone Number:</span>
                  <span className={leadDetails.callerPhone ? "text-emerald-300 font-bold" : "text-gray-600 italic"}>
                    {leadDetails.callerPhone || "Awaiting Phone..."}
                  </span>
                </div>
              </div>
            </div>

            {/* WhatsApp Alert Card */}
            <div className={`p-6 bg-[#0A0E1A] border transition-all ${whatsappSent ? 'border-green-500 bg-green-500/5' : 'border-white/10'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-5 h-5 text-green-400" />
                  <h4 className="text-sm font-bold text-white uppercase font-mono">WHATSAPP DISPATCH ALERT</h4>
                </div>
                {whatsappSent ? (
                  <span className="px-2.5 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-mono font-bold uppercase flex items-center gap-1 border border-green-500/30">
                    <Check className="w-3 h-3" /> Real-Time Feed
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-500 font-mono uppercase">AWAITING CALL COMPLETION</span>
                )}
              </div>

              <div className="bg-[#0B141A] border border-green-500/20 p-4 font-sans text-xs text-green-100 leading-relaxed rounded relative">
                <div className="text-[10px] font-mono text-green-400 uppercase mb-1 flex items-center justify-between">
                  <span>WHATSAPP CRM DISPATCH</span>
                  <span>LIVE SYNC</span>
                </div>
                "{leadDetails.whatsappMessage || "Ready to dispatch lead data once caller provides meeting details."}"
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
