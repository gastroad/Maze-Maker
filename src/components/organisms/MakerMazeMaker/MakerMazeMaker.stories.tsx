import { Meta, StoryObj } from '@storybook/react';
import MakerMazeMaker, { MakerMazeMakerProps } from './MakerMazeMaker';

const meta: Meta<MakerMazeMakerProps> = {
  title: 'components/organisms/MakerMazeMaker',
  component: MakerMazeMaker,
};
export default meta;

type Story = StoryObj<MakerMazeMakerProps>;

export const Default: Story = {
  args: {},
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/maker',
      },
    },
  },
};
