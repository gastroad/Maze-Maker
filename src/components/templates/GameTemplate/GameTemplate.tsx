import { FC, ReactNode } from 'react';
import Link from 'next/link';
import NavigationBar from '@components/molecules/NavigationBar';
import MapTitle from '@components/atoms/MapTitle';
import Image from 'next/image';
import arrowURL from '@assets/img/arrow.png';

import * as s from './GameTemplate.css';

export interface GameTemplateProps {
  title: string;
  children: ReactNode;
  href: string;
}
const GameTemplate: FC<GameTemplateProps> = ({ title, href, children }) => {
  return (
    <div className={s.template}>
      <NavigationBar>
        <Link className={s.navBack} href={href}>
          <Image src={arrowURL} alt="뒤로가기" />
        </Link>
      </NavigationBar>
      <MapTitle title={title} />
      <div className={s.content}>{children}</div>
    </div>
  );
};

export default GameTemplate;
