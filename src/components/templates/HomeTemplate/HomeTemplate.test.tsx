import { render } from '@testing-library/react';
import HomeTemplate, { HomeTemplateProps } from './HomeTemplate';

describe('HomeTemplate', () => {
  it('render HomeTemplate', () => {
    const { container, getByText } = render(
      <HomeTemplate>HomeTemplate</HomeTemplate>,
    );
    const childrenElement = getByText('HomeTemplate');

    expect(container.firstElementChild).toBeInTheDocument();
    expect(childrenElement).toBeInTheDocument();
  });
});
