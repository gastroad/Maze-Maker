import { FC } from 'react';

import { title } from './MapTitle.css';

export interface MapTitleProps {
  title: string;
}
const MapTitle: FC<MapTitleProps> = ({ title: text }) => {
  return <h3 className={title}>{text}</h3>;
};
export default MapTitle;
