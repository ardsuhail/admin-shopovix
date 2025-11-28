// app/analytics/page.js
import AnalyticsDashboard from "@/component/Views-Analytics";
export default function AnalyticsPage() {
  return (
    <div className="min-h-screen lg:w-[75vw] w-full bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <AnalyticsDashboard />
      </div>
    </div>
  );
}