import { mkdir, writeFile } from 'node:fs/promises';
import { renderViewerHtml, js } from '@playcanvas/supersplat-viewer';
import { defaultSettings } from '@playcanvas/supersplat-viewer/settings';

const publicDirectory = new URL('../public/hero-viewer/', import.meta.url);
const rootDirectory = new URL('../hero-viewer/', import.meta.url);

const settings = defaultSettings('object');
// Fallback background color in case canvas alpha is not composited
settings.background.color = [0.02745, 0.0392, 0.04706];

// Center camera accurately on the Apollo Moon Lander astronaut model
settings.cameras = [
  {
    initial: {
      position: [0.75, -0.3, 0.9],
      target: [-1.216, -1.185, -1.055],
      fov: 50
    }
  }
];

const headStyles = `
<style>
  html, body {
    background: transparent !important;
    background-color: transparent !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
  }
  canvas {
    background: transparent !important;
    background-color: transparent !important;
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
  }
  #ui, #loadingWrap, #viewerBranding, #tooltip, #controlsWrap, #settingsPanel, #infoPanel, #annotationNav, .walkHint, #xrModal, #poster, #joystickBase {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
  }
</style>
`;

let html = renderViewerHtml({
  bootstrap: {
    settings,
    contentUrl: '../apollo-moon-lander-astronaut.sog',
    contentFilename: 'Apollo Moon Lander- Astronaut.sog'
  },
  inlineCss: true
});

// Remove any base href tags so all URLs resolve relative to the current location
html = html.replace(/<base href="[^"]*"\s*\/?>/gi, '');

// Strip any body background color overrides
html = html.replace(/<style>body\s*\{\s*background-color:[^}]*\}\s*<\/style>/gi, '');

// Inject custom head styles right before </head>
html = html.replace('</head>', `${headStyles}\n</head>`);

const idleOrbitScript = `
                const viewer = await main(canvas, settingsJson, config);
                window.viewer = viewer;

                // Ensure all UI overlays are completely removed
                const ui = document.getElementById('ui');
                if (ui) {
                    ui.style.display = 'none';
                    ui.style.pointerEvents = 'none';
                }

                // Ensure orbit mode is active for interactive 360 rotation in place
                viewer.global.events.on('cameraMode:changed', (mode) => {
                    if (mode === 'anim') {
                        viewer.global.state.cameraMode = 'orbit';
                    }
                });
                viewer.global.state.cameraMode = 'orbit';

                // Set camera clear color to transparent
                if (viewer.global?.app?.root) {
                    viewer.global.app.root.findComponents('camera').forEach(cam => {
                        cam.clearColor.set(0.02745, 0.0392, 0.04706, 0);
                    });
                }

                const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
                if (!prefersReduced) {
                    let isInteracting = false;
                    let resumeAt = performance.now() + 1000;

                    const onStart = () => { isInteracting = true; };
                    const onEnd = () => { isInteracting = false; resumeAt = performance.now() + 2000; };

                    window.addEventListener('pointerdown', onStart, { capture: true });
                    window.addEventListener('pointerup', onEnd, { capture: true });
                    window.addEventListener('pointercancel', onEnd, { capture: true });
                    window.addEventListener('wheel', () => { resumeAt = performance.now() + 2000; }, { capture: true, passive: true });
                    window.addEventListener('touchstart', onStart, { capture: true, passive: true });
                    window.addEventListener('touchend', onEnd, { capture: true, passive: true });

                    viewer.global.app.on('update', (dt) => {
                        const now = performance.now();
                        const src = viewer.inputController?._keyboardMouse?._source;
                        if (!isInteracting && now > resumeAt && src && viewer.cameraManager) {
                            if (viewer.global.state.cameraMode === 'orbit') {
                                // Gentle, cinematic idle rotation in place (~10 deg/sec)
                                const step = -10 * Math.min(dt, 0.1);
                                src.deltas.mouse.append([step, 0]);
                                viewer.global.app.renderNextFrame = true;
                            }
                        }
                    });
                }
`;

html = html.replace('const viewer = await main(canvas, settingsJson, config);', idleOrbitScript.trim());

// Write to public/hero-viewer
await mkdir(publicDirectory, { recursive: true });
await Promise.all([
  writeFile(new URL('index.html', publicDirectory), html),
  writeFile(new URL('index.js', publicDirectory), js)
]);

// Write to root hero-viewer for GitHub Pages
await mkdir(rootDirectory, { recursive: true });
await Promise.all([
  writeFile(new URL('index.html', rootDirectory), html),
  writeFile(new URL('index.js', rootDirectory), js)
]);

console.log('Hero viewer generated successfully with transparent styles and root deployment.');
