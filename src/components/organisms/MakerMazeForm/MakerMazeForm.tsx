'use client';
import { FC, ChangeEvent, KeyboardEvent, useState } from 'react';

import TextInputWithLabel from '@components/molecules/TextInputWithLabel';
import { useMakerStore } from '@state/maker/store';

import * as s from './MakerMazeForm.css';

/** 캔버스 렌더는 100x100 을 감당하지만, 그 이상은 편집 자체가 비현실적이다. */
export const MIN_SIZE = 2;
export const MAX_SIZE = 100;

type SizeField = 'rows' | 'cols';

export interface MakerMazeFormProps {}
const MakerMazeForm: FC<MakerMazeFormProps> = () => {
  const maze = useMakerStore((state) => state.maze);
  const setMaze = useMakerStore((state) => state.setMaze);

  // 크기는 타이핑 도중의 값마다 확정하면 안 된다. "10" 을 치는 사이 "1" 이
  // 잠깐 확정되어 판이 통째로 새로 만들어지기 때문이다. 입력 중에는 문자열
  // 초안만 들고 있다가 blur(또는 Enter)에 한 번만 확정한다.
  const [draft, setDraft] = useState(() => ({
    rows: String(maze.mazeSize.rows),
    cols: String(maze.mazeSize.cols),
  }));

  const handleText = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMaze({ ...maze, [name]: value });
  };

  const handleSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDraft((d) => ({ ...d, [name as SizeField]: value }));
  };

  const commitSize = (field: SizeField) => {
    const raw = draft[field].trim();
    const parsed = Number(raw);
    // 빈 값이나 숫자가 아니면 직전 값으로 되돌린다.
    const next =
      raw === '' || !Number.isFinite(parsed)
        ? maze.mazeSize[field]
        : Math.min(MAX_SIZE, Math.max(MIN_SIZE, Math.round(parsed)));

    // 초안을 정규화된 값으로 되써서 "007" 이나 "3.7" 같은 표기를 정리한다.
    setDraft((d) => ({ ...d, [field]: String(next) }));
    if (next !== maze.mazeSize[field]) {
      setMaze({ ...maze, mazeSize: { ...maze.mazeSize, [field]: next } });
    }
  };

  // Enter 로도 확정되게 — blur 를 일으켜 확정 경로를 하나로 유지한다.
  const handleSizeKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') e.currentTarget.blur();
  };

  return (
    <div className={s.form}>
      <TextInputWithLabel
        value={maze.title}
        type="text"
        name="title"
        placeholder="맵 이름"
        onChange={handleText}
      />
      <TextInputWithLabel
        value={maze.name}
        type="text"
        name="name"
        placeholder="제작자 이름"
        onChange={handleText}
      />
      <div className={s.sizeRow}>
        <TextInputWithLabel
          value={draft.rows}
          type="number"
          name="rows"
          placeholder={`미로 행 (${MIN_SIZE}~${MAX_SIZE})`}
          min={MIN_SIZE}
          max={MAX_SIZE}
          inputMode="numeric"
          onChange={handleSizeChange}
          onBlur={() => commitSize('rows')}
          onKeyDown={handleSizeKeyDown}
        />
        <TextInputWithLabel
          value={draft.cols}
          type="number"
          name="cols"
          placeholder={`미로 열 (${MIN_SIZE}~${MAX_SIZE})`}
          min={MIN_SIZE}
          max={MAX_SIZE}
          inputMode="numeric"
          onChange={handleSizeChange}
          onBlur={() => commitSize('cols')}
          onKeyDown={handleSizeKeyDown}
        />
      </div>
    </div>
  );
};
export default MakerMazeForm;
