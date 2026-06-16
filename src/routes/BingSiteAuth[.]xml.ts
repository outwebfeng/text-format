import { createFileRoute } from '@tanstack/react-router';

const bingSiteAuthXml = [
  '<?xml version="1.0"?>',
  '<users>',
  '\t<user>9A63F2F982BADA4D0007E2C85C3B4998</user>',
  '</users>',
  '',
].join('\n');

export const Route = createFileRoute('/BingSiteAuth.xml')({
  server: {
    handlers: {
      GET: () =>
        new Response(bingSiteAuthXml, {
          headers: { 'Content-Type': 'application/xml' },
        }),
    },
  },
});
