import { MazeType } from '@type/maze';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

interface ApiResponse<T> {
  status: string;
  results: T;
}

async function request<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>> {
  const res = await fetch(`${BASE_URL}${path}`, init);
  if (!res.ok) throw new Error('Failed to fetch data');
  return res.json();
}

export function getMazeList() {
  return request<MazeType[]>('/api/mazelist', { cache: 'no-store' });
}

export function getMaze(id: MazeType['id']) {
  return request<MazeType>(`/api/mazelist/${id}`, { cache: 'no-store' });
}

export function postMaze(body: MazeType) {
  return request<MazeType>('/api/mazelist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}
