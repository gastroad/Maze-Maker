'use client';
import { FC, ChangeEvent } from 'react';

import TextInputWithLabel from '@components/molecules/TextInputWithLabel';
import { useMakerStore } from '@state/maker/store';

import './MakerMazeForm.scss';

export interface MakerMazeFormProps {}
const MakerMazeForm: FC<MakerMazeFormProps> = () => {
  const maze = useMakerStore((state) => state.maze);
  const setMaze = useMakerStore((state) => state.setMaze);

  const handleMaze = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'col' || name === 'row') {
      if (Number(value) >= 0 && Number.isInteger(Number(value))) {
        setMaze({
          ...maze,
          mazeSize: { ...maze.mazeSize, [name]: Number(value) },
        });
      }
    } else {
      setMaze({ ...maze, [name]: value });
    }
  };

  return (
    <div className="maze-form">
      <TextInputWithLabel
        value={maze.title}
        type="text"
        name="title"
        placeholder="맵 이름"
        onChange={handleMaze}
      />
      <TextInputWithLabel
        value={maze.name}
        type="text"
        name="name"
        placeholder="제작자 이름"
        onChange={handleMaze}
      />
      <div>
        <TextInputWithLabel
          value={maze.mazeSize.col}
          type="number"
          name="col"
          placeholder="미로 행"
          onChange={handleMaze}
        />
        <TextInputWithLabel
          value={maze.mazeSize.row}
          type="number"
          name="row"
          placeholder="미로 열"
          onChange={handleMaze}
        />
      </div>
    </div>
  );
};
export default MakerMazeForm;
