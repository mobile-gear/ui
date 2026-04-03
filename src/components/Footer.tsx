import React from "react";

const Footer: React.FC = () => {
  return (
    <footer data-test="footer" className="bg-gray-800 text-white py-6">
      <div className="container mx-auto text-center">
        <p data-test="footer-copyright">
          &copy; 2025 Mobile Gear. All rights reserved.
        </p>
        <div className="mt-4 space-x-4">
          <a
            data-test="footer-privacy"
            href="#"
            className="hover:text-blue-300"
          >
            Privacy Policy
          </a>
          <a data-test="footer-terms" href="#" className="hover:text-blue-300">
            Terms of Service
          </a>
          <a
            data-test="footer-contact"
            href="#"
            className="hover:text-blue-300"
          >
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
