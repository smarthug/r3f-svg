import React, { useRef, useState, useEffect, Suspense } from "react";
import { useFrame , useLoader } from "react-three-fiber";
import * as THREE from 'three'
//import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { SVGLoader  } from './SVGLoader'
import url from './resource/tiger.svg'

import {Tiger} from './tiger'


export function Scene(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef();
  const [svg, setSvg] = useState();

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  
   // console.log(tiger)

  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01));

  useEffect(()=>{
    //loadSVG('resource/tiger.svg')
    
  },[])

  const loadSVG = (url) => {

    let loader = new SVGLoader();

    loader.load(url, function ( data ) {
        console.log(data)
      var paths = data.paths;

      var group = new THREE.Group();
      group.scale.multiplyScalar( 0.25 );
      group.position.x = - 70;
      group.position.y = 70;
      group.scale.y *= - 1;

      for ( var i = 0; i < paths.length; i ++ ) {

        var path = paths[ i ];

        var fillColor = path.userData.style.fill;
        if (  fillColor !== undefined && fillColor !== 'none' ) {

          var material = new THREE.MeshBasicMaterial( {
            color: new THREE.Color().setStyle( fillColor ),
            opacity: path.userData.style.fillOpacity,
            transparent: path.userData.style.fillOpacity < 1,
            side: THREE.DoubleSide,
            depthWrite: false,
            wireframe: true
          } );

          var shapes = path.toShapes( true );

          for ( var j = 0; j < shapes.length; j ++ ) {

            var shape = shapes[ j ];

            var geometry = new THREE.ShapeBufferGeometry( shape );
            var mesh = new THREE.Mesh( geometry, material );

            group.add( mesh );

          }

        }

        var strokeColor = path.userData.style.stroke;

        if (  strokeColor !== undefined && strokeColor !== 'none' ) {

          var material = new THREE.MeshBasicMaterial( {
            color: new THREE.Color().setStyle( strokeColor ),
            opacity: path.userData.style.strokeOpacity,
            transparent: path.userData.style.strokeOpacity < 1,
            side: THREE.DoubleSide,
            depthWrite: false,
            wireframe: false
          } );

          for ( var j = 0, jl = path.subPaths.length; j < jl; j ++ ) {

            var subPath = path.subPaths[ j ];

            var geometry = SVGLoader.pointsToStroke( subPath.getPoints(), path.userData.style );

            if ( geometry ) {

              var mesh = new THREE.Mesh( geometry, material );

              group.add( mesh );

            }

          }

        }

      }

      //scene.add( group );
      console.log(group)
      setSvg(group)

    } );
  }

  return (
    <group>
      <mesh
        {...props}
        ref={mesh}
        scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
        onClick={e => setActive(!active)}
        onPointerOver={e => setHover(true)}
        onPointerOut={e => setHover(false)}
      >
        <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
        <meshStandardMaterial
          attach="material"
          color={hovered ? "hotpink" : "orange"}
        />
      </mesh>

      <Suspense fallback="...loading">
        <Tiger/>
      </Suspense>

    </group>
  );
}
