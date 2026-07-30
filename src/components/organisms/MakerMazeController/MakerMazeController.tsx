'use client';
import { FC, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@components/atoms/Button';
import { useMakerStore } from '@state/maker/store';
import { findPath } from '@utils/findPath';
import { postMaze } from '@api/maze';
import { CellType } from '@type/maze';

import * as s from './MakerMazeController.css';

export interface MakerMazeControllerProps {}
const MakerMazeController: FC<MakerMazeControllerProps> = () => {
  const router = useRouter();
  const maze = useMakerStore((state) => state.maze);
  const currentType = useMakerStore((state) => state.currentType);
  const setCurrentType = useMakerStore((state) => state.setCurrentType);
  const mazeData = useMakerStore((state) => state.mazeData);
  const setResolvedPath = useMakerStore((state) => state.setResolvedPath);
  const startEnd = useMakerStore((state) => state.startEnd);
  const reset = useMakerStore((state) => state.reset);

  const handleCurrentType = (e: MouseEvent<HTMLButtonElement>) => {
    const { name } = e.target as HTMLButtonElement;
    setCurrentType(name as CellType);
  };

  const handleResolveButton = async () => {
    const path = findPath(mazeData, startEnd.start, startEnd.end);
    if (!path) return alert('결과 없음');
    setResolvedPath(path);
    const body = {
      ...maze,
      mazeData: mazeData,
      ...startEnd,
      resolvedPath: path,
    };
    const res = await postMaze(body);
    if (res.status === 'success') {
      reset();
      router.push('/');
    }
  };

  return (
    <div className={s.controller}>
      <span className={s.railLabel}>타일</span>
      <Button
        onClick={handleCurrentType}
        label="시작 지점"
        type="secondary"
        name="start"
        active={currentType === 'start'}
      />
      <Button
        onClick={handleCurrentType}
        label="종료 지점"
        type="secondary"
        name="end"
        active={currentType === 'end'}
      />
      <Button
        onClick={handleCurrentType}
        label="벽(이동 불가)"
        type="secondary"
        name="wall"
        active={currentType === 'wall'}
      />
      <Button
        onClick={handleCurrentType}
        label="길(이동 가능)"
        type="secondary"
        name="road"
        active={currentType === 'road'}
      />
      <div className={s.submit}>
        <Button
          onClick={handleResolveButton}
          label="저장하기"
          type="primary"
        />
      </div>
    </div>
  );
};
export default MakerMazeController;
