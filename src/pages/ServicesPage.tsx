import { Services } from '../components/sections/Services';
import { HowItWorks } from '../components/sections/HowItWorks';
import { FAQ } from '../components/sections/FAQ';
import { Contact } from '../components/sections/Contact';
import { SEO } from '../components/SEO';

export function ServicesPage() {
  return (
    <div className="pt-20">
      <SEO
        title="Custom Web Development & AI Voice Services | Quorik"
        description="Explore Quorik's enterprise services: Custom Web Engineering, Autonomous AI Voice Agents, Smart AI Chatbots, and Automated Lead Qualification."
        keywords="custom website agency, AI voice integration, web app development, AI customer service, automated lead booking, Quorik services"
        canonicalPath="/services"
      />
      <Services />
      <HowItWorks />
      <FAQ />
      <Contact />
    </div>
  );
}
