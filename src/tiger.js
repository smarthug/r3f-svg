import React, { useRef, useState, useEffect, Suspense } from "react";
import { useFrame, useLoader, Dom , extend, useThree } from "react-three-fiber";
import * as THREE from "three";
//import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { SVGLoader } from "./SVGLoader";
import url from "./resource/tiger.svg";
import threeUrl from './resource/three.svg'


import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

extend({ OrbitControls })
/** This component renders a shape */
function Shape({ shape  }) {
    return (
      <mesh >
        <meshPhongMaterial attach="material"  depthWrite={false} transparent />
        <shapeBufferGeometry attach="geometry" args={[shape]} />
      </mesh>
    )
  }


  function Controls(props) {
    const { camera, gl } = useThree()
    const ref = useRef()
    useFrame(() => ref.current.update())
    return <orbitControls ref={ref} target={[0, 0, 0]} {...props} args={[camera, gl.domElement]} enableRotate={false} screenSpacePanning={true} />
  }

export function Tiger(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef();
  const [svg, setSvg] = useState();
  const [visible, setVisible] = useState(false);

  // const tiger = useLoader(SVGLoader, url, loader => {
  //   console.log(loader);
  // });
  //console.log(tiger);
  // console.log(tiger)

 
  // console.log(test)

  const loadSVG = url => {
    let loader = new SVGLoader();

    loader.load(url, function(data) {
      console.log(data);
      var paths = data;

      var group = new THREE.Group();
      group.scale.multiplyScalar(0.25);
      group.position.x = -70;
      group.position.y = 70;
      group.scale.y *= -1;

      for (var i = 0; i < paths.length; i++) {
        var path = paths[i];

        var fillColor = path.color;
        if (fillColor !== undefined && fillColor !== "none") {
          var material = new THREE.MeshBasicMaterial({
            color: path.color,
           
            side: THREE.DoubleSide,
            depthWrite: false,
            wireframe: false
          });

          var shapes = path.toShapes(true);

          for (var j = 0; j < shapes.length; j++) {
            var shape = shapes[j];

            var geometry = new THREE.ShapeBufferGeometry(shape);
            var mesh = new THREE.Mesh(geometry, material);

            group.add(mesh);
          }
        }

        var strokeColor = path.color;

        if (strokeColor !== undefined && strokeColor !== "none") {
          var material = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setStyle(strokeColor),
          
            side: THREE.DoubleSide,
            depthWrite: false,
            wireframe: false
          });

          
        }
      }

      //scene.add( group );
      console.log(group);
      //setSvg(group);
      setSvg(group)
    });
  };

  useEffect(()=>{
    let test = loadSVG(threeUrl)
    //setSvg(test)
    console.log(svg)
  },[])

  function handleClick(){
    console.log('hihi');

    setVisible(!visible)

    console.log(svg)
    loadSVG(url)
  }

  return (
    <group>
      <Controls/>
      <Dom>
        <button onClick={handleClick}>hihi</button>
      </Dom>
      

        {/* { visible && <primitive object={svg}></primitive>} */}

        {/* { visible && <primitive object={svg}></primitive>} */}

      {visible &&  <group position={[-70,70,0]} scale={[0.25,-0.25,0.25]}>
          {svg.children.map((v,i)=>{
            return(
              <mesh key={v.uuid}>
                <primitive object={v.geometry}  attach="geometry"/>
                <primitive object={v.material}  attach="material"/>
              </mesh>
            )
          })}
        </group>}
     
     

      {/* {tiger.map(({item, key , props}) => {
          return(

              <Shape key={key} {...item} {...props} />
          )
      })

      } */}
    </group>
  );
}
