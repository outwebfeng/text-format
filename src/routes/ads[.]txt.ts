import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/ads.txt')({
  server: {
    handlers: {
      GET: () =>
        new Response('google.com, pub-7741547389250990, DIRECT, f08c47fec0942fa0\n', {
          headers: { 'Content-Type': 'text/plain' },
        }),
    },
  },
});
