import { HowItWorks } from '../components/sections/HowItWorks';
import { TechStack } from '../components/sections/TechStack';
import { FAQ } from '../components/sections/FAQ';
import { Contact } from '../components/sections/Contact';
import { SEO } from '../components/SEO';

export function ProcessPage() {
  return (
    <div className="pt-20">
      <SEO
        title="Our Engineering & Deployment Process | Quorik"
        description="Learn about Quorik's 4-step rapid engineering roadmap: Architecture Discovery, High-Speed Build, AI Agent Training, and 14-Day Deployment."
        keywords="web development process, AI voice deployment, agile web agency roadmap, Quorik process"
        canonicalPath="/process"
      />
      <HowItWorks />
      <TechStack />
      <FAQ />
      <Contact />
    </div>
  );
}
