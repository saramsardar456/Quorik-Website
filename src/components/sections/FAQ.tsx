import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "How long does it take to build a website?",
    answer: "A standard website usually takes 4-6 weeks to build from start to finish. Larger projects might take a bit longer."
  },
  {
    question: "How is your AI Chatbot different from normal chatbots?",
    answer: "Normal chatbots just give you a menu of options. Our AI actually talks to your customers like a real person, using the information from your business to answer any question."
  },
  {
    question: "How does the Website Voice Agent work?",
    answer: "It lives right on your website! Visitors can click a microphone icon and start talking out loud. The AI understands their questions and speaks back instantly, helping them find what they need or booking appointments directly."
  },
  {
    question: "Do you help us after the project is done?",
    answer: "Yes. We offer support plans to keep everything running smoothly and make updates whenever you need them."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-32 bg-[#0F1423] border-t border-white/5 relative">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-[#0A0E1A] border border-white/5 rounded-[20px] overflow-hidden transition-colors hover:bg-[#0c111e]"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between focus:outline-none"
              >
                <span className="font-semibold text-white tracking-tight">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="px-8 pb-8 text-gray-400 leading-relaxed text-[15px]">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
