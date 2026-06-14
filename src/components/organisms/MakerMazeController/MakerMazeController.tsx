'use client';
import { FC, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@components/atoms/Button';
import {
  currentTypeState,
  mazeState,
  mazeDataState,
  resolvedPathState,
  startEndState,
} from '@state/maker/atoms';
import useRecoilStateWithReset from '@hooks/useRecoilStateWithReset';
import { findPath } from '@utils/findPath';
import { postMaze } from '@api/maze';
import { CellType } from '@type/maze';

import './MakerMazeController.scss';

export interface MakerMazeControllerProps {}
const MakerMazeController: FC<MakerMazeControllerProps> = () => {
  const router = useRouter();
  const { get: maze, reset: resetMazeState } =
    useRecoilStateWithReset(mazeState);
  const {
    get: currentType,
    set: setCurrentType,
    reset: resetCurrentTypeState,
  } = useRecoilStateWithReset(currentTypeState);
  const { get: mazeData, reset: resetMazeDataState } =
    useRecoilStateWithReset(mazeDataState);
  const { set: setResolvedPath, reset: resetResolvedPathState } =
    useRecoilStateWithReset(resolvedPathState);
  const { get: startEnd, reset: resetStartEndState } =
    useRecoilStateWithReset(startEndState);

  const resetState = () => {
    resetMazeState();
    resetCurrentTypeState();
    resetMazeDataState();
    resetResolvedPathState();
    resetStartEndState();
  };

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
      resetState();
      router.push('/');
    }
  };

  return (
    <div className="maker-maze-controller">
      <div>
        <Button
          onClick={handleCurrentType}
          label="시작 지점"
          type="primary"
          name="start"
          active={currentType === 'start'}
        />
        <Button
          onClick={handleCurrentType}
          label="종료 지점"
          type="primary"
          name="end"
          active={currentType === 'end'}
        />
      </div>
      <div>
        <Button
          onClick={handleCurrentType}
          label="벽(이동 불가)"
          type="primary"
          name="wall"
          active={currentType === 'wall'}
        />
        <Button
          onClick={handleCurrentType}
          label="길(이동 가능)"
          type="primary"
          name="road"
          active={currentType === 'road'}
        />
      </div>
      <Button
        onClick={handleResolveButton}
        label="find & submit"
        type="primary"
        name="road"
      />
    </div>
  );
};
export default MakerMazeController;
