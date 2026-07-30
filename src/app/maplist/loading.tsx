import Cabinet from '@components/templates/Cabinet';
import { skeleton } from '@styles/skeleton.css';

import * as s from './loading.css';

const PLACEHOLDERS = Array.from({ length: 8 });

export default function Loading() {
  return (
    <Cabinet title="Stage Select" back="/" screenLabel="Select Stage" wide>
      <div className={s.grid}>
        {PLACEHOLDERS.map((_, i) => (
          <div key={i} className={s.card}>
            <div
              className={skeleton}
              style={{ aspectRatio: '1', borderRadius: 8 }}
            />
            <div className={skeleton} style={{ height: 13, width: '70%' }} />
            <div className={skeleton} style={{ height: 10, width: '45%' }} />
          </div>
        ))}
      </div>
    </Cabinet>
  );
}
