import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ReactNode } from 'react';
import { HomePage } from '../pages/HomePage';
import { ServicesPage } from '../pages/ServicesPage';
import { AboutPage } from '../pages/AboutPage';
import { ContactPage } from '../pages/ContactPage';
import { ProcessPage } from '../pages/ProcessPage';
import { WorkPage } from '../pages/WorkPage';
import { Blog } from '../pages/BlogPage';
import { BlogPostPage } from '../pages/BlogPostPage';
import { TestimonialsPage } from '../pages/TestimonialsPage';
import { VoiceAgentPage } from '../pages/VoiceAgentPage';
import { PricingPage } from '../pages/PricingPage';
import { AdminDashboard } from '../pages/AdminDashboard';
import { ClientDemoPage } from '../pages/ClientDemoPage';
import { IndustryPage } from '../pages/IndustryPage';
import { ComparisonPage } from '../pages/ComparisonPage';
import { PrivacyPolicyPage } from '../pages/PrivacyPolicyPage';
import { RefundPolicyPage } from '../pages/RefundPolicyPage';
import { TermsOfServicePage } from '../pages/TermsOfServicePage';
import { WelcomePage } from '../pages/WelcomePage';
import { PartnershipPage } from '../pages/PartnershipPage';

const PageWrapper = ({ children }: { children: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.18, ease: "easeOut" }}
    className="w-full"
  >
    {children}
  </motion.div>
);

export function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      {/* AnimatePresence needs key */}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
        <Route path="/services" element={<PageWrapper><ServicesPage /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />
        <Route path="/process" element={<PageWrapper><ProcessPage /></PageWrapper>} />
        <Route path="/work" element={<PageWrapper><WorkPage /></PageWrapper>} />
        <Route path="/partnerships" element={<PageWrapper><PartnershipPage /></PageWrapper>} />
        <Route path="/partners" element={<PageWrapper><PartnershipPage /></PageWrapper>} />
        <Route path="/partner" element={<PageWrapper><PartnershipPage /></PageWrapper>} />
        <Route path="/blog" element={<PageWrapper><Blog /></PageWrapper>} />
        <Route path="/blog/:id" element={<PageWrapper><BlogPostPage /></PageWrapper>} />
        <Route path="/voice-agent" element={<PageWrapper><VoiceAgentPage /></PageWrapper>} />
        <Route path="/demo-builder" element={<Navigate to="/admin" replace />} />
        <Route path="/custom-demo" element={<Navigate to="/admin" replace />} />
        <Route path="/demo" element={<Navigate to="/admin" replace />} />
        <Route path="/client-demo" element={<PageWrapper><ClientDemoPage /></PageWrapper>} />
        <Route path="/preview-demo" element={<PageWrapper><ClientDemoPage /></PageWrapper>} />
        <Route path="/client-preview" element={<PageWrapper><ClientDemoPage /></PageWrapper>} />
        <Route path="/pricing" element={<PageWrapper><PricingPage /></PageWrapper>} />
        <Route path="/welcome" element={<PageWrapper><WelcomePage /></PageWrapper>} />
        <Route path="/thank-you" element={<PageWrapper><WelcomePage /></PageWrapper>} />
        <Route path="/testimonials" element={<PageWrapper><TestimonialsPage /></PageWrapper>} />
        <Route path="/industry" element={<PageWrapper><IndustryPage /></PageWrapper>} />
        <Route path="/industry/:slug" element={<PageWrapper><IndustryPage /></PageWrapper>} />
        <Route path="/compare" element={<PageWrapper><ComparisonPage /></PageWrapper>} />
        <Route path="/compare/:slug" element={<PageWrapper><ComparisonPage /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
        <Route path="/privacy-policy" element={<PageWrapper><PrivacyPolicyPage /></PageWrapper>} />
        <Route path="/refund-policy" element={<PageWrapper><RefundPolicyPage /></PageWrapper>} />
        <Route path="/terms-of-service" element={<PageWrapper><TermsOfServicePage /></PageWrapper>} />
        <Route path="/admin" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}
