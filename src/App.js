import React, { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import {Scene} from "./scene";
import * as THREE from 'three'

function App() {
  return (
    <div style={{height:"100vh"}}>
      <Canvas
        gl={{antialias: false}}
        onCreated={({gl}) => {
          gl.setClearColor(new THREE.Color('black'))
        }}
      >
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback="...loading">

        <Scene  />
        </Suspense>
        
      </Canvas>
    </div>
  );
}

export default App;
