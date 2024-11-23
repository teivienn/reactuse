import { renderHook } from '@testing-library/react';
import { usePointerLock } from './usePointerLock';

beforeAll(() => {
  Object.defineProperty(document, 'pointerLockElement', {
    configurable: true,
    value: {},
    writable: true
  });
});

it('Should use pointer lock', () => {
  const { result } = renderHook(usePointerLock);
  const { lock, supported, unlock, element } = result.current;

  expect(typeof lock).toBe('function');
  expect(typeof unlock).toBe('function');
  expect(supported).toBeTruthy();
  expect(element).toBeUndefined();
});

// it('Should return current element from usePointerLock', () => {
//   const { result } = renderHook(usePointerLock);
//   const { element } = result.current;

//   const divElement = document.createElement('div');

//   expect(element).toBeUndefined();

//   act(() => {
//     divElement.dispatchEvent(new Event('pointerlockchange'));
//   });

//   expect(element).toBe(divElement);
// });
