import { render, fireEvent } from '@testing-library/react';
import NavigationBar, { NavigationBarProps } from './NavigationBar';
import { mockMaze } from '@mock/maze';

describe('NavigationBar', () => {
  it('render NavigationBar', () => {
    const { container, getByText } = render(
      <NavigationBar>
        <>test-text</>
      </NavigationBar>,
    );

    const navigationBarElement = container.querySelector('.navigation-bar');
    const childrenElement = getByText('test-text');

    expect(navigationBarElement).toBeInTheDocument;
    expect(childrenElement).toBeInTheDocument;
  });
});
