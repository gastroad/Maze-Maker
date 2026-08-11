/**
 * 기록 시간을 `분:초.1/100초` 로. 스코어보드와 결과 화면이 같은 표기를 써야
 * 플레이 중에 보던 숫자와 끝나고 보는 숫자가 어긋나지 않는다.
 */
export function formatTime(ms: number): string {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const sec = total % 60;
  const cs = Math.floor((ms % 1000) / 10);
  return `${m}:${String(sec).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
}
