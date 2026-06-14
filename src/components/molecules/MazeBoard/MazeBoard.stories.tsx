import { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import MazeBoard, { MazeBoardProps } from './MazeBoard';
import {
  mockEnd,
  mockStart,
  mockMazeData,
  mockResolvedPath,
} from '@mock/maze';

const meta: Meta<MazeBoardProps> = {
  title: 'components/molecules/MazeBoard',
  component: MazeBoard,
};
export default meta;

type Story = StoryObj<MazeBoardProps>;

export const Default: Story = {
  args: {
    height: 400,
    handleMazeCellClick: action('click'),
    start: mockStart,
    end: mockEnd,
    mazeData: mockMazeData,
    resolvedPath: mockResolvedPath,
  },
};
