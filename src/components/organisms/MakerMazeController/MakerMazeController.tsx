'use client';
import { FC } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@components/atoms/Button';
import { useMakerStore, HEIGHT_BRUSHES } from '@state/maker/store';
import { findPath, findPathDetailed } from '@utils/findPath';
import { postMaze } from '@api/maze';

import * as s from './MakerMazeController.css';

export interface MakerMazeControllerProps {}
const MakerMazeController: FC<MakerMazeControllerProps> = () => {
  const router = useRouter();
  const maze = useMakerStore((state) => state.maze);
  const brush = useMakerStore((state) => state.brush);
  const setBrush = useMakerStore((state) => state.setBrush);
  const mazeData = useMakerStore((state) => state.mazeData);
  const setResolvedPath = useMakerStore((state) => state.setResolvedPath);
  const setPathPreview = useMakerStore((state) => state.setPathPreview);
  const pathPreview = useMakerStore((state) => state.pathPreview);
  const startEnd = useMakerStore((state) => state.startEnd);
  const reset = useMakerStore((state) => state.reset);

  // 편집할 때마다 A* 를 돌리면 큰 미로에서 무거우므로 눌렀을 때만 계산한다.
  const handleCheckPath = () => {
    if (pathPreview) {
      setPathPreview(null);
      return;
    }
    const path = findPathDetailed(mazeData, startEnd.start, startEnd.end);
    if (!path) {
      alert('시작에서 도착까지 갈 수 있는 길이 없습니다.');
      return;
    }
    setPathPreview(path);
  };

  const handleResolveButton = async () => {
    // findPath 는 시점 전환과 점프까지 감안해 길을 찾는다. 그래도 없다면
    // 실제로 깰 수 없는 미로이므로 저장하지 않는다.
    const path = findPath(mazeData, startEnd.start, startEnd.end);
    if (!path) {
      alert('시작에서 도착까지 갈 수 있는 길이 없습니다.');
      return;
    }
    setResolvedPath(path);
    const body = {
      ...maze,
      mazeData,
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
      <span className={s.railLabel}>지점</span>
      <Button
        onClick={() => setBrush({ kind: 'start' })}
        label="시작 지점"
        type="secondary"
        active={brush.kind === 'start'}
      />
      <Button
        onClick={() => setBrush({ kind: 'end' })}
        label="종료 지점"
        type="secondary"
        active={brush.kind === 'end'}
      />

      <span className={s.railLabel}>높이</span>
      {HEIGHT_BRUSHES.map((h) => (
        <Button
          key={h.value}
          onClick={() => setBrush({ kind: 'height', value: h.value })}
          label={`${h.value} · ${h.label}`}
          type="secondary"
          active={brush.kind === 'height' && brush.value === h.value}
        />
      ))}
      <p className={s.hint}>
        {brush.kind === 'height'
          ? HEIGHT_BRUSHES.find((h) => h.value === brush.value)?.hint
          : '칸을 클릭해 지점을 옮깁니다.'}
      </p>

      <div className={s.submit}>
        <Button
          onClick={handleCheckPath}
          label={pathPreview ? '경로 숨기기' : '경로 확인'}
          type="secondary"
          active={!!pathPreview}
        />
        <Button onClick={handleResolveButton} label="저장하기" type="primary" />
      </div>
    </div>
  );
};
export default MakerMazeController;
