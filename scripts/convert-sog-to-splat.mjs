import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const tmpDir = path.resolve('tmp-sog');
// Re-extract if needed
if (!fs.existsSync(tmpDir)) {
  const AdmZip = (await import('node:child_process')).execSync;
  AdmZip('powershell -Command "Copy-Item \'apollo-moon-lander-astronaut.sog\' \'tmp-sog.zip\'; Expand-Archive -Path \'tmp-sog.zip\' -DestinationPath \'tmp-sog\' -Force; Remove-Item \'tmp-sog.zip\'"');
}

const meta = JSON.parse(fs.readFileSync(path.join(tmpDir, 'meta.json'), 'utf8'));
const count = meta.count;
console.log('Total splats in SOG:', count);

const ml = await sharp(path.join(tmpDir, 'means_l.webp')).raw().toBuffer({ resolveWithObject: true });
const mu = await sharp(path.join(tmpDir, 'means_u.webp')).raw().toBuffer({ resolveWithObject: true });
const sh = await sharp(path.join(tmpDir, 'sh0.webp')).raw().toBuffer({ resolveWithObject: true });
const sc = await sharp(path.join(tmpDir, 'scales.webp')).raw().toBuffer({ resolveWithObject: true });

const mins = meta.means.mins;
const maxs = meta.means.maxs;
const shCodebook = meta.sh0.codebook;
const scaleCodebook = meta.scales.codebook;

const SH_C0 = 0.28209479177387814;

// 1. First pass: compute exact positions using SOG exponential non-linear transform
const rawPositions = new Float32Array(count * 3);
let minX = 1e9, maxX = -1e9;
let minY = 1e9, maxY = -1e9;
let minZ = 1e9, maxZ = -1e9;

for (let i = 0; i < count; i++) {
  const idx4 = i * 4;
  const rx = (mu.data[idx4] * 256 + ml.data[idx4]) / 65535;
  const ry = (mu.data[idx4+1] * 256 + ml.data[idx4+1]) / 65535;
  const rz = (mu.data[idx4+2] * 256 + ml.data[idx4+2]) / 65535;

  const nx = mins[0] + rx * (maxs[0] - mins[0]);
  const ny = mins[1] + ry * (maxs[1] - mins[1]);
  const nz = mins[2] + rz * (maxs[2] - mins[2]);

  // Exact SOG non-linear position decoding: sign(v) * (exp(|v|) - 1)
  const px = Math.sign(nx) * (Math.exp(Math.abs(nx)) - 1);
  const py = Math.sign(ny) * (Math.exp(Math.abs(ny)) - 1);
  const pz = Math.sign(nz) * (Math.exp(Math.abs(nz)) - 1);

  rawPositions[i * 3] = px;
  rawPositions[i * 3 + 1] = py;
  rawPositions[i * 3 + 2] = pz;

  if (px < minX) minX = px; if (px > maxX) maxX = px;
  if (py < minY) minY = py; if (py > maxY) maxY = py;
  if (pz < minZ) minZ = pz; if (pz > maxZ) maxZ = pz;
}

const cx = (minX + maxX) / 2;
const cy = (minY + maxY) / 2;
const cz = (minZ + maxZ) / 2;
console.log('Exact Bounding Box Center:', cx, cy, cz);
console.log('Model Extents (X, Y, Z):', maxX - minX, maxY - minY, maxZ - minZ);

const buffer = new ArrayBuffer(count * 20);
const f32 = new Float32Array(buffer);
const u8 = new Uint8Array(buffer);

for (let i = 0; i < count; i++) {
  const idx4 = i * 4;
  const px = rawPositions[i * 3];
  const py = rawPositions[i * 3 + 1];
  const pz = rawPositions[i * 3 + 2];

  // Center at origin and invert Y so astronaut is right-side up
  const x = px - cx;
  const y = -(py - cy);
  const z = pz - cz;

  // Colors from spherical harmonics codebook
  const cr = Math.min(255, Math.max(0, Math.round((shCodebook[sh.data[idx4]] * SH_C0 + 0.5) * 255)));
  const cg = Math.min(255, Math.max(0, Math.round((shCodebook[sh.data[idx4+1]] * SH_C0 + 0.5) * 255)));
  const cb = Math.min(255, Math.max(0, Math.round((shCodebook[sh.data[idx4+2]] * SH_C0 + 0.5) * 255)));
  const ca = sh.data[idx4+3];

  // 3D Gaussian ellipsoid axes
  const s0 = Math.exp(scaleCodebook[sc.data[idx4]]);
  const s1 = Math.exp(scaleCodebook[sc.data[idx4+1]]);
  const s2 = Math.exp(scaleCodebook[sc.data[idx4+2]]);
  // Full Gaussian coverage extent (2.5 - 3 standard deviations)
  const maxS = Math.max(s0, s1, s2);
  const avgS = (s0 + s1 + s2) / 3;
  const splatSize = Math.max(maxS * 2.2, avgS * 3.0);

  const fOffset = i * 5;
  f32[fOffset] = x;
  f32[fOffset + 1] = y;
  f32[fOffset + 2] = z;

  const bOffset = i * 20 + 12;
  u8[bOffset] = cr;
  u8[bOffset + 1] = cg;
  u8[bOffset + 2] = cb;
  u8[bOffset + 3] = ca;

  f32[fOffset + 4] = splatSize;
}

// Clean up temporary extracted folder
try {
  fs.rmSync(tmpDir, { recursive: true, force: true });
} catch {}

const publicOut = path.resolve('public/astronaut-splat.bin');
const rootOut = path.resolve('astronaut-splat.bin');
fs.writeFileSync(publicOut, Buffer.from(buffer));
fs.writeFileSync(rootOut, Buffer.from(buffer));
console.log('Successfully generated astronaut-splat.bin (right-side up)! Bytes:', buffer.byteLength);
