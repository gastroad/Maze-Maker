import { CSSProperties, FC } from 'react';

import { CellType, MazeSizeType } from '@type/maze';
import startImg from '@assets/img/start.png';
import flagImg from '@assets/img/flag.png';

import { cell } from './MazeCell.css';

export interface MazeCellProps extends MazeSizeType {
  type: CellType;
  handleMazeCellClick?: ({ col, row }: MazeSizeType) => void;
}

// 시작/도착 셀은 배경 이미지로 표시(색은 토큰, 이미지는 인라인 스타일).
const MARKER: Partial<Record<CellType, string>> = {
  start: startImg.src,
  end: flagImg.src,
};

const MazeCell: FC<MazeCellProps> = ({
  type,
  handleMazeCellClick,
  col,
  row,
}) => {
  const marker = MARKER[type];
  const style: CSSProperties | undefined = marker
    ? { backgroundImage: `url(${marker})` }
    : undefined;

  // 핸들러가 있을 때만 인터랙티브(썸네일 등 비인터랙티브 렌더는 서버 컴포넌트에서도 안전).
  const onCell = handleMazeCellClick
    ? () => handleMazeCellClick({ col, row })
    : undefined;

  return (
    <div
      className={cell({ type })}
      style={style}
      draggable={onCell ? true : undefined}
      onClick={onCell}
      onDragEnter={onCell}
    />
  );
};
export default MazeCell;
