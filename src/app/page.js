import { FaShieldAlt, FaChartLine, FaBox, FaUsers, FaCog, FaStore, FaShoppingCart, FaTags, FaImage } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">

      {/* ========== HERO SECTION ========== */}
      <section className="relative py-24 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <FaStore className="text-2xl text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Shopovix <span className="text-blue-400">Admin</span>
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Your complete dashboard to manage Shopovix store operations, 
            track sales, and handle day-to-day business activities.
          </p>
          
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
            >
              <FaShieldAlt className="text-lg" />
              Admin Login
            </a>
            <a
              href="https://shopovix.store"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-blue-400 text-blue-100 hover:bg-blue-400/10 px-10 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <FaShoppingCart className="text-lg" />
              Visit Store
            </a>
          </div>
        </div>
      </section>

      {/* ========== FEATURES GRID ========== */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Manage Your Store
            </h2>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              Everything you need to run your Shopovix store efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FaChartLine className="text-3xl text-blue-400" />}
              title="Sales & Reports"
              description="Track your daily sales, revenue, and business performance metrics."
              features={["Revenue Tracking", "Sales Reports", "Performance Metrics"]}
            />
            <FeatureCard
              icon={<FaBox className="text-3xl text-green-400" />}
              title="Product Management"
              description="Manage your product catalog, inventory, and product information."
              features={["Add/Edit Products", "Inventory Management", "Product Updates"]}
            />
            <FeatureCard
              icon={<FaUsers className="text-3xl text-purple-400" />}
              title="Order Management"
              description="Process customer orders, handle shipping, and manage deliveries."
              features={["Order Processing", "Shipping Management", "Customer Orders"]}
            />
            <FeatureCard
              icon={<FaTags className="text-3xl text-orange-400" />}
              title="Promotions"
              description="Create discounts, offers, and promotional campaigns for your store."
              features={["Discount Codes", "Special Offers", "Promotional Campaigns"]}
            />
            <FeatureCard
              icon={<FaImage className="text-3xl text-cyan-400" />}
              title="Store Content"
              description="Update your store's banners, homepage, and promotional content."
              features={["Banner Management", "Homepage Updates", "Content Management"]}
            />
            <FeatureCard
              icon={<FaCog className="text-3xl text-red-400" />}
              title="Store Settings"
              description="Configure your store preferences and business information."
              features={["Store Configuration", "Business Settings", "Preferences"]}
            />
          </div>
        </div>
      </section>

      {/* ========== STATS SECTION ========== */}
      <section className="py-16 px-6 bg-white/5 backdrop-blur-lg border-t border-b border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatItem number="500+" label="Products" />
            <StatItem number="10K+" label="Customers" />
            <StatItem number="99.9%" label="Uptime" />
            <StatItem number="24/7" label="Monitoring" />
          </div>
        </div>
      </section>

      {/* ========== SECURITY NOTICE ========== */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-8 backdrop-blur-sm">
            <div className="flex justify-center mb-4">
              <FaShieldAlt className="text-3xl text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-red-100 mb-3">
              Private Admin Access
            </h3>
            <p className="text-red-200 leading-relaxed">
              This dashboard contains sensitive business data for Shopovix store only. 
              Access is strictly limited to authorized personnel.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, features }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 group">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-blue-100 mb-4 leading-relaxed">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-sm text-blue-200">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatItem({ number, label }) {
  return (
    <div className="text-white">
      <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">{number}</div>
      <div className="text-blue-200 font-medium">{label}</div>
    </div>
  );
}