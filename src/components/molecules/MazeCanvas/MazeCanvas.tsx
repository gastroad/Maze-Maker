'use client';
import { FC, PointerEvent, useCallback, useEffect, useRef, useState } from 'react';

import { cellAt, drawStaticMaze, fitMetrics } from '@game/renderer';
import useThemePalette from '@hooks/useThemePalette';
import type { PathStep } from '@utils/findPath';
import type { MazeDataType, PointType } from '@type/maze';

import * as s from './MazeCanvas.css';

export interface MazeCanvasProps {
  mazeData: MazeDataType;
  start: PointType;
  end: PointType;
  /** 넘기면 편집 모드가 된다 — 클릭과 드래그로 칸을 칠할 수 있다. */
  onPaint?: (row: number, col: number) => void;
  /** 각 칸에 높이 숫자를 겹쳐 그린다(셀이 충분히 클 때만). */
  showValues?: boolean;
  /** 최적 경로. 셀을 덮지 않고 얇은 선으로 긋는다. */
  path?: PathStep[] | null;
  /** 커서가 놓인 칸이 바뀔 때 알린다(단면 미리보기 연동용). */
  onHoverChange?: (cell: { row: number; col: number } | null) => void;
  label?: string;
}

/**
 * 미로를 캔버스 한 장에 그린다. 셀마다 DOM 노드를 만들면 100x100 에서
 * 10,000 개가 되어 편집도 목록 렌더도 버티지 못한다.
 */
const MazeCanvas: FC<MazeCanvasProps> = ({
  mazeData,
  start,
  end,
  onPaint,
  showValues,
  path,
  onHoverChange,
  label,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hover, setHover] = useState<{ row: number; col: number } | null>(null);
  const paintingRef = useRef(false);
  // 한 번 그리고 마는 캔버스라 테마가 바뀌면 다시 그릴 계기가 필요하다
  const { paletteRef, themeTick } = useThemePalette(true);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const pal = paletteRef.current;
    if (!canvas || !pal) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(canvas.clientWidth * dpr);
    const h = Math.round(canvas.clientHeight * dpr);
    if (w === 0 || h === 0) return;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    const metrics = fitMetrics(mazeData, w, h);
    drawStaticMaze(ctx, { mazeData, start, end }, metrics, pal, {
      hover: onPaint ? hover : null,
      showValues,
      path: path ?? undefined,
    });
  }, [mazeData, start, end, hover, onPaint, showValues, path, paletteRef]);

  useEffect(() => {
    draw();
  }, [draw, themeTick]);

  // 컨테이너 크기가 바뀌면 다시 그린다
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => draw());
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [draw]);

  const locate = (e: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const x = (e.clientX - rect.left) * dpr;
    const y = (e.clientY - rect.top) * dpr;
    const metrics = fitMetrics(mazeData, canvas.width, canvas.height);
    return cellAt(mazeData, metrics, x, y);
  };

  const onPointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!onPaint) return;
    const at = locate(e);
    if (!at) return;
    paintingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    onPaint(at.row, at.col);
  };

  const onPointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!onPaint) return;
    const at = locate(e);
    setHover(at);
    onHoverChange?.(at);
    // 드래그 중이면 지나가는 칸을 계속 칠한다.
    // 같은 값이면 store 가 상태를 바꾸지 않으므로 리렌더가 발생하지 않는다.
    if (paintingRef.current && at) onPaint(at.row, at.col);
  };

  const stopPainting = () => {
    paintingRef.current = false;
  };

  return (
    <canvas
      ref={canvasRef}
      className={onPaint ? s.editable : s.canvas}
      aria-label={label ?? '미로'}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopPainting}
      onPointerCancel={stopPainting}
      onPointerLeave={() => {
        stopPainting();
        setHover(null);
        onHoverChange?.(null);
      }}
    />
  );
};

export default MazeCanvas;
