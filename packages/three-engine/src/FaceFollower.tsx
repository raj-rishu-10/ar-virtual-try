import React, { useRef, useEffect } from 'react';
import { WebARRocksFaceThreeHelper } from '@ar-vto/face-tracking';

interface FaceFollowerProps {
  children: React.ReactNode;
  faceIndex?: number;
}

export const FaceFollower: React.FC<FaceFollowerProps> = ({ children, faceIndex = 0 }) => {
  const parentRef = useRef<any>();
  const followerRef = useRef<any>();

  useEffect(() => {
    if (parentRef.current && followerRef.current) {
      (WebARRocksFaceThreeHelper as any).set_faceFollower?.(parentRef.current, followerRef.current, faceIndex);
    }
  }, [faceIndex]);

  return (
    <object3D ref={parentRef}>
      <object3D ref={followerRef}>
        {children}
      </object3D>
    </object3D>
  );
};
