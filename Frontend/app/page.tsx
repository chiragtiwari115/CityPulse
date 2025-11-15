
'use client';

import Link from 'next/link';
import { useUser } from '@/lib/user-context';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Home() {
  const { user, isAuthenticated, isLoading } = useUser();
  const features = [
    {
      icon: 'ri-map-pin-line',
      title: 'Location-Based Reporting',
      description: 'Report issues with precise location mapping using Google Maps integration'
    },
    {
      icon: 'ri-time-line',
      title: 'Real-Time Tracking',
      description: 'Track your complaint status and receive instant notifications'
    },
    {
      icon: 'ri-dashboard-line',
      title: 'Admin Dashboard',
      description: 'Comprehensive management tools for municipal staff'
    },
    {
      icon: 'ri-bar-chart-line',
      title: 'Analytics & Insights',
      description: 'Data-driven insights for better city infrastructure management'
    }
  ];

  const stats = [
    { number: '15,847', label: 'Complaints Resolved' },
    { number: '2,340', label: 'Active Users' },
    { number: '98%', label: 'Response Rate' },
    { number: '24hrs', label: 'Average Response Time' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
            }}
          >
            <div className="absolute inset-0 bg-blue-900/70"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-bold mb-6">
                Smart Complaint Management for Modern Cities
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Report urban infrastructure issues instantly with location-based tracking. 
                Connect citizens with local government for faster resolutions and better city living.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <Link
                    href="/submit-complaint"
                    className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center whitespace-nowrap"
                  >
                    Report an Issue
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center whitespace-nowrap"
                  >
                    Get Started
                  </Link>
                )}
                <Link href="/track-complaint" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-center whitespace-nowrap">
                  Track Complaint
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Powerful Features for Smart Cities
              </h2>
              <p className="text-xl text-gray-600">
                Everything you need to manage urban infrastructure complaints efficiently
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg mb-4">
                    <i className={`${feature.icon} text-2xl text-blue-600`}></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                How CityPulse Works
              </h2>
              <p className="text-xl text-gray-600">
                Simple steps to report and resolve urban infrastructure issues
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-blue-600 rounded-full mx-auto mb-4">
                  <i className="ri-add-line text-2xl text-white"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">1. Report Issue</h3>
                <p className="text-gray-600">Submit your complaint with photos and precise location details</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-blue-600 rounded-full mx-auto mb-4">
                  <i className="ri-settings-line text-2xl text-white"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">2. Processing</h3>
                <p className="text-gray-600">Municipal staff review and assign the complaint to relevant department</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-blue-600 rounded-full mx-auto mb-4">
                  <i className="ri-check-line text-2xl text-white"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">3. Resolution</h3>
                <p className="text-gray-600">Get real-time updates and notifications until issue is resolved</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Make Your City Better?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of citizens working together to improve urban infrastructure
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  href="/submit-complaint"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap"
                >
                  Submit Your First Complaint
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap"
                >
                  Get Started Today
                </Link>
              )}
              {isAuthenticated && user?.admin && (
                <Link href="/admin" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors whitespace-nowrap">
                  Admin Access
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
