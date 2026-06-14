import { Meta, StoryObj } from '@storybook/react';
import PlayMazeGame, { PlayMazeGameProps } from './PlayMazeGame';
import { mockMaze } from '@mock/maze';

const meta: Meta<PlayMazeGameProps> = {
  title: 'components/organisms/PlayMazeGame',
  component: PlayMazeGame,
};
export default meta;

type Story = StoryObj<PlayMazeGameProps>;

export const Default: Story = {
  args: {
    maze: mockMaze,
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/player',
      },
    },
  },
};
