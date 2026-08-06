import React from "react";

const Footer: React.FC = () => {
  return (
    <footer
      data-test="footer"
      className="bg-[#13131C] border-t border-[#252535] text-[#F0EEFF] py-6"
    >
      <div className="container mx-auto text-center">
        <p data-test="footer-copyright">
          &copy; 2025 Mobile Gear. All rights reserved.
        </p>
        <div className="mt-4 space-x-4">
          <a
            data-test="footer-privacy"
            href="#"
            className="hover:text-[#FF4500]"
          >
            Privacy Policy
          </a>
          <a data-test="footer-terms" href="#" className="hover:text-[#FF4500]">
            Terms of Service
          </a>
          <a
            data-test="footer-contact"
            href="#"
            className="hover:text-[#FF4500]"
          >
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
