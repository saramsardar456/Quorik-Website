import { About } from '../components/sections/About';
import { TeamShowcase } from '../components/sections/TeamShowcase';
import { Testimonials } from '../components/sections/Testimonials';
import { SEO } from '../components/SEO';

export function AboutPage() {
  return (
    <div className="pt-20">
      <SEO
        title="About Quorik - Founder Shehram Meellu & AI Web Pioneers"
        description="Discover Quorik's mission under Founder & CEO Shehram Meellu and our 5-member engineering council to bridge world-class custom web engineering with autonomous AI voice intelligence."
        keywords="Shehram Meellu, Quorik founder, M.R. tech director, A.K. voice solutions, Farhaj systems ops, D.C. integration lead, web engineering agency, AI voice innovation"
        canonicalPath="/about"
      />
      <About />
      <TeamShowcase isFullPage={false} />
      <Testimonials />
    </div>
  );
}
