/**
 * Three.js Effects for Alex Chen Portfolio
 * Adds sophisticated 3D visual effects to complement the existing design
 */

import * as THREE from 'three';

class ThreeEffects {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.geometryParticles = null;
        this.materialParticles = null;
        this.mouse = new THREE.Vector2();
        this.windowHalf = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);
        this.clock = new THREE.Clock();
        this.raycaster = new THREE.Raycaster();
        this.isInitialized = false;

        // Animation properties
        this.particleCount = 1000;
        this.connectionDistance = 80;
        this.mouseInfluence = 100;

        this.init();
    }

    init() {
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createParticleSystem();
        this.createInteractiveElements();
        this.setupEventListeners();
        this.animate();

        this.isInitialized = true;
        console.log('Three.js effects initialized');
    }

    createScene() {
        this.scene = new THREE.Scene();
        // Set transparent background to overlay with existing design
        this.scene.background = null;
    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            1,
            1000
        );
        this.camera.position.z = 300;
    }

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create container for Three.js canvas
        const container = document.createElement('div');
        container.id = 'three-container';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;

        container.appendChild(this.renderer.domElement);
        document.body.appendChild(container);
    }

    createParticleSystem() {
        // Create particle geometry
        this.geometryParticles = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const velocities = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);

        // Initialize particles with random positions and velocities
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;

            // Position
            positions[i3] = (Math.random() - 0.5) * 800;
            positions[i3 + 1] = (Math.random() - 0.5) * 800;
            positions[i3 + 2] = (Math.random() - 0.5) * 300;

            // Velocity
            velocities[i3] = (Math.random() - 0.5) * 0.5;
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.5;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.5;

            // Color (matching portfolio theme)
            const colorChoice = Math.random();
            if (colorChoice < 0.33) {
                // Primary color (#6366f1)
                colors[i3] = 0.39;     // r
                colors[i3 + 1] = 0.4;  // g
                colors[i3 + 2] = 0.95; // b
            } else if (colorChoice < 0.66) {
                // Secondary color (#8b5cf6)
                colors[i3] = 0.55;     // r
                colors[i3 + 1] = 0.36; // g
                colors[i3 + 2] = 0.96; // b
            } else {
                // Accent color (#06b6d4)
                colors[i3] = 0.02;     // r
                colors[i3 + 1] = 0.71; // g
                colors[i3 + 2] = 0.83; // b
            }
        }

        this.geometryParticles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.geometryParticles.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
        this.geometryParticles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Create particle material
        this.materialParticles = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        // Create particle system
        this.particles = new THREE.Points(this.geometryParticles, this.materialParticles);
        this.scene.add(this.particles);
    }

    createInteractiveElements() {
        // Create connecting lines between nearby particles
        this.createParticleConnections();

        // Create floating geometric shapes
        this.createFloatingShapes();
    }

    createParticleConnections() {
        const lineGeometry = new THREE.BufferGeometry();
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x6366f1,
            transparent: true,
            opacity: 0.1,
            blending: THREE.AdditiveBlending
        });

        this.connectionLines = new THREE.LineSegments(lineGeometry, lineMaterial);
        this.scene.add(this.connectionLines);
    }

    createFloatingShapes() {
        this.floatingShapes = [];
        const shapes = [
            { geometry: new THREE.TetrahedronGeometry(5), count: 3 },
            { geometry: new THREE.OctahedronGeometry(4), count: 3 },
            { geometry: new THREE.IcosahedronGeometry(3), count: 4 }
        ];

        shapes.forEach(({ geometry, count }) => {
            for (let i = 0; i < count; i++) {
                const material = new THREE.MeshBasicMaterial({
                    color: new THREE.Color().setHSL(Math.random(), 0.7, 0.6),
                    transparent: true,
                    opacity: 0.3,
                    wireframe: true
                });

                const mesh = new THREE.Mesh(geometry.clone(), material);
                mesh.position.set(
                    (Math.random() - 0.5) * 600,
                    (Math.random() - 0.5) * 600,
                    (Math.random() - 0.5) * 200
                );

                mesh.rotation.set(
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                    Math.random() * Math.PI
                );

                // Add rotation speed
                mesh.userData = {
                    rotationSpeed: {
                        x: (Math.random() - 0.5) * 0.02,
                        y: (Math.random() - 0.5) * 0.02,
                        z: (Math.random() - 0.5) * 0.02
                    }
                };

                this.floatingShapes.push(mesh);
                this.scene.add(mesh);
            }
        });
    }

    setupEventListeners() {
        // Mouse movement
        document.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX - this.windowHalf.x) / this.windowHalf.x;
            this.mouse.y = -(event.clientY - this.windowHalf.y) / this.windowHalf.y;
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.onWindowResize();
        });

        // Scroll effect
        window.addEventListener('scroll', () => {
            this.onScroll();
        });
    }

    updateParticles() {
        const positions = this.geometryParticles.attributes.position.array;
        const velocities = this.geometryParticles.attributes.velocity.array;
        const time = this.clock.getElapsedTime();

        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;

            // Update positions based on velocities
            positions[i3] += velocities[i3];
            positions[i3 + 1] += velocities[i3 + 1];
            positions[i3 + 2] += velocities[i3 + 2];

            // Add some sine wave motion
            positions[i3] += Math.sin(time * 0.5 + i * 0.01) * 0.1;
            positions[i3 + 1] += Math.cos(time * 0.3 + i * 0.01) * 0.1;

            // Mouse influence
            const mouseDistance = Math.sqrt(
                Math.pow(positions[i3] - this.mouse.x * 300, 2) +
                Math.pow(positions[i3 + 1] - this.mouse.y * 300, 2)
            );

            if (mouseDistance < this.mouseInfluence) {
                const force = (this.mouseInfluence - mouseDistance) / this.mouseInfluence;
                const angle = Math.atan2(
                    positions[i3 + 1] - this.mouse.y * 300,
                    positions[i3] - this.mouse.x * 300
                );

                velocities[i3] += Math.cos(angle) * force * 0.01;
                velocities[i3 + 1] += Math.sin(angle) * force * 0.01;
            }

            // Boundary checks
            if (positions[i3] > 400 || positions[i3] < -400) velocities[i3] *= -0.5;
            if (positions[i3 + 1] > 400 || positions[i3 + 1] < -400) velocities[i3 + 1] *= -0.5;
            if (positions[i3 + 2] > 150 || positions[i3 + 2] < -150) velocities[i3 + 2] *= -0.5;

            // Damping
            velocities[i3] *= 0.99;
            velocities[i3 + 1] *= 0.99;
            velocities[i3 + 2] *= 0.99;
        }

        this.geometryParticles.attributes.position.needsUpdate = true;
    }

    updateConnections() {
        const positions = this.geometryParticles.attributes.position.array;
        const linePositions = [];

        for (let i = 0; i < this.particleCount; i++) {
            for (let j = i + 1; j < this.particleCount; j++) {
                const i3 = i * 3;
                const j3 = j * 3;

                const distance = Math.sqrt(
                    Math.pow(positions[i3] - positions[j3], 2) +
                    Math.pow(positions[i3 + 1] - positions[j3 + 1], 2) +
                    Math.pow(positions[i3 + 2] - positions[j3 + 2], 2)
                );

                if (distance < this.connectionDistance) {
                    linePositions.push(
                        positions[i3], positions[i3 + 1], positions[i3 + 2],
                        positions[j3], positions[j3 + 1], positions[j3 + 2]
                    );
                }
            }
        }

        this.connectionLines.geometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(linePositions, 3)
        );
        this.connectionLines.geometry.attributes.position.needsUpdate = true;
    }

    updateFloatingShapes() {
        this.floatingShapes.forEach(shape => {
            shape.rotation.x += shape.userData.rotationSpeed.x;
            shape.rotation.y += shape.userData.rotationSpeed.y;
            shape.rotation.z += shape.userData.rotationSpeed.z;

            // Gentle floating motion
            const time = this.clock.getElapsedTime();
            shape.position.y += Math.sin(time + shape.position.x * 0.01) * 0.1;
        });
    }

    onWindowResize() {
        this.windowHalf.set(window.innerWidth / 2, window.innerHeight / 2);

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onScroll() {
        const scrollPercent = window.pageYOffset / (document.body.scrollHeight - window.innerHeight);

        // Adjust particle system based on scroll
        this.camera.position.z = 300 + scrollPercent * 100;
        this.particles.rotation.y = scrollPercent * 0.5;

        // Adjust particle colors based on scroll
        const colors = this.geometryParticles.attributes.color.array;
        const scrollHue = scrollPercent * 360;

        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            const color = new THREE.Color().setHSL(
                (scrollHue + i * 10) % 360 / 360,
                0.7,
                0.6
            );
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }
        this.geometryParticles.attributes.color.needsUpdate = true;
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (!this.isInitialized) return;

        this.updateParticles();
        this.updateConnections();
        this.updateFloatingShapes();

        // Camera movement based on mouse
        this.camera.position.x += (this.mouse.x * 50 - this.camera.position.x) * 0.05;
        this.camera.position.y += (this.mouse.y * 50 - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);

        this.renderer.render(this.scene, this.camera);
    }

    // Public methods for external control
    setParticleCount(count) {
        this.particleCount = Math.max(100, Math.min(2000, count));
        this.createParticleSystem();
    }

    setConnectionDistance(distance) {
        this.connectionDistance = Math.max(20, Math.min(200, distance));
    }

    toggleVisibility(visible) {
        const container = document.getElementById('three-container');
        if (container) {
            container.style.display = visible ? 'block' : 'none';
        }
    }

    destroy() {
        if (this.renderer) {
            this.renderer.dispose();
            const container = document.getElementById('three-container');
            if (container && container.parentNode) {
                container.parentNode.removeChild(container);
            }
        }

        if (this.geometryParticles) this.geometryParticles.dispose();
        if (this.materialParticles) this.materialParticles.dispose();

        this.floatingShapes.forEach(shape => {
            shape.geometry.dispose();
            shape.material.dispose();
        });

        this.isInitialized = false;
    }
}

// Export for module usage or initialize directly
export default ThreeEffects;

// Auto-initialize if not using modules
if (typeof module === 'undefined') {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.threeEffects = new ThreeEffects();
        });
    } else {
        window.threeEffects = new ThreeEffects();
    }
}

// Performance monitoring
const performanceMonitor = {
    fpsCounter: 0,
    lastTime: performance.now(),

    update() {
        const now = performance.now();
        const delta = now - this.lastTime;

        if (delta >= 1000) {
            const fps = Math.round((this.fpsCounter * 1000) / delta);

            // Adjust quality based on FPS
            if (window.threeEffects && window.threeEffects.isInitialized) {
                if (fps < 30) {
                    window.threeEffects.setParticleCount(500);
                    window.threeEffects.setConnectionDistance(50);
                } else if (fps > 50) {
                    window.threeEffects.setParticleCount(1000);
                    window.threeEffects.setConnectionDistance(80);
                }
            }

            this.fpsCounter = 0;
            this.lastTime = now;
        }

        this.fpsCounter++;
    }
};

// Monitor performance if effects are running
setInterval(() => {
    if (window.threeEffects && window.threeEffects.isInitialized) {
        performanceMonitor.update();
    }
}, 100);