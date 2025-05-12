//import React from 'react';

import Header from './components/Header';
import Hero from './components/Hero';
import SolutionsSection from './components/SolutionsSection';
import EnterpriseSection from './components/EnterpriseSection';
import CustomerSection from './components/CustomerSection';
import DemoSection from './components/DemoSection';
import Footer from './components/Footer';

// Add animation keyframes to CSS
import './styles/animations.css';

function App() {
  return (
    <div className="min-h-screen bg-white">
     
      <Header />
      <Hero />
      <SolutionsSection />
      <EnterpriseSection />
      <CustomerSection />
      <DemoSection />
      <Footer />
    </div>
  );
}

export default App;
