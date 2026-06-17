import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Radio, Users, Zap, Trophy, TrendingUp, AlertTriangle } from "lucide-react";
import { Button } from "../components/Button";
import { geminiService } from "../services/geminiService";
import { cn } from "../lib/utils";

interface Message {
  id: string;
  speaker: string;
  text: string;
  type: 'argument' | 'interruption' | 'reaction';
}

export const DebateArena = () => {
  const [topic, setTopic] = useState("");
  const [isDebating, setIsDebating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [heat, setHeat] = useState(20);
  const [error, setError] = useState("");
  const [winner, setWinner] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const debateController = useRef<{ stop: boolean }>({ stop: false });

  const stopDebate = () => {
    debateController.current.stop = true;
    window.speechSynthesis.cancel();
    setIsDebating(false);
  };

  const startDebate = async () => {
    if (!topic || isDebating) return;
    setIsDebating(true);
    debateController.current.stop = false;
    window.speechSynthesis.cancel(); // Clear any hung state
    setMessages([]);
    setWinner(null);
    setHeat(20);
    setError("");
    
    try {
      // Faster feedback: add a system message
      setMessages([{ 
        id: "sys-1", 
        speaker: "SYSTEM", 
        text: "ARENA WARMING UP...", 
        type: "reaction" 
      }]);

      // Pre-fetch/Generate while showing progress
      const debatePromise = geminiService.generateDebate(topic, "Arjun", "Ananya");
      
      await new Promise(r => setTimeout(r, 800));
      if (debateController.current.stop) return;
      
      setMessages(prev => [...prev, {
        id: "sys-2",
        speaker: "SYSTEM",
        text: "GETTING THE FIGHTERS READY...",
        type: "reaction"
      }]);

      const debateData = await debatePromise;
      
      if (debateController.current.stop) return;

      // Remove connection message
      setMessages([]);

      if (!debateData || debateData.length === 0) {
        throw new Error("AI is too scared to debate this topic. Try something more unhinged.");
      }

      for (const rawMsg of debateData) {
        if (debateController.current.stop) break;

        const msgId = Math.random().toString(36).substring(7);
        const msg: Message = { ...rawMsg, id: msgId };
        
        setMessages(prev => [...prev, { ...msg, text: "" }]);
        setHeat(h => Math.min(100, h + Math.random() * 8));

        if (msg.type !== 'reaction') {
          await new Promise<void>((resolve) => {
            const voices = window.speechSynthesis.getVoices();
            
            const findBestVoice = (gender: 'male' | 'female') => {
                const searchNames = gender === 'male' 
                    ? ['google india', 'india', 'male', 'david', 'james', 'u.k. english male']
                    : ['google india', 'india', 'female', 'zira', 'samantha', 'u.s. english female'];
                
                const filtered = voices.filter(v => 
                    (v.lang.startsWith('en-IN') || v.lang.startsWith('en')) && 
                    searchNames.some(name => v.name.toLowerCase().includes(name))
                );

                if (filtered.length > 0) {
                    // Try to find Indian accent first
                    const indianVoice = filtered.find(v => v.lang.startsWith('en-IN') || v.name.toLowerCase().includes('india'));
                    if (indianVoice) return indianVoice;

                    const nonRobotic = filtered.filter(v => 
                        !v.name.toLowerCase().includes('robot') && 
                        !v.name.toLowerCase().includes('low') &&
                        !v.name.toLowerCase().includes('compact')
                    );
                    return nonRobotic.length > 0 ? nonRobotic[0] : filtered[0];
                }

                return voices.find(v => v.lang.startsWith('en-IN')) || voices.find(v => v.lang.startsWith('en')) || voices[0];
            };

            const cleanText = msg.text.replace(/\[AUDIENCE:?.*?\]/gi, '').trim();
            const utterance = new SpeechSynthesisUtterance(cleanText);

            const isArjun = msg.speaker.toLowerCase() === 'arjun';
            if (isArjun) {
              utterance.voice = findBestVoice('male');
              utterance.pitch = 1.0; 
              utterance.rate = 1.0;
            } else {
              utterance.voice = findBestVoice('female');
              utterance.pitch = 1.0;
              utterance.rate = 1.0;
            }

            const words = cleanText.split(" ");
            let wordsDisplayed = 0;
            let syncInterval: any = null;

            const updateTypedText = (count: number) => {
                if (debateController.current.stop) return;
                setMessages(prev => {
                    const next = [...prev];
                    const targetIdx = next.findIndex(m => m.id === msgId);
                    if (targetIdx !== -1) {
                        next[targetIdx] = { 
                            ...msg, 
                            text: words.slice(0, count).join(" ") 
                        };
                    }
                    return next;
                });
            };

            const safeResolve = () => {
                clearInterval(syncInterval);
                resolve();
            };

            utterance.onboundary = (event) => {
                if (event.name === 'word') {
                    wordsDisplayed++;
                    updateTypedText(wordsDisplayed);
                }
            };

            utterance.onstart = () => {
                // Ensure text eventually appears if onboundary fails
                if (wordsDisplayed === 0) {
                  syncInterval = setInterval(() => {
                    if (wordsDisplayed < words.length) {
                        wordsDisplayed++;
                        updateTypedText(wordsDisplayed);
                    } else {
                        clearInterval(syncInterval);
                    }
                  }, (cleanText.length / 25) * 1000 / words.length);
                }
            };

            utterance.onend = () => {
              setMessages(prev => {
                const next = [...prev];
                const targetIdx = next.findIndex(m => m.id === msgId);
                if (targetIdx !== -1) next[targetIdx] = { ...msg, text: cleanText };
                return next;
              });
              setTimeout(safeResolve, 300);
            };

            utterance.onerror = () => safeResolve();
            
            // Safety timeout to prevent getting stuck if synthesis fails silently
            const safetyTimeout = setTimeout(safeResolve, 10000);
            
            window.speechSynthesis.resume(); // Ensure it's not paused
            window.speechSynthesis.speak(utterance);
            
            // Clean up safety timeout if it completes
            utterance.addEventListener('end', () => clearTimeout(safetyTimeout));
            utterance.addEventListener('error', () => clearTimeout(safetyTimeout));
          });
        } else {
          setMessages(prev => {
            const next = [...prev];
            const targetIdx = next.findIndex(m => m.id === msgId);
            if (targetIdx !== -1) next[targetIdx] = msg;
            return next;
          });
          await new Promise(r => setTimeout(r, 600));
        }
      }
      if (!debateController.current.stop) {
        const luckyWinner = Math.random() > 0.5 ? "Arjun" : "Ananya";
        setWinner(luckyWinner);
        setMessages(prev => [...prev, {
          id: "win-1",
          speaker: "SYSTEM",
          text: `👑 THE WINNER BY PURE DISORDER IS: ${luckyWinner.toUpperCase()}!`,
          type: "reaction"
        }]);
      }
      setIsDebating(false);
    } catch (error: any) {
      if (!debateController.current.stop) {
        console.error(error);
        setError(error.message || "Chaos energy depleted. Try again.");
        setIsDebating(false);
      }
    }
  };

  useEffect(() => {
    // Pre-load voices for human-like speech
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-6 py-12 max-w-5xl mx-auto"
    >
      <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
        <div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-2">
            AI Debate <span className="text-neon-purple">Arena</span>
          </h1>
          <p className="text-white/50 text-sm font-medium">Watch logic fight chaos in real-time.</p>
        </div>
        
        <div className="flex gap-4 glass p-4 rounded-2xl border-white/5 items-center">
            <div className="text-center">
                <div className="text-[10px] uppercase font-bold tracking-widest text-white/30 mb-1">Heat Index</div>
                <div className={cn("text-xl font-black font-mono", heat > 80 ? "text-red-500" : "text-neon-blue")}>
                    {Math.round(heat)}%
                </div>
            </div>
        </div>
      </div>

      <div className="glass rounded-[2.5rem] border-white/5 overflow-hidden mb-8">
        {error && (
          <div className="p-4 bg-red-500/10 border-b border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest text-center">
            {error}
          </div>
        )}
        <div className="p-8 border-b border-white/5 flex gap-4">
          <input
            type="text"
            placeholder="ENTER CONTROVERSIAL TOPIC (E.G. CATS ARE EVIL)"
            className="flex-grow bg-white/5 border border-white/10 rounded-xl px-6 py-4 font-mono text-sm tracking-wider focus:outline-none focus:border-neon-purple transition-colors uppercase"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={isDebating}
          />
          {isDebating ? (
            <Button 
                variant="ghost" 
                onClick={stopDebate}
                className="whitespace-nowrap border-red-500/50 text-red-500 hover:bg-red-500/10"
            >
                STOP FIGHT
            </Button>
          ) : (
            <Button 
                variant="purple" 
                onClick={startDebate} 
                disabled={!topic}
                className="whitespace-nowrap"
            >
                START FIGHT
            </Button>
          )}
        </div>

        <div className="relative aspect-video md:aspect-[21/9] bg-black/40 cyber-grid overflow-hidden">
          <div className="absolute inset-0 p-8 flex justify-between pointer-events-none">
            {/* Fighter 1 */}
            <motion.div 
                animate={isDebating ? { y: [0, -10, 0] } : {}}
                className="w-48 h-full glass rounded-3xl border-neon-purple/30 flex flex-col items-center justify-center p-6 gap-4"
            >
                <div className="w-20 h-20 bg-neon-purple/20 rounded-full flex items-center justify-center animate-pulse">
                    <Radio className="w-10 h-10 text-neon-purple" />
                </div>
                <div className="text-center relative">
                    {winner === 'Arjun' && (
                        <motion.div 
                            initial={{ scale: 0, y: -20 }}
                            animate={{ scale: 1, y: -25 }}
                            className="absolute left-1/2 -translate-x-1/2 text-yellow-400"
                        >
                            <Trophy className="w-6 h-6" />
                        </motion.div>
                    )}
                    <div className="font-black italic uppercase tracking-tighter">Arjun</div>
                    <div className="text-[8px] uppercase tracking-widest font-bold text-white/30">Mumbaikar Chaos</div>
                </div>
            </motion.div>

            <div className="flex flex-col items-center justify-center gap-4 text-4xl font-black italic text-white/10">
                VS
            </div>

            {/* Fighter 2 */}
            <motion.div 
                animate={isDebating ? { y: [0, -10, 0] } : {}}
                transition={{ delay: 0.5 }}
                className="w-48 h-full glass rounded-3xl border-neon-blue/30 flex flex-col items-center justify-center p-6 gap-4"
            >
                <div className="w-20 h-20 bg-neon-blue/20 rounded-full flex items-center justify-center animate-pulse">
                    <Users className="w-10 h-10 text-neon-blue" />
                </div>
                <div className="text-center relative">
                    {winner === 'Ananya' && (
                        <motion.div 
                            initial={{ scale: 0, y: -20 }}
                            animate={{ scale: 1, y: -25 }}
                            className="absolute left-1/2 -translate-x-1/2 text-yellow-400"
                        >
                            <Trophy className="w-6 h-6" />
                        </motion.div>
                    )}
                    <div className="font-black italic uppercase tracking-tighter">Ananya</div>
                    <div className="text-[8px] uppercase tracking-widest font-bold text-white/30">Delhi Chaos</div>
                </div>
            </motion.div>
          </div>

          <div 
            ref={scrollRef}
            className="absolute inset-0 pt-32 p-8 overflow-y-auto scroll-smooth flex flex-col gap-4"
          >
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.speaker === 'Arjun' ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "max-w-[70%] p-4 rounded-2xl flex flex-col gap-1",
                    msg.speaker === 'Arjun' 
                      ? "self-start bg-neon-purple/10 border border-neon-purple/20 rounded-tl-none" 
                      : "self-end bg-neon-blue/10 border border-neon-blue/20 rounded-tr-none text-right"
                  )}
                >
                  <div className="text-[10px] uppercase font-bold tracking-widest opacity-50">
                    {msg.speaker}
                  </div>
                  <div className="text-sm font-medium leading-relaxed min-h-[1.25rem]">
                    {msg.text}
                    {msg.text === "" && isDebating && (
                      <span className="inline-flex gap-1 items-center ml-1">
                        <span className="w-1 h-1 bg-neon-purple rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1 h-1 bg-neon-purple rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1 h-1 bg-neon-purple rounded-full animate-bounce" />
                      </span>
                    )}
                  </div>
                  {msg.type === 'reaction' && (
                    <div className="flex gap-1 mt-2">
                        <div className="text-[8px] uppercase font-bold text-white/30 italic">Crowd Reacting...</div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="p-4 bg-black/60 border-t border-white/5 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 glass py-3 px-4 rounded-xl border-white/5">
                <TrendingUp className="w-4 h-4 text-neon-green" />
                <div>
                    <div className="text-[8px] uppercase font-bold text-white/30">Vibe Check</div>
                    <div className="text-xs font-black">UNSTABLE</div>
                </div>
            </div>
            <div className="flex items-center gap-3 glass py-3 px-4 rounded-xl border-white/5">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <div>
                    <div className="text-[8px] uppercase font-bold text-white/30">Audience</div>
                    <div className="text-xs font-black">ROASTED</div>
                </div>
            </div>
        </div>
      </div>
    </motion.div>
  );
};
