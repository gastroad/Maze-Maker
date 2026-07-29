'use client';
import { FC, PointerEvent, useRef, useState } from 'react';

import './VirtualJoystick.scss';

export interface VirtualJoystickProps {
  /** 정규화된 입력 벡터. x = 행축(아래 +), y = 열축(오른쪽 +), 각 -1~1. */
  onChange: (v: { x: number; y: number }) => void;
}

const MAX_TRAVEL = 44; // 썸(thumb) 최대 이동 반경(px)

const VirtualJoystick: FC<VirtualJoystickProps> = ({ onChange }) => {
  const baseRef = useRef<HTMLDivElement>(null);
  const activeId = useRef<number | null>(null);
  const [thumb, setThumb] = useState({ x: 0, y: 0 });

  const update = (clientX: number, clientY: number) => {
    const base = baseRef.current;
    if (!base) return;
    const r = base.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    let dx = clientX - cx;
    let dy = clientY - cy;
    const len = Math.hypot(dx, dy);
    if (len > MAX_TRAVEL) {
      dx = (dx / len) * MAX_TRAVEL;
      dy = (dy / len) * MAX_TRAVEL;
    }
    setThumb({ x: dx, y: dy });
    // 화면 x(가로) → 열축 y, 화면 y(세로) → 행축 x
    onChange({ x: dy / MAX_TRAVEL, y: dx / MAX_TRAVEL });
  };

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    activeId.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    update(e.clientX, e.clientY);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (activeId.current === e.pointerId) update(e.clientX, e.clientY);
  };
  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    if (activeId.current !== e.pointerId) return;
    activeId.current = null;
    setThumb({ x: 0, y: 0 });
    onChange({ x: 0, y: 0 });
  };

  return (
    <div
      className="joystick"
      ref={baseRef}
      role="group"
      aria-label="이동 조이스틱"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <div
        className="joystick-thumb"
        style={{ transform: `translate(${thumb.x}px, ${thumb.y}px)` }}
      />
    </div>
  );
};

export default VirtualJoystick;
