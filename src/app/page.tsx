import Link from 'next/link';
import HomeTemplate from '@components/templates/HomeTemplate';
import MapTitle from '@components/atoms/MapTitle';
import AuthStatus from '@components/organisms/AuthStatus';

import './style.scss';

export default function Page() {
  return (
    <HomeTemplate>
      <MapTitle title="MazeMaker" />
      <Link className="link-btn" href={'/maplist'}>
        Play
      </Link>
      <Link className="link-btn" href={'/maker'}>
        Make
      </Link>
      <AuthStatus />
    </HomeTemplate>
  );
}
