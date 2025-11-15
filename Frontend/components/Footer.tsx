
'use client';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-bold text-blue-400 mb-4" style={{ fontFamily: 'Pacifico, serif' }}>
              CityPulse
            </div>
            <p className="text-gray-400 mb-4">
              Making cities smarter through efficient complaint management. 
              Connect with your local government and help improve urban infrastructure.
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 flex items-center justify-center bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                <i className="ri-facebook-fill text-white"></i>
              </div>
              <div className="w-8 h-8 flex items-center justify-center bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                <i className="ri-twitter-fill text-white"></i>
              </div>
              <div className="w-8 h-8 flex items-center justify-center bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                <i className="ri-instagram-line text-white"></i>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/submit-complaint" className="text-gray-400 hover:text-white transition-colors">Submit Complaint</a></li>
              <li><a href="/track-complaint" className="text-gray-400 hover:text-white transition-colors">Track Status</a></li>
              <li><a href="/admin" className="text-gray-400 hover:text-white transition-colors">Admin Portal</a></li>
              <li><a href="/analytics" className="text-gray-400 hover:text-white transition-colors">Analytics</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 CityPulse. All rights reserved. Building smarter cities together.
          </p>
        </div>
      </div>
    </footer>
  );
}
