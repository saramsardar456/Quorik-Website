import { motion } from 'motion/react';

const stats = [
  { value: "98%", label: "Client Retention", suffix: "" },
  { value: "45", label: "Projects Delivered", suffix: "+" },
  { value: "12", label: "Industry Awards", suffix: "" },
  { value: "2.5", label: "Avg. ROI Increase", suffix: "x" }
];

export function Stats() {
  return (
    <section className="py-24 bg-[#0A0E1A] relative noise-bg">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-8">
          {stats.map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex flex-col items-center md:items-start text-center md:text-left"
            >
              <div className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tighter mb-2 flex items-baseline">
                {stat.value}<span className="text-brand-teal text-2xl sm:text-3xl md:text-5xl">{stat.suffix}</span>
              </div>
              <div className="text-gray-400 text-xs sm:text-sm font-bold uppercase tracking-widest">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}