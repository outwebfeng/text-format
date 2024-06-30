'use client';

import Error from 'next/error';
import Link from 'next/link';

// Render the default Next.js 404 page when a route
// is requested that doesn't match the middleware and
// therefore doesn't have a locale associated with it.

export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <div className="text-center">
          <p className="text-base font-semibold text-[#ffa11b]">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found</h1>
          <p className="mt-6 text-base leading-7 text-gray-600">Sorry, we couldn't find the page you're looking for.</p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a href="https://text-format.com" className="rounded-md bg-[#ffa11b] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#f05011] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Go back home</a>
          </div>
        </div>
      </body>
    </html>
  );
}
