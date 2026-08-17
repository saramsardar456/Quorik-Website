import { Contact } from '../components/sections/Contact';
import { FAQ } from '../components/sections/FAQ';
import { SEO } from '../components/SEO';

export function ContactPage() {
  return (
    <div className="pt-20">
      <SEO
        title="Contact Quorik - Book a 15-Minute Technical Discovery Call"
        description="Get in touch with Quorik's engineering team to discuss custom website design, AI voice automation, or book a live discovery consultation."
        keywords="contact Quorik, book AI consultation, hire web agency, AI voice agent inquiry"
        canonicalPath="/contact"
      />
      <Contact />
      <FAQ />
    </div>
  );
}
