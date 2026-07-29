import Link from 'next/link';
import HomeTemplate from '@components/templates/HomeTemplate';
import MapTitle from '@components/atoms/MapTitle';
import AuthStatus from '@components/organisms/AuthStatus';

import './style.scss';

export default function Page() {
  return (
    <HomeTemplate>
      <div className="home-hero">
        <MapTitle title="MazeMaker" />
        <p className="home-tagline">
          직접 그리고, 방향키로 플레이하는 미로 게임
        </p>
      </div>
      <div className="home-actions">
        <Link className="link-btn" href={'/maplist'}>
          Play
        </Link>
        <Link className="link-btn" href={'/maker'}>
          Make
        </Link>
      </div>
      <AuthStatus />
    </HomeTemplate>
  );
}
