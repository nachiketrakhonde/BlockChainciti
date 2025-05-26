import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import SolutionsSection from './components/SolutionsSection';
import EnterpriseSection from './components/EnterpriseSection';
import CustomerSection from './components/CustomerSection';
import DemoSection from './components/DemoSection';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import KYCForm from './components/KYCForm';
import PaymentForm from './components/PaymentForm';
import { useAuth } from './contexts/AuthContext';

import './styles/animations.css';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <Header onAuthClick={() => setIsAuthModalOpen(true)} />
      <Hero />
      <SolutionsSection />
      
      {user && (
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Identity Verification</h2>
                <KYCForm />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Cross-Border Payments</h2>
                <PaymentForm />
              </div>
            </div>
          </div>
        </section>
      )}

      <EnterpriseSection />
      <CustomerSection />
      <DemoSection />
      <Footer />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}

export default App;