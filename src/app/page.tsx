import Link from 'next/link';
import Cabinet from '@components/templates/Cabinet';
import MapTitle from '@components/atoms/MapTitle';
import AuthStatus from '@components/organisms/AuthStatus';

import * as s from './page.css';

export default function Page() {
  return (
    <Cabinet screenLabel="Insert Coin">
      <div className={s.attract}>
        <MapTitle title="MazeMaker" />
        <p className={s.tagline}>
          직접 그리고, 방향키로 플레이하는 미로 게임
        </p>
        <nav className={s.menu}>
          <Link
            className={s.menuItem({ variant: 'primary' })}
            href="/maplist"
          >
            <span className={s.menuIcon} aria-hidden>
              ▶
            </span>
            PLAY
          </Link>
          <Link className={s.menuItem()} href="/maker">
            <span className={s.menuIcon} aria-hidden>
              ✎
            </span>
            MAKE
          </Link>
        </nav>
        <div className={s.authWrap}>
          <AuthStatus />
        </div>
      </div>
    </Cabinet>
  );
}
