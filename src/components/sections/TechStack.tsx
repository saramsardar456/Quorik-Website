const technologies = [
  "React", "TypeScript", "Node.js", "Python", "OpenAI", 
  "TailwindCSS", "Next.js", "GraphQL", "PostgreSQL", "AWS", 
  "Docker", "Figma", "Framer Motion", "TensorFlow", "LangChain"
];

export function TechStack() {
  return (
    <section className="py-20 bg-[#05060A] border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <h2 className="text-[11px] font-bold text-white/50 uppercase tracking-[0.2em]">Powered by Modern Tech</h2>
      </div>
      
      <div className="relative flex overflow-x-hidden">
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[#05060A] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#05060A] to-transparent z-10 pointer-events-none" />
        
        <div className="animate-marquee whitespace-nowrap">
          {/* Double the array for seamless looping */}
          {[...technologies, ...technologies].map((tech, index) => (
            <div 
              key={index} 
              className="mx-8 text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-white/5 uppercase tracking-tighter select-none"
            >
              {tech}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
