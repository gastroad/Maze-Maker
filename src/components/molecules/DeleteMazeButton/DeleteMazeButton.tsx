'use client';
import { FC, MouseEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import { deleteMaze } from '@api/maze';

import './DeleteMazeButton.scss';

export interface DeleteMazeButtonProps {
  mazeId: string;
}
const DeleteMazeButton: FC<DeleteMazeButtonProps> = ({ mazeId }) => {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e: MouseEvent<HTMLButtonElement>) => {
    // 부모 Link 이동/클릭 전파 방지
    e.preventDefault();
    e.stopPropagation();
    setDeleting(true);
    try {
      await deleteMaze(mazeId);
      router.refresh();
    } catch {
      setDeleting(false);
    }
  };

  return (
    <button
      className="delete-maze-button"
      onClick={handleDelete}
      disabled={deleting}
      aria-label="미로 삭제"
    >
      {deleting ? '삭제 중…' : '삭제'}
    </button>
  );
};
export default DeleteMazeButton;
