import { FC, ReactNode } from 'react';
import Link from 'next/link';

import ThemeToggle from '@components/atoms/ThemeToggle';

import * as s from './Cabinet.css';

export interface CabinetProps {
  children: ReactNode;
  /** 마퀴(간판)에 표시할 화면 이름. 없으면 브랜드명(MazeMaker). */
  title?: string;
  /** 뒤로가기 링크(href). 홈에서는 생략. */
  back?: string;
  /** 마퀴 우측에 얹을 HUD 노드(시간·별점 등). */
  hud?: ReactNode;
  /** 스크린 상단의 작은 라벨 (예: SELECT STAGE). */
  screenLabel?: string;
  /** 넓은 레이아웃(플레이·메이커·리스트). 기본은 narrow(홈·로그인). */
  wide?: boolean;
}

const Cabinet: FC<CabinetProps> = ({
  children,
  title,
  back,
  hud,
  screenLabel,
  wide = false,
}) => {
  return (
    <div className={s.frame({ wide })}>
      <div className={s.marquee}>
        <div className={s.side}>
          {back && (
            <Link className={s.backBtn} href={back} aria-label="뒤로가기">
              ‹
            </Link>
          )}
          <span className={s.brand}>
            <span className="bolt" aria-hidden>
              ◆
            </span>
            {title ?? 'MazeMaker'}
          </span>
        </div>
        <div className={s.side}>
          {hud}
          <ThemeToggle />
        </div>
      </div>
      <div className={s.screen}>
        {screenLabel && <div className={s.screenLabel}>{screenLabel}</div>}
        {children}
      </div>
    </div>
  );
};

export default Cabinet;
