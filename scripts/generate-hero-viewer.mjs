import { mkdir, writeFile } from 'node:fs/promises';
import { renderViewerHtml, js } from '@playcanvas/supersplat-viewer';
import { defaultSettings } from '@playcanvas/supersplat-viewer/settings';

const outputDirectory = new URL('../public/hero-viewer/', import.meta.url);
const settings = defaultSettings('object');
settings.background.color = [0.027, 0.039, 0.047];
// Center camera accurately on the Apollo Moon Lander model
settings.cameras = [
  {
    initial: {
      position: [0.75, -0.3, 0.9],
      target: [-1.216, -1.185, -1.055],
      fov: 50
    }
  }
];

let html = renderViewerHtml({
  bootstrap: {
    settings,
    contentUrl: '../apollo-moon-lander-astronaut.sog',
    contentFilename: 'Apollo Moon Lander- Astronaut.sog'
  },
  backgroundColor: [0.027, 0.039, 0.047],
  inlineCss: true
});

// Remove any base href tags so all URLs resolve relative to the current location
html = html.replace(/<base href="[^"]*"\s*\/?>/gi, '');

const idleOrbitScript = `
                const viewer = await main(canvas, settingsJson, config);
                window.viewer = viewer;

                // Ensure orbit mode is active for interactive 360 rotation in place
                viewer.global.events.on('cameraMode:changed', (mode) => {
                    if (mode === 'anim') {
                        viewer.global.state.cameraMode = 'orbit';
                    }
                });
                viewer.global.state.cameraMode = 'orbit';

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
                                // Gentle, cinematic idle rotation in place (~15 deg/sec)
                                const step = -10 * Math.min(dt, 0.1);
                                src.deltas.mouse.append([step, 0]);
                                viewer.global.app.renderNextFrame = true;
                            }
                        }
                    });
                }
`;

html = html.replace('const viewer = await main(canvas, settingsJson, config);', idleOrbitScript.trim());

await mkdir(outputDirectory, { recursive: true });
await Promise.all([
  writeFile(new URL('index.html', outputDirectory), html),
  writeFile(new URL('index.js', outputDirectory), js)
]);
console.log('Hero viewer generated successfully with centered camera.');
