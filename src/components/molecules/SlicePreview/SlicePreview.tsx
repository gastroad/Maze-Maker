'use client';
import { FC, useCallback, useEffect, useRef, useState } from 'react';

import { drawSlicePreview, readPalette, type Palette } from '@game/renderer';
import { sliceTerrain, type SliceAxis } from '@game/mazeEngine';
import type { MazeDataType } from '@type/maze';

import * as s from './SlicePreview.css';

export interface SlicePreviewProps {
  mazeData: MazeDataType;
  axis: SliceAxis;
  /** 세울 줄의 인덱스. null 이면 안내만 보여 준다. */
  index: number | null;
  /** 그 줄 위에서 커서가 놓인 위치(강조 표시용). */
  marker?: number | null;
  onToggleAxis: () => void;
}

/**
 * 편집 중인 미로의 한 줄을 세워서 보여 준다.
 * 지형을 만들면서 "옆에서 보면 어떤 모양인지"를 확인할 수 있어야
 * 넘을 수 있는 턱과 못 넘는 벽을 의도대로 배치할 수 있다.
 */
const SlicePreview: FC<SlicePreviewProps> = ({
  mazeData,
  axis,
  index,
  marker,
  onToggleAxis,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paletteRef = useRef<Palette | null>(null);
  const [themeTick, setThemeTick] = useState(0);

  useEffect(() => {
    const refresh = () => {
      paletteRef.current = readPalette(document.documentElement);
      setThemeTick((t) => t + 1);
    };
    refresh();
    const mo = new MutationObserver(refresh);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });
    return () => mo.disconnect();
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const pal = paletteRef.current;
    if (!canvas || !pal || index == null) return;
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

    const limit = axis === 'col' ? mazeData[0].length : mazeData.length;
    if (index < 0 || index >= limit) return;
    const terrain = sliceTerrain(mazeData, axis, index);
    drawSlicePreview(ctx, terrain, { width: w, height: h, cell: 0 }, pal, marker);
  }, [mazeData, axis, index, marker]);

  useEffect(() => {
    draw();
  }, [draw, themeTick]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => draw());
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [draw]);

  return (
    <div className={s.wrap}>
      <div className={s.head}>
        <span className={s.title}>
          단면 미리보기
          {index != null && (
            <span className={s.index}>
              {axis === 'col' ? '열' : '행'} {String(index).padStart(2, '0')}
            </span>
          )}
        </span>
        <button type="button" className={s.toggle} onClick={onToggleAxis}>
          {axis === 'col' ? '세로 ⇄' : '가로 ⇄'}
        </button>
      </div>
      {index == null ? (
        <p className={s.empty}>보드 위에 커서를 올리면 그 줄의 단면이 보입니다.</p>
      ) : (
        <canvas ref={canvasRef} className={s.canvas} aria-label="단면 미리보기" />
      )}
    </div>
  );
};

export default SlicePreview;
