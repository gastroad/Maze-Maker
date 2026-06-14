import { Meta, StoryObj } from '@storybook/react';
import MazeList, { MazeListProps } from './MazeList';
import { mockMaze } from '@mock/maze';

const meta: Meta<MazeListProps> = {
  title: 'components/organisms/MazeList',
  component: MazeList,
};
export default meta;

type Story = StoryObj<MazeListProps>;

export const Default: Story = {
  args: {
    mazeList: [mockMaze, mockMaze],
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/maplist',
      },
    },
  },
};
