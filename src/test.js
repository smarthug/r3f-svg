import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

//let scene, renderer, camera;
// orbit controls 확인 필요 ....

var views = [];

var scene, renderer;

var mouseX = 0,
  mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var controls

function View(
  canvas,
  fullWidth,
  fullHeight,
  viewX,
  viewY,
  viewWidth,
  viewHeight
) {
  console.log(canvas);
  canvas.width = viewWidth * window.devicePixelRatio;
  canvas.height = viewHeight * window.devicePixelRatio;

  var context = canvas.getContext("2d");

  var camera = new THREE.PerspectiveCamera(
    20,
    viewWidth / viewHeight,
    1,
    10000
  );
  // camera.setViewOffset(
  //   fullWidth,
  //   fullHeight,
  //   viewX,
  //   viewY,
  //   viewWidth,
  //   viewHeight
  // );
  camera.position.z = 1800;

  
  var control  = new OrbitControls(camera, canvas);
  this.render = function() {
    //   camera.position.x += (mouseX - camera.position.x) * 0.05;
    //   camera.position.y += (-mouseY - camera.position.y) * 0.05;
    //   camera.lookAt(scene.position);

    renderer.render(scene, camera);

    
    
    control.update();

    context.drawImage(renderer.domElement, 0, 0);
  };
}

export default function Test() {
  const canvas1Ref = useRef();
  const canvas2Ref = useRef();
  const rootRef = useRef();
  useEffect(() => {
    init();
    animate();
  }, []);

  function init() {
    var canvas1 = canvas1Ref.current;
    var canvas2 = canvas2Ref.current;

    var w = 500,
      h = 500;

    var fullWidth = w * 2;
    var fullHeight = h * 2;

    views.push(new View(canvas1, fullWidth, fullHeight, w * 0, h * 0, w, h));
    views.push(new View(canvas2, fullWidth, fullHeight, w * 1, h * 0, w, h));

    //

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 0, 1).normalize();
    scene.add(light);

    // shadow

    var canvas = document.createElement("canvas");
    // canvas.width = 500;
    // canvas.height = 500;

    // context.fillRect(0, 0, canvas.width, canvas.height);

    var shadowTexture = new THREE.CanvasTexture(canvas);

    var shadowMaterial = new THREE.MeshBasicMaterial({ map: shadowTexture });
    var shadowGeo = new THREE.PlaneBufferGeometry(300, 300, 1, 1);

    var shadowMesh;

    shadowMesh = new THREE.Mesh(shadowGeo, shadowMaterial);
    shadowMesh.position.y = -250;
    shadowMesh.rotation.x = -Math.PI / 2;
    scene.add(shadowMesh);

    shadowMesh = new THREE.Mesh(shadowGeo, shadowMaterial);
    shadowMesh.position.x = -400;
    shadowMesh.position.y = -250;
    shadowMesh.rotation.x = -Math.PI / 2;
    scene.add(shadowMesh);

    shadowMesh = new THREE.Mesh(shadowGeo, shadowMaterial);
    shadowMesh.position.x = 400;
    shadowMesh.position.y = -250;
    shadowMesh.rotation.x = -Math.PI / 2;
    scene.add(shadowMesh);

    var radius = 200;

    var geometry1 = new THREE.IcosahedronBufferGeometry(radius, 1);

    var count = geometry1.attributes.position.count;
    geometry1.setAttribute(
      "color",
      new THREE.BufferAttribute(new Float32Array(count * 3), 3)
    );

    var geometry2 = geometry1.clone();
    var geometry3 = geometry1.clone();

    var color = new THREE.Color();
    var positions1 = geometry1.attributes.position;
    var positions2 = geometry2.attributes.position;
    var positions3 = geometry3.attributes.position;
    var colors1 = geometry1.attributes.color;
    var colors2 = geometry2.attributes.color;
    var colors3 = geometry3.attributes.color;

    for (var i = 0; i < count; i++) {
      color.setHSL((positions1.getY(i) / radius + 1) / 2, 1.0, 0.5);
      colors1.setXYZ(i, color.r, color.g, color.b);

      color.setHSL(0, (positions2.getY(i) / radius + 1) / 2, 0.5);
      colors2.setXYZ(i, color.r, color.g, color.b);

      color.setRGB(1, 0.8 - (positions3.getY(i) / radius + 1) / 2, 0);
      colors3.setXYZ(i, color.r, color.g, color.b);
    }

    var material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      flatShading: true,
      vertexColors: THREE.VertexColors,
      shininess: 0
    });

    var wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      wireframe: true,
      transparent: true
    });

    var mesh = new THREE.Mesh(geometry1, material);
    var wireframe = new THREE.Mesh(geometry1, wireframeMaterial);
    mesh.add(wireframe);
    mesh.position.x = -400;
    mesh.rotation.x = -1.87;
    //scene.add(mesh);

    var mesh = new THREE.Mesh(geometry2, material);
    var wireframe = new THREE.Mesh(geometry2, wireframeMaterial);
    mesh.add(wireframe);
    mesh.position.x = 400;
    //scene.add(mesh);

    var mesh = new THREE.Mesh(geometry3, material);
    var wireframe = new THREE.Mesh(geometry3, wireframeMaterial);
    mesh.add(wireframe);
    //scene.add(mesh);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(500, 500);

    document.addEventListener("mousemove", onDocumentMouseMove, false);

    scene.add(
      new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshNormalMaterial()
      )
    );
  }

  return (
    <div ref={rootRef}>
      <canvas ref={canvas1Ref}></canvas>
      <canvas ref={canvas2Ref}></canvas>
    </div>
  );
}

function onDocumentMouseMove(event) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
}

function animate() {
  for (var i = 0; i < views.length; ++i) {
    views[i].render();
  }

  requestAnimationFrame(animate);
}
