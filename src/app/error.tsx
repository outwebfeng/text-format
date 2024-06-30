'use client';

import {useEffect} from 'react';
import Link from 'next/link';

type Props = {
  error: Error;
  reset(): void;
};

export default function Error({error, reset}: Props) {

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
      <div>
        <div>Something is error!</div>
        <Link href="https://text-format.com">Go back to Text-Format Home</Link>
      </div>
    );
}
