'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useUser } from '@/lib/user-context';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithEmail, loginWithAuth0, isAuthenticated, isLoading } = useUser();
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/submit-complaint');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await loginWithEmail({
        email: formState.email.trim(),
        password: formState.password,
      });
      router.replace('/submit-complaint');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to sign in right now.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAuth0Login = (connection?: string) => {
    setIsSubmitting(true);
    loginWithAuth0({ connection, screenHint: 'login' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="flex-1">
        <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://readdy.ai/api/search-image?query=Modern%20digital%20login%20interface%20with%20secure%20authentication%2C%20cityscape%20background%20with%20blue%20lighting%2C%20professional%20business%20environment%2C%20clean%20minimal%20design%2C%20technology%20and%20security%20theme%2C%20urban%20connectivity%2C%20digital%20access%20portal&width=1200&height=400&seq=login-hero&orientation=landscape')",
            }}
          >
            <div className="absolute inset-0 bg-blue-900/80" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome Back to CityPulse</h1>
            <p className="text-xl text-blue-100">
              Sign in to manage your complaints and track city improvements
            </p>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h2>
                <p className="text-gray-600">Access your CityPulse account</p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formState.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formState.password}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="Your password"
                  />
                </div>

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-300 transition-colors"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <i className="ri-loader-line animate-spin mr-2" />
                      Signing in…
                    </span>
                  ) : (
                    'Sign in with email'
                  )}
                </button>
              </form>

              <div className="mt-4 text-center text-sm text-gray-500">
                <span>Don’t have an account? </span>
                <Link href="/signup" className="text-blue-600 font-semibold hover:text-blue-500">
                  Create one
                </Link>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-center text-sm text-gray-500 mb-4">Or continue with</div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleAuth0Login('google-oauth2')}
                    disabled={isSubmitting}
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <i className="ri-google-fill text-red-500 mr-2" />
                    <span className="text-sm font-medium">Google</span>
                  </button>
                  <button
                    onClick={() => handleAuth0Login('facebook')}
                    disabled={isSubmitting}
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <i className="ri-facebook-fill text-blue-600 mr-2" />
                    <span className="text-sm font-medium">Facebook</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Sign In to CityPulse?</h2>
              <p className="text-lg text-gray-600">
                Unlock the full potential of our smart complaint management system
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-blue-100 rounded-full mx-auto mb-4">
                  <i className="ri-history-line text-2xl text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Track your complaints</h3>
                <p className="text-gray-600">
                  View all your submitted complaints and their current status in one place.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-blue-100 rounded-full mx-auto mb-4">
                  <i className="ri-notification-line text-2xl text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Real-time updates</h3>
                <p className="text-gray-600">
                  Get instant notifications when there are updates on your complaints.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-blue-100 rounded-full mx-auto mb-4">
                  <i className="ri-user-line text-2xl text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Personal dashboard</h3>
                <p className="text-gray-600">
                  Access your personalized dashboard with insights and analytics.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
