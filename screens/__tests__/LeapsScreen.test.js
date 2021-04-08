import React from 'react';
import { act, create } from 'react-test-renderer';
import LeapsScreen from '../LeapsScreen';

const tree = create(<LeapsScreen />);

test('filter clicked', () => {
  const modal = tree.root.findByProps({ testId: 'modal' }).props;
  expect(modal.visible).toEqual(false);

  const filter = tree.root.findByProps({ testId: 'filter' }).props;

  act(() => filter.onPress());
  expect(modal.visible).toEqual(true);
});
