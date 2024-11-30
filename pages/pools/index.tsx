// pages/pools/index.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function PoolsIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/pools/dexterity');
  }, [router]);

  return null;
}
