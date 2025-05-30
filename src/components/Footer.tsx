import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">PoolPass</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-pool-primary">About Us</Link></li>
              <li><Link to="/careers" className="text-gray-600 hover:text-pool-primary">Careers</Link></li>
              <li><Link to="/press" className="text-gray-600 hover:text-pool-primary">Press</Link></li>
              <li><Link to="/blog" className="text-gray-600 hover:text-pool-primary">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Guests</h3>
            <ul className="space-y-2">
              <li><Link to="/pools" className="text-gray-600 hover:text-pool-primary">Find Pools</Link></li>
              <li><Link to="/gift-cards" className="text-gray-600 hover:text-pool-primary">Gift Cards</Link></li>
              <li><Link to="/help" className="text-gray-600 hover:text-pool-primary">Help Centre</Link></li>
              <li><Link to="/safety" className="text-gray-600 hover:text-pool-primary">Safety</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Hosts</h3>
            <ul className="space-y-2">
              <li><Link to="/host" className="text-gray-600 hover:text-pool-primary">Become a Host</Link></li>
              <li><Link to="/host-resources" className="text-gray-600 hover:text-pool-primary">Resources</Link></li>
              <li><Link to="/host-forum" className="text-gray-600 hover:text-pool-primary">Community Forum</Link></li>
              <li><Link to="/responsible-hosting" className="text-gray-600 hover:text-pool-primary">Responsible Hosting</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-gray-600 hover:text-pool-primary">Help Centre</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-pool-primary">Contact Us</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-pool-primary">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-pool-primary">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 flex items-center">
              <img
                src="/lovable-uploads/b0a133cd-7024-42bb-b333-dc78e02d1272.png"
                alt="PoolPass Logo"
                className="h-24 md:h-28 w-auto"
              />
            </div>

            <div className="flex space-x-8">
              <a href="https://www.facebook.com/poolpassuk" className="text-gray-500 hover:text-pool-primary" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12.07C22 6.48 17.52 2 12 2S2 6.48 2 12.07C2 17.1 5.66 21.24 10.44 22v-7.01H7.9v-2.92h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.92h-2.34V22C18.34 21.24 22 17.1 22 12.07z" />
                </svg>
              </a>

              <a href="https://www.instagram.com/poolpassuk/" className="text-gray-500 hover:text-pool-primary" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.75 2h8.5A5.76 5.76 0 0 1 22 7.75v8.5A5.76 5.76 0 0 1 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5A5.76 5.76 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Zm4.25 3.5a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5Zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Zm5.25-.25a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" />
                </svg>
              </a>

              <a href="https://www.linkedin.com/company/poolpass" className="text-gray-500 hover:text-pool-primary" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14C2.2 0 0 2.2 0 5v14c0 2.8 2.2 5 5 5h14c2.8 0 5-2.2 5-5V5c0-2.8-2.2-5-5-5zM7 19H4v-9h3v9zm-1.5-10.5c-1 0-1.5-.7-1.5-1.5s.5-1.5 1.5-1.5 1.5.7 1.5 1.5-.5 1.5-1.5 1.5zm13.5 10.5h-3v-5c0-1.2-.4-2-1.5-2s-1.7.9-1.7 2v5h-3v-9h3v1.2c.4-.7 1.3-1.2 2.5-1.2 1.9 0 3.2 1.2 3.2 3.7v5.3z" />
                </svg>
              </a>

              <a href="https://twitter.com/poolpassuk" className="text-gray-500 hover:text-pool-primary" aria-label="Twitter / X" target="_blank" rel="noopener noreferrer">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 4.01c-.77.34-1.6.57-2.47.67a4.28 4.28 0 0 0 1.88-2.36 8.47 8.47 0 0 1-2.7 1.03 4.23 4.23 0 0 0-7.2 3.86A12 12 0 0 1 3.17 3.15a4.23 4.23 0 0 0 1.31 5.64 4.22 4.22 0 0 1-1.92-.53v.05a4.24 4.24 0 0 0 3.39 4.15 4.3 4.3 0 0 1-1.91.07 4.25 4.25 0 0 0 3.96 2.94 8.5 8.5 0 0 1-5.26 1.82A8.61 8.61 0 0 1 2 18.42a12.01 12.01 0 0 0 6.49 1.9c7.79 0 12.05-6.47 12.05-12.08 0-.18-.01-.36-.02-.53A8.52 8.52 0 0 0 22 4.01z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
