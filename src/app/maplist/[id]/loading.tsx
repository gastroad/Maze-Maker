import Cabinet from '@components/templates/Cabinet';
import { skeleton } from '@styles/skeleton.css';

import * as s from './loading.css';

export default function Loading() {
  return (
    <Cabinet back="/maplist" wide>
      <div className={s.wrap}>
        <div className={`${skeleton} ${s.board}`} />
        <div className={s.deck}>
          <div
            className={skeleton}
            style={{ width: 120, height: 120, borderRadius: '50%' }}
          />
          <div className={skeleton} style={{ height: 12, width: 160 }} />
          <div
            className={skeleton}
            style={{ height: 40, width: '100%', borderRadius: 10 }}
          />
        </div>
      </div>
    </Cabinet>
  );
}
