import { CaseStudies } from '../components/sections/CaseStudies';
import { Testimonials } from '../components/sections/Testimonials';
import { Contact } from '../components/sections/Contact';
import { SEO } from '../components/SEO';

export function WorkPage() {
  return (
    <div className="pt-20">
      <SEO
        title="Portfolio & Case Studies - High Performance Web Engineering | Quorik"
        description="See how Quorik engineered custom web solutions and AI voice systems that increased client conversions by up to 340%."
        keywords="web development portfolio, AI voice agent case studies, high converting websites, Quorik clients"
        canonicalPath="/work"
      />
      <CaseStudies />
      <Testimonials />
      <Contact />
    </div>
  );
}
