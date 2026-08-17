import { About } from '../components/sections/About';
import { Testimonials } from '../components/sections/Testimonials';
import { SEO } from '../components/SEO';

export function AboutPage() {
  return (
    <div className="pt-20">
      <SEO
        title="About Quorik - Founder Shehram Meellu & AI Web Pioneers"
        description="Discover Quorik's mission under Founder & CEO Shehram Meellu to bridge world-class custom web engineering with autonomous AI voice intelligence."
        keywords="Shehram Meellu, Quorik founder, web engineering agency, AI voice innovation, agency mission"
        canonicalPath="/about"
      />
      <About />
      <Testimonials />
    </div>
  );
}
