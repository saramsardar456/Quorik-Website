import { motion } from 'motion/react';
import { Mic, MicOff, Volume2, Zap, MessageSquare, Radio, Calendar, Check, Send, Loader2, Sparkles } from 'lucide-react';
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
    topic: string;
    requestedSlot: string;
    whatsappMessage: string;
  }>({
    callerName: 'Alex Smith',
    topic: 'Custom Website & AI Voice Agent Consultation',
    requestedSlot: 'Tomorrow @ 11:00 AM EST',
    whatsappMessage: '🚀 NEW QUALIFIED INBOUND LEAD: Alex Smith requested a discovery consultation for Custom Website & AI Voice Agent. Slot confirmed.'
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

    try {
      const response = await fetch('/api/voice-agent/simulate-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personaId: activePersonaId,
          gender: selectedGender,
          userQuery: textToSend,
          conversationHistory: updatedMessages
        })
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();
      setIsAiThinking(false);

      if (data.success && data.aiSpeechText) {
        const aiTimeStr = `00:${String(updatedMessages.length * 6 + 6).padStart(2, '0')}`;
        setSimMessages(prev => [
          ...prev,
          { sender: 'ai', text: data.aiSpeechText, time: aiTimeStr }
        ]);

        speakText(data.aiSpeechText);

        if (data.extractedLead) {
          setLeadDetails({
            callerName: data.extractedLead.callerName || 'Valued Client',
            topic: data.extractedLead.topic || 'Inbound Inquiry',
            requestedSlot: data.extractedLead.requestedSlot || 'Tomorrow @ 11:00 AM EST',
            whatsappMessage: data.extractedLead.whatsappMessage || 'Lead received.'
          });
          setBookedCalendar(true);
          setWhatsappSent(true);
        }
      }
    } catch (err) {
      console.error("AI turn error:", err);
      setIsAiThinking(false);
      const fallbackAi = "Thank you! I have registered your details and confirmed your discovery consultation slot.";
      setSimMessages(prev => [...prev, { sender: 'ai', text: fallbackAi, time: '00:30' }]);
      speakText(fallbackAi);
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
                  <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                    <span className="text-gray-500 py-1">Quick Prompts:</span>
                    <button
                      onClick={() => handleSendCallerTurn("Hello! My name is Alex. I want to build a high-performance custom website and AI Chatbot with Quorik.")}
                      className="px-2.5 py-1 bg-white/5 border border-white/10 text-gray-300 hover:border-brand-teal hover:text-brand-teal transition-colors"
                    >
                      🌐 Web & AI Chatbot Inquiry
                    </button>
                    <button
                      onClick={() => handleSendCallerTurn("Hello! My name is Sarah. I would like to book a 15-minute discovery consultation for AI Voice Agent setup.")}
                      className="px-2.5 py-1 bg-white/5 border border-white/10 text-gray-300 hover:border-brand-teal hover:text-brand-teal transition-colors"
                    >
                      🤖 AI Voice Agent Consultation
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Real-Time Outcome Panel: Dynamic Google Calendar + WhatsApp Notification */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            {/* Google Calendar Sync Card */}
            <div className={`p-6 bg-[#0A0E1A] border transition-all ${bookedCalendar ? 'border-green-500 bg-green-500/5' : 'border-white/10'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-5 h-5 text-brand-teal" />
                  <h4 className="text-sm font-bold text-white uppercase font-mono">GOOGLE CALENDAR BOOKING</h4>
                </div>
                {bookedCalendar ? (
                  <span className="px-2.5 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-mono font-bold uppercase flex items-center gap-1 border border-green-500/30">
                    <Check className="w-3 h-3" /> Dynamic Slot Booked
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-500 font-mono uppercase">AWAITING BOOKING</span>
                )}
              </div>

              <div className="bg-[#05060A] border border-white/10 p-4 text-xs font-mono space-y-2">
                <div className="text-gray-400">Event: <span className="text-white font-bold">{leadDetails.topic}</span></div>
                <div className="text-gray-400">Client Name: <span className="text-brand-teal">{leadDetails.callerName}</span></div>
                <div className="text-gray-400">Time Slot: <span className="text-green-400">{leadDetails.requestedSlot}</span></div>
                <div className="text-gray-400">Assigned Staff: <span className="text-white">Senior Representative</span></div>
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
                    <Check className="w-3 h-3" /> Dispatched
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-500 font-mono uppercase">AWAITING CALL COMPLETION</span>
                )}
              </div>

              <div className="bg-[#0B141A] border border-green-500/20 p-4 font-sans text-xs text-green-100 leading-relaxed rounded relative">
                <div className="text-[10px] font-mono text-green-400 uppercase mb-1 flex items-center justify-between">
                  <span>WHATSAPP BUSINESS NOTIFICATION</span>
                  <span>JUST NOW</span>
                </div>
                "{leadDetails.whatsappMessage}"
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
