import React, { useEffect, useRef } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { WebARRocksFaceThreeHelper } from '@ar-vto/face-tracking';

interface OccluderProps {
  modelUrl: string;
  isDebug?: boolean;
}

export const Occluder: React.FC<OccluderProps> = ({ modelUrl, isDebug = false }) => {
  const gltf = useLoader(GLTFLoader, modelUrl);
  const meshRef = useRef<any>();

  useEffect(() => {
    if (meshRef.current) {
      // Clear children
      while (meshRef.current.children.length > 0) {
        meshRef.current.remove(meshRef.current.children[0]);
      }
      
      const occluderModel = gltf.scene.clone();
      const occluderMesh = (WebARRocksFaceThreeHelper as any).create_occluderMesh?.(occluderModel, isDebug);
      if (occluderMesh) {
        meshRef.current.add(occluderMesh);
      }
    }
  }, [gltf, isDebug]);

  return <object3D ref={meshRef} />;
};
