import React, { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import {Scene} from "./scene";

function App() {
  return (
    <div style={{height:"100vh"}}>
      <Canvas>
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
