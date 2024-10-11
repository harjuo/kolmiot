import * as THREE from 'three';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
import { inputTriangles } from './input.js'; // Import the triangle data from input.js

// Function to parse the input format into triangles
function parseTriangles(input) {
  const triangles = [];
  
  // Split input by the extra space between triangles, then by line for coordinates
  const triangleData = input.trim().split('\n\n');
  for (const triangle of triangleData) {
    const vertices = [];
    const lines = triangle.split('\n');
    for (const line of lines) {
      const [x, y, z] = line.split(' ').map(Number);  // Convert string coords to numbers
      vertices.push(x, y, z);
    }

    // Create a BufferGeometry from the parsed vertices
    const geometry = new THREE.BufferGeometry();
    const verticesArray = new Float32Array(vertices);  // Convert vertices to Float32Array
    geometry.setAttribute('position', new THREE.BufferAttribute(verticesArray, 3));
    
    triangles.push(geometry);
  }
  return triangles;
}

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('myCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);

// Initialize FirstPersonControls
const controls = new FirstPersonControls(camera, renderer.domElement);
controls.lookSpeed = 0.1; // Sensitivity of the mouse look
controls.movementSpeed = 10; // Speed of movement
controls.lookVertical = true; // Allow vertical movement

// Parse the triangles and create a material for them
const geometries = parseTriangles(inputTriangles);
const red = new THREE.MeshBasicMaterial({
    color: 0xff0000, 
    side: THREE.DoubleSide,
    transparent: true,  // Enable transparency
    opacity: 0.666        // Set opacity to 50%
  });
  
const green = new THREE.MeshBasicMaterial({
    color: 0x00ff00, 
    side: THREE.DoubleSide,
    transparent: true,  // Enable transparency
    opacity: 0.666        // Set opacity to 50%
  });
  
const blue = new THREE.MeshBasicMaterial({
    color: 0x0000ff, 
    side: THREE.DoubleSide,
    transparent: true,  // Enable transparency
    opacity: 0.666        // Set opacity to 50%
  });
  

// Add each triangle to the scene
for (let i = 0; i < geometries.length; i++) {
  let material = red;
  switch(i % 3) {
    case 1:
        material = blue;
        break;
    case 2:
        material = green;
        break;
    default:
        break;
  }
  const triangleMesh = new THREE.Mesh(geometries[i], material);
  scene.add(triangleMesh);
};

// Position the camera and render the scene
camera.position.set(0, 0, 5);
renderer.render(scene, camera);

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Update the controls for movement and look
  controls.update(0.01); // Pass delta time to the controls

  renderer.render(scene, camera);
}

animate();
