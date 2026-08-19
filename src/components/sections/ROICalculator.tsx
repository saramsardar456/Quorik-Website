import { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, Clock, DollarSign, ArrowRight } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

export function ROICalculator() {
  const { currencyConfig, formatPrice } = useCurrency();
  const [teamSize, setTeamSize] = useState(5);
  const [manualHours, setManualHours] = useState(15); // per week per employee
  const [hourlyRate, setHourlyRate] = useState(30);

  // Assumptions
  const automationSavingsPercent = 0.7; // 70% of manual tasks automated
  const weeksPerYear = 52;

  // Calculations
  const currentWeeklyCost = teamSize * manualHours * hourlyRate;
  const currentAnnualCost = currentWeeklyCost * weeksPerYear;
  
  const savedAnnualHours = teamSize * manualHours * automationSavingsPercent * weeksPerYear;
  const savedAnnualCost = savedAnnualHours * hourlyRate;

  return (
    <section className="py-24 bg-[#0A0E1A] relative border-y border-white/5 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-brand-teal/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calculator className="w-5 h-5 text-brand-teal" />
            <h2 className="text-brand-teal font-bold tracking-wider uppercase text-sm">ROI Calculator ({currencyConfig.code})</h2>
          </div>
          <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6">
            See how much you could save.
          </h3>
          <p className="text-gray-400 text-lg leading-relaxed">
            Plug in your team's details and discover the immediate financial and time benefits of implementing custom AI automations.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* Controls */}
          <div className="space-y-8 sm:space-y-10 bg-[#0F1423] p-5 sm:p-8 md:p-10 rounded-[24px] sm:rounded-[32px] border border-white/5">
            <div>
              <div className="flex justify-between mb-4 text-sm sm:text-base">
                <label className="text-white font-semibold">Team Size</label>
                <span className="text-brand-teal font-bold">{teamSize} employees</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="100" 
                value={teamSize}
                onChange={(e) => setTeamSize(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-teal"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-4 text-sm sm:text-base">
                <label className="text-white font-semibold">Manual Task Hours (Per employee / week)</label>
                <span className="text-brand-teal font-bold">{manualHours} hrs</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="40" 
                value={manualHours}
                onChange={(e) => setManualHours(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-teal"
              />
              <p className="text-xs text-gray-500 mt-2">Data entry, reporting, scheduling, emails, etc.</p>
            </div>
            
            <div>
              <div className="flex justify-between mb-4 text-sm sm:text-base">
                <label className="text-white font-semibold">Average Hourly Rate</label>
                <span className="text-brand-teal font-bold">{formatPrice(hourlyRate)}/hr</span>
              </div>
              <input 
                type="range" 
                min="15" 
                max="150" 
                step="5"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-teal"
              />
            </div>
          </div>

          {/* Results */}
          <div className="grid gap-6">
            <motion.div 
              key={savedAnnualCost}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-brand-teal/20 to-brand-blue/10 border border-brand-teal/30 p-5 sm:p-8 rounded-[24px] sm:rounded-[32px] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal/20 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-teal/20 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-brand-teal" />
                  </div>
                  <h4 className="text-gray-300 font-semibold text-base sm:text-lg">Estimated Annual Savings</h4>
                </div>
                <div className="text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tighter mb-2 break-words">
                  {formatPrice(savedAnnualCost)}
                </div>
                <p className="text-gray-400 text-xs sm:text-sm">Money returned straight to your bottom line.</p>
              </div>
            </motion.div>

            <motion.div 
              key={savedAnnualHours}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#05060A] border border-white/5 p-5 sm:p-8 rounded-[24px] sm:rounded-[32px]"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-brand-blue/10 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-brand-blue" />
                </div>
                <h4 className="text-gray-300 font-semibold text-base sm:text-lg">Hours Reclaimed (Annual)</h4>
              </div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tighter mb-2">
                {savedAnnualHours.toLocaleString()} hrs
              </div>
              <p className="text-gray-400 text-xs sm:text-sm">Time unlocked for strategic, high-value work.</p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
