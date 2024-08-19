import { useEffect, useRef, useState } from 'react';

import { throttle } from '@/utils/helpers';

export interface UseDeviceMotionReturn {
  interval: DeviceMotionEvent['interval'];
  acceleration: DeviceMotionEventAcceleration
  accelerationIncludingGravity: DeviceMotionEventAcceleration
  rotationRate: DeviceMotionEventRotationRate
}

export interface UseDeviceMotionParams {
  delay?: number;
  callback?: (event: DeviceMotionEvent) => void;
  enabled?: boolean;
}

/**
 * @name useDeviceMotion
 * @description Hook that work with device motion
 * @category Utilities
 *
 * @param {number} [delay=1000] The delay in milliseconds
 * @param {(event: DeviceMotionEvent) => void} [callback] The callback function to be invoked
 * @param {boolean} [enabled=true] Whether to enable the hook
 * @returns {UseDeviceMotionReturn} The device motion data and interval
 *
 * @example
 * const { interval, rotationRate, acceleration, accelerationIncludingGravity } = useDeviceMotion();
 */
export const useDeviceMotion = (params?: UseDeviceMotionParams) => {
  const enabled = params?.enabled ?? true;
  const delay = params?.delay ?? 1000;
  const [deviceMotionData, setDeviceMotionData] = useState<UseDeviceMotionReturn>({
    interval: 0,
    rotationRate: { alpha: null, beta: null, gamma: null },
    acceleration: { x: null, y: null, z: null },
    accelerationIncludingGravity: { x: null, y: null, z: null }
  });
  const internalCallbackRef = useRef(params?.callback);
  internalCallbackRef.current = params?.callback;

  useEffect(() => {
    if (!enabled) return;

    const onDeviceMotion = throttle<[DeviceMotionEvent]>((event) => {
      internalCallbackRef.current?.(event);
      setDeviceMotionData({
        interval: event.interval,
        rotationRate: {
          ...deviceMotionData.rotationRate,
          ...event.rotationRate
        },
        acceleration: {
          ...deviceMotionData.acceleration,
          ...event.acceleration
        },
        accelerationIncludingGravity: {
          ...deviceMotionData.accelerationIncludingGravity,
          ...event.accelerationIncludingGravity
        }
      });
    }, delay);

    window.addEventListener('devicemotion', onDeviceMotion);

    return () => {
      window.removeEventListener('devicemotion', onDeviceMotion);
    };
  }, [delay, enabled]);

  return deviceMotionData;
};