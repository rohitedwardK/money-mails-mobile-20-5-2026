/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
jest.mock('../src/screens/Login', () => () => null);
jest.mock('../src/screens/User', () => () => null);

import App from '../App';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
