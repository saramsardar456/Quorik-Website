import { Hero } from '../components/sections/Hero';
import { VoiceDemo } from '../components/sections/VoiceDemo';
import { Services } from '../components/sections/Services';
import { TechStack } from '../components/sections/TechStack';
import { Stats } from '../components/sections/Stats';
import { Testimonials } from '../components/sections/Testimonials';
import { LeadMagnet } from '../components/sections/LeadMagnet';
import { ROICalculator } from '../components/sections/ROICalculator';
import { SEO } from '../components/SEO';

export function HomePage() {
  return (
    <>
      <SEO
        title="Quorik - Custom Web Engineering & AI Autonomous Voice Agents"
        description="Quorik engineers high-converting custom websites, 24/7 AI voice receptionists, and smart chatbot automation to capture 100% of leads and scale operations."
        keywords="custom web development agency, AI voice agent, AI receptionists, web engineering agency, AI chatbots, conversion rate optimization, Quorik"
        canonicalPath="/"
      />
      <Hero />
      <Stats />
      <ROICalculator />
      <VoiceDemo />
      <Services />
      <LeadMagnet />
      <TechStack />
      <Testimonials />
    </>
  );
}
