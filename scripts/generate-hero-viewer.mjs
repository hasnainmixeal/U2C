import { mkdir, writeFile } from 'node:fs/promises';
import { renderViewerHtml, js } from '@playcanvas/supersplat-viewer';
import { defaultSettings } from '@playcanvas/supersplat-viewer/settings';

const outputDirectory = new URL('../public/hero-viewer/', import.meta.url);
const settings = defaultSettings('object');
settings.background.color = [0.027, 0.039, 0.047];

const idleOrbit = `
<script>
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let previous = performance.now();
  let dragging = false;
  let resumeAt = previous + 1200;

  addEventListener('pointerdown', () => { dragging = true; }, { capture: true });
  addEventListener('pointerup', () => { dragging = false; resumeAt = performance.now() + 2800; }, { capture: true });
  addEventListener('pointercancel', () => { dragging = false; resumeAt = performance.now() + 2800; }, { capture: true });
  addEventListener('wheel', () => { resumeAt = performance.now() + 2800; }, { capture: true, passive: true });

  const rotate = (now) => {
    const delta = Math.min(now - previous, 50);
    previous = now;
    if (!dragging && now > resumeAt && typeof getCameraState === 'function' && typeof setCameraState === 'function') {
      const camera = getCameraState();
      if (camera?.mode === 'orbit' && Array.isArray(camera.angles)) {
        camera.angles[1] += delta * 0.002;
        setCameraState(camera);
      }
    }
    requestAnimationFrame(rotate);
  };
  requestAnimationFrame(rotate);
})();
</script>`;

const html = renderViewerHtml({
  bootstrap: {
    settings,
    contentUrl: '../apollo-moon-lander-astronaut.sog',
    contentFilename: 'Apollo Moon Lander- Astronaut.sog'
  },
  baseHref: '/hero-viewer/',
  backgroundColor: [0.027, 0.039, 0.047],
  inlineCss: true,
  headExtras: idleOrbit
});

await mkdir(outputDirectory, { recursive: true });
await Promise.all([
  writeFile(new URL('index.html', outputDirectory), html),
  writeFile(new URL('index.js', outputDirectory), js)
]);
