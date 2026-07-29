import { MazeType } from '@type/maze';

interface ApiResponse<T> {
  status: string;
  results: T;
}

// 클라이언트(브라우저)에서 호출 — 상대경로라 dev 포트와 무관하게 동작한다.
export async function postMaze(body: MazeType): Promise<ApiResponse<MazeType>> {
  const res = await fetch('/api/mazelist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Failed to save maze');
  return res.json();
}

export async function deleteMaze(id: string): Promise<{ status: string }> {
  const res = await fetch(`/api/mazelist/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || 'Failed to delete maze');
  }
  return res.json();
}
