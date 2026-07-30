import Link from 'next/link';
import HomeTemplate from '@components/templates/HomeTemplate';
import MapTitle from '@components/atoms/MapTitle';
import AuthStatus from '@components/organisms/AuthStatus';

import * as s from './page.css';

export default function Page() {
  return (
    <HomeTemplate>
      <div className={s.hero}>
        <MapTitle title="MazeMaker" />
        <p className={s.tagline}>
          직접 그리고, 방향키로 플레이하는 미로 게임
        </p>
      </div>
      <div className={s.actions}>
        <Link className={s.linkButton({ variant: 'primary' })} href={'/maplist'}>
          Play
        </Link>
        <Link
          className={s.linkButton({ variant: 'secondary' })}
          href={'/maker'}
        >
          Make
        </Link>
      </div>
      <div className={s.authWrap}>
        <AuthStatus />
      </div>
    </HomeTemplate>
  );
}
