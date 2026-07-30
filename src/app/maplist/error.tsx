'use client';
import ErrorScreen from '@components/organisms/ErrorScreen';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <ErrorScreen
      reset={reset}
      back="/"
      message="미로 목록을 불러오지 못했어요. 다시 시도해 주세요."
    />
  );
}
