'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useUser } from '@/lib/user-context';

export default function SignupPage() {
  const router = useRouter();
  const { registerWithEmail, loginWithAuth0, isAuthenticated, isLoading } = useUser();
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
  });
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
      await registerWithEmail({
        username: formState.username.trim(),
        email: formState.email.trim(),
        password: formState.password,
      });
      router.replace('/submit-complaint');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'We had trouble creating your account. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAuth0Signup = (connection?: string) => {
    setIsSubmitting(true);
    loginWithAuth0({ connection, screenHint: 'signup' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="flex-1">
        <section className="relative bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://readdy.ai/api/search-image?query=Modern%20user%20registration%20interface%20with%20community%20joining%20theme%2C%20diverse%20people%20connecting%20digitally%2C%20urban%20background%20with%20green%20and%20blue%20lighting%2C%20professional%20welcoming%20environment%2C%20digital%20citizenship%20concept%2C%20technology%20bringing%20people%20together&width=1200&height=400&seq=signup-hero&orientation=landscape')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-blue-900/80" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Join the CityPulse community</h1>
            <p className="text-xl text-green-100">
              Create your account and start making your city better today.
            </p>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Create account</h2>
                <p className="text-gray-600">Join thousands of citizens improving their communities.</p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                      Full name
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="name"
                      required
                      value={formState.username}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="Your name"
                    />
                  </div>

                  <div className="md:col-span-2">
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

                  <div className="md:col-span-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={formState.password}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="At least 8 characters"
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-green-300 transition-colors"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <i className="ri-loader-line animate-spin mr-2" />
                      Creating account…
                    </span>
                  ) : (
                    'Sign up with email'
                  )}
                </button>
              </form>

              <div className="mt-4 text-center text-sm text-gray-500">
                <span>Already have an account? </span>
                <Link href="/login" className="text-green-600 font-semibold hover:text-green-500">
                  Sign in
                </Link>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-center text-sm text-gray-500 mb-4">Or sign up with</div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleAuth0Signup('google-oauth2')}
                    disabled={isSubmitting}
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <i className="ri-google-fill text-red-500 mr-2" />
                    <span className="text-sm font-medium">Google</span>
                  </button>
                  <button
                    onClick={() => handleAuth0Signup('facebook')}
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
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Join our growing community</h2>
              <p className="text-lg text-gray-600">
                Be part of the movement making cities smarter and more responsive.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-green-100 rounded-full mx-auto mb-4">
                  <i className="ri-community-line text-2xl text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Community impact</h3>
                <p className="text-gray-600">Make a real difference in your neighborhood and city.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-blue-100 rounded-full mx-auto mb-4">
                  <i className="ri-shield-check-line text-2xl text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Secure & private</h3>
                <p className="text-gray-600">Your data is protected with enterprise-grade security.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-purple-100 rounded-full mx-auto mb-4">
                  <i className="ri-speed-line text-2xl text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Fast response</h3>
                <p className="text-gray-600">Get quick responses from municipal authorities.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-orange-100 rounded-full mx-auto mb-4">
                  <i className="ri-trophy-line text-2xl text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Recognition</h3>
                <p className="text-gray-600">Earn badges and recognition for your civic contributions.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
