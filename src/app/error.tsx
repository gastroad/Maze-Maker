'use client';
import ErrorScreen from '@components/organisms/ErrorScreen';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return <ErrorScreen reset={reset} back="/" />;
}
