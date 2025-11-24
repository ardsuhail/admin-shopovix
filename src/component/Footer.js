import { FaStore, FaHeart, FaShieldAlt, FaRocket,  FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <FaStore className="text-xl text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Shopovix</h3>
                <p className="text-blue-200 text-sm font-medium">Admin Portal</p>
              </div>
            </div>
          <p className="text-blue-100 leading-relaxed max-w-md">
  Private admin panel for Shopovix store management. 
  Monitor sales, manage products, and control your business operations.
</p>
            <div className="flex items-center gap-2 mt-4 text-blue-200">
              <FaShieldAlt className="text-sm" />
              <span className="text-sm font-medium">Secure • Reliable • Professional</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <div className="space-y-3">
              <FooterLink href="/" text="Home" />
              <FooterLink href="https://shopovix.store" text="Main Store" external />
              <FooterLink href="/contact" text="Contact Support" />
              <FooterLink href="/login" text="Admin Login" />
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Get In Touch</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-blue-100">
                <FaEnvelope className="text-blue-400" />
                <span className="text-sm">support@shopovix.com</span>
              </div>
              <div className="flex items-center gap-3 text-blue-100">
                <FaPhone className="text-blue-400" />
                <span className="text-sm">24/7 Support</span>
              </div>
              <div className="flex items-center gap-3 text-blue-100">
                <FaRocket className="text-blue-400" />
                <span className="text-sm">Production Environment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-white/10">
          <FeatureItem 
            icon={<FaShieldAlt className="text-xl text-green-400" />}
            title="Secure"
            description="Enterprise-grade security"
          />
          <FeatureItem 
            icon={<FaRocket className="text-xl text-blue-400" />}
            title="Fast"
            description="Lightning fast performance"
          />
          <FeatureItem 
            icon={<FaStore className="text-xl text-purple-400" />}
            title="Reliable"
            description="99.9% uptime guarantee"
          />
          <FeatureItem 
            icon={<FaHeart className="text-xl text-red-400" />}
            title="Supported"
            description="24/7 monitoring"
          />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-blue-200 text-sm">
              <FaHeart className="text-red-400" />
              <span>Built with passion for ecommerce excellence</span>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-blue-200 text-sm font-medium">
                © {new Date().getFullYear()} Shopovix Admin Panel
              </p>
              <p className="text-blue-300 text-xs mt-1">
                v2.4.1 • All Rights Reserved
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, text, external = false }) {
  if (external) {
    return (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors duration-200 text-sm group"
      >
        <span className="w-2 h-2 bg-blue-400 rounded-full group-hover:bg-white transition-colors duration-200"></span>
        {text}
      </a>
    );
  }

  return (
    <a 
      href={href}
      className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors duration-200 text-sm group"
    >
      <span className="w-2 h-2 bg-blue-400 rounded-full group-hover:bg-white transition-colors duration-200"></span>
      {text}
    </a>
  );
}

function FeatureItem({ icon, title, description }) {
  return (
    <div className="text-center group">
      <div className="flex justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h5 className="font-semibold text-white text-sm mb-1">{title}</h5>
      <p className="text-blue-200 text-xs">{description}</p>
    </div>
  );
}