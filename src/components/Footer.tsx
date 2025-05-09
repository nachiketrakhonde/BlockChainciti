import React from 'react';
import { Bitcoin, Facebook, Twitter, Linkedin, Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Bitcoin className="h-8 w-8 text-blue-300 mr-2" />
              <span className="font-bold text-2xl text-white">BlockBank</span>
            </div>
            <p className="text-blue-200 mb-6 max-w-md">
              Transforming banking with blockchain technology. Delivering transparent, 
              secure, and efficient financial solutions for enterprises and customers.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Linkedin, Github].map((Icon, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className="bg-blue-800 hover:bg-blue-700 rounded-full p-2 transition-colors"
                >
                  <Icon className="h-5 w-5 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Solutions', 'Enterprise', 'For Customers', 'Demo', 'About Us', 'Contact'].map((link, index) => (
                <li key={index}>
                  <a 
                    href={`#${link.toLowerCase().replace(' ', '-')}`}
                    className="text-blue-200 hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li>
                <p className="text-blue-200">123 Blockchain Avenue</p>
                <p className="text-blue-200">San Francisco, CA 94103</p>
              </li>
              <li>
                <p className="text-blue-200">info@blockbank.com</p>
                <p className="text-blue-200">+1 (555) 123-4567</p>
              </li>
            </ul>
            <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition-all hover:shadow-lg">
              Contact Sales
            </button>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-300 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} BlockBank. All rights reserved.
          </p>
          <div className="flex space-x-4 text-sm text-blue-300">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Legal</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;