import { recipe } from '@vanilla-extract/recipes';

import { vars } from '@styles/theme.css';

export const cell = recipe({
  base: {
    aspectRatio: '1',
    backgroundColor: vars.color.road,
    boxShadow: `inset 0 0 0 0.5px ${vars.color.gridLine}`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: '68%',
    transition: `background-color ${vars.transition.base}`,
  },
  variants: {
    type: {
      start: {},
      end: {},
      road: {},
      wall: {
        backgroundColor: vars.color.wall,
        boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.06)',
        borderRadius: '2px',
      },
      resolve: { backgroundColor: vars.color.resolve },
    },
  },
  defaultVariants: { type: 'road' },
});
