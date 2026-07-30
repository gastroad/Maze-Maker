import { render } from '@testing-library/react';
import NavigationBar from './NavigationBar';

describe('NavigationBar', () => {
  it('children 을 nav 안에 렌더한다', () => {
    const { container, getByText } = render(
      <NavigationBar>
        <>test-text</>
      </NavigationBar>,
    );
    expect(container.firstElementChild?.tagName).toBe('NAV');
    expect(getByText('test-text')).toBeInTheDocument();
  });
});
