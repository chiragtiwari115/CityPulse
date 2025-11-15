'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useUser } from '@/lib/user-context';

export default function Auth0CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { completeAuth0Login } = useUser();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code) {
      setError('Missing authorization code.');
      return;
    }

    completeAuth0Login(code, state)
      .then(() => {
        router.replace('/submit-complaint');
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'We could not complete the login.';
        setError(message);
      });
  }, [completeAuth0Login, router, searchParams]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex flex-col items-center justify-center py-24 px-4">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center space-y-4">
          {!error ? (
            <>
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Just a moment…</h1>
              <p className="text-sm text-gray-600">
                We’re finishing up your login and getting everything ready.
              </p>
            </>
          ) : (
            <>
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <i className="ri-error-warning-line text-2xl text-red-600" />
                </div>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">We hit a snag</h1>
              <p className="text-sm text-red-600">{error}</p>
              <button
                onClick={() => router.replace('/login')}
                className="mt-4 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
              >
                Back to login
              </button>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

