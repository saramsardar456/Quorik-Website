/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { CurrencyProvider } from './context/CurrencyContext';
import { ScrollToTop } from './components/ScrollToTop';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { CustomCursor } from './components/CustomCursor';
import { Header } from './components/sections/Header';
import { Footer } from './components/sections/Footer';
import { ChatbotWidget } from './components/ChatbotWidget';
import { AnimatedRoutes } from './components/AnimatedRoutes';
import { Preloader } from './components/Preloader';

function AppContent() {
  const location = useLocation();
  const isClientDemo = location.pathname.startsWith('/client-demo') || 
                       location.pathname.startsWith('/preview-demo') || 
                       location.pathname.startsWith('/client-preview') || 
                       location.pathname.startsWith('/d/');

  if (isClientDemo) {
    return (
      <main className="min-h-screen">
        <AnimatedRoutes />
      </main>
    );
  }

  return (
    <div className="relative bg-brand-navy min-h-screen text-white font-sans selection:bg-brand-teal selection:text-brand-navy">
      <Header />
      
      <main>
        <AnimatedRoutes />
      </main>

      <Footer />
      
      <ScrollToTopButton />
      <ChatbotWidget />
    </div>
  );
}

export default function App() {
  return (
    <CurrencyProvider>
      <Preloader />
      <Router>
        <ScrollToTop />
        <CustomCursor />
        <AppContent />
      </Router>
    </CurrencyProvider>
  );
}
