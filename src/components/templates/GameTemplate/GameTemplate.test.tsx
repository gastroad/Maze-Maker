import { render } from '@testing-library/react';
import GameTemplate, { GameTemplateProps } from './GameTemplate';

describe('GameTemplate', () => {
  const defaultProps: GameTemplateProps = {
    title: '',
    href: 'test-href',
    children: '',
  };

  it('render GameTemplate', () => {
    const { container, getByText, getByRole } = render(
      <GameTemplate {...defaultProps}>GameTemplate</GameTemplate>,
    );
    const linkElement = getByRole('link');
    const childrenElement = getByText('GameTemplate');

    expect(container.firstElementChild).toBeInTheDocument();
    expect(linkElement).toBeInTheDocument();
    expect(childrenElement).toBeInTheDocument();
  });

  it('check GameTemplate href', () => {
    const { getByRole } = render(
      <GameTemplate {...defaultProps}>GameTemplate</GameTemplate>,
    );
    const linkElement = getByRole('link');

    expect(linkElement.getAttribute('href')).toEqual('test-href');
  });
});
