import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import './style.css';
import './refinements.css';

const FAB='https://www.fab.com/listings/d5ce0b45-8c80-486d-8316-882856198875';
const DOCS='https://docs.google.com/document/d/1TI85713-m77ffLTBt8gXm0qnTO-rZNs4cMDOiOCsAPc/edit?usp=sharing';
const DISCORD='https://discord.gg/PnuU3eW8J';
const WALLGS_FAB='https://www.fab.com/listings/44fcdaad-8765-4479-b2cb-adf34f9c0a4d?lang=en';

const scenes = [
  {
    id: '176ba55a',
    title: 'Soul Cave',
    author: 'Hassnain Aly',
    thumb: 'https://s3-eu-west-1.amazonaws.com/images.playcanvas.com/splat/176ba55a/v1/xl.webp',
    mov: 'https://s3-eu-west-1.amazonaws.com/images.playcanvas.com/splat/176ba55a/v1/mov.webp'
  },
  {
    id: '3b3de8bc',
    title: 'Evermotion Archinterior Scene',
    author: 'Walhar Gohar',
    thumb: 'https://s3-eu-west-1.amazonaws.com/images.playcanvas.com/splat/3b3de8bc/v1/xl.webp',
    mov: 'https://s3-eu-west-1.amazonaws.com/images.playcanvas.com/splat/3b3de8bc/v1/mov.webp'
  },
  {
    id: '663fbcd3',
    title: 'Art Gallery Interior',
    author: 'Alejandro Nevárez',
    thumb: 'https://s3-eu-west-1.amazonaws.com/images.playcanvas.com/splat/663fbcd3/v1/xl.webp',
    mov: 'https://s3-eu-west-1.amazonaws.com/images.playcanvas.com/splat/663fbcd3/v1/mov.webp'
  },
  {
    id: '692c4f91',
    title: 'UE5 City Sample – Small Part',
    author: 'Walhar Gohar',
    thumb: 'https://s3-eu-west-1.amazonaws.com/images.playcanvas.com/splat/692c4f91/v1/xl.webp',
    mov: 'https://s3-eu-west-1.amazonaws.com/images.playcanvas.com/splat/692c4f91/v1/mov.webp'
  },
  {
    id: '71111000',
    title: 'T4 Apartment',
    author: 'Andy Praseetyo',
    thumb: 'https://s3-eu-west-1.amazonaws.com/images.playcanvas.com/splat/71111000/v1/xl.webp',
    mov: 'https://s3-eu-west-1.amazonaws.com/images.playcanvas.com/splat/71111000/v1/mov.webp'
  },
  {
    id: '797f5c99',
    title: 'Apollo Moon Lander – Lumen Reflections',
    author: 'Walhar Gohar',
    thumb: 'https://s3-eu-west-1.amazonaws.com/images.playcanvas.com/splat/797f5c99/v1/xl.webp',
    mov: 'https://s3-eu-west-1.amazonaws.com/images.playcanvas.com/splat/797f5c99/v1/mov.webp'
  },
  {
    id: 'c37cb759',
    title: 'Studio 11',
    author: 'Goce Milanoski',
    thumb: 'https://s3-eu-west-1.amazonaws.com/images.playcanvas.com/splat/c37cb759/v1/xl.webp',
    mov: 'https://s3-eu-west-1.amazonaws.com/images.playcanvas.com/splat/c37cb759/v1/mov.webp'
  },
  {
    id: '3c0f3775',
    title: 'Derelict Corridor',
    author: 'Walhar Gohar',
    thumb: 'https://s3-eu-west-1.amazonaws.com/images.playcanvas.com/splat/3c0f3775/v1/xl.webp',
    mov: 'https://s3-eu-west-1.amazonaws.com/images.playcanvas.com/splat/3c0f3775/v1/mov.webp'
  },
  {
    id: 'b7c8d8c5',
    title: 'Interior Space',
    author: 'NBV.Studio',
    thumb: 'https://s3-eu-west-1.amazonaws.com/images.playcanvas.com/splat/b7c8d8c5/v2/xl.webp',
    mov: 'https://s3-eu-west-1.amazonaws.com/images.playcanvas.com/splat/b7c8d8c5/v2/mov.webp'
  },
  {
    id: '9ae3b553',
    title: 'Epic Games Hillside Sample',
    author: 'Walhar Gohar',
    thumb: 'https://s3-eu-west-1.amazonaws.com/images.playcanvas.com/splat/9ae3b553/v1/xl.webp',
    mov: 'https://s3-eu-west-1.amazonaws.com/images.playcanvas.com/splat/9ae3b553/v1/mov.webp'
  }
];

const modes = [
  ['product', 'Product Capture', 'Object-focused layouts with bounds-aware aiming. Also supports object masking to isolate only the target asset and ignore surroundings.', './product-capture.webp'],
  ['path', 'Path Capture', 'Editable spline routes with overlapping cameras.', './ForPathCapture.webp'],
  ['volume', 'Volume Capture', 'Room and space coverage with clearance filtering.', './volume-capture.webp'],
  ['aerial', 'Oblique Aerial Capture', 'Configurable aerial routes for large exterior maps.', './ForObliqueAerialCapture.webp']
];

const faqs = [
  [
    'How does Unreal to Gaussian Splat streamline dataset creation?',
    'First, you place cameras across your scene using purpose-built camera rigs (product, path, volume, or oblique aerial). Once your cameras are placed, a single click handles the rest: rendering multi-view RGB images, calculating ground-truth camera poses, raycasting complex point clouds, and projective color sampling to export a complete COLMAP dataset.'
  ],
  [
    'How does the plugin achieve accurate point clouds without messing up my project collision?',
    'The plugin uses an automated, non-destructive collision system. Before generating the point cloud, it temporarily activates per-polygon complex collision for all meshes in your scene to cast accurate sampling rays. Once the point cloud is generated, it automatically reverts all collision settings back to their exact original state, leaving your project cleanly untouched.'
  ],
  [
    'Does Unreal to Gaussian Splat train the final Gaussian Splat?',
    'No. The plugin generates the complete, ready-to-train COLMAP dataset (cameras, images, and colored sparse point cloud). Training happens afterward in compatible software such as Postshot, LichtFeld Studio, or Nerfstudio.'
  ],
  [
    'Does the plugin render Gaussian Splats inside Unreal Engine?',
    'No. Unreal to Gaussian Splat is dedicated to exporting high-precision COLMAP datasets from your Unreal scenes. To render and interact with Gaussian Splats inside Unreal Engine, check out our companion plugin WallGS.'
  ],
  [
    'Do I need to manually align cameras in COLMAP?',
    'No! The plugin calculates mathematical ground-truth camera extrinsics and intrinsics directly from Unreal Editor, eliminating manual COLMAP feature matching, alignment failures, and hours of reconstruction time.'
  ],
  [
    'Can I add more camera angles to an already generated dataset?',
    'Yes! Unreal to Gaussian Splat supports resumable and incremental capture. You can place additional camera rigs for specific areas and capture only those new views without needing to re-capture your entire dataset from scratch.'
  ],
  [
    'Which Unreal Engine versions are supported?',
    'Windows with Unreal Engine 5.4, 5.5, 5.6, 5.7, and 5.8.'
  ],
  [
    'What software can I use to train the exported dataset?',
    'Postshot, LichtFeld Studio, Nerfstudio, 3DGS official repo, and all other standard COLMAP-compatible Gaussian Splatting trainers.'
  ]
];

const Arrow = () => <span aria-hidden="true">→</span>;

/**
 * 3D Tunnel Point Cloud with Dual Camera Path & Interactive Spring Physics.
 * Top-front angled view, enlarged scale, ultra-lightweight (pure 2D Canvas math, < 6KB, 0ms load, 60fps).
 */
function PointCloud() {
  const canvas = useRef(null);
  const mouse = useRef({ x: -1000, y: -1000, active: false });
  const frame = useRef();

  useEffect(() => {
    const c = canvas.current;
    const ctx = c.getContext('2d');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w, h;
    let pts = [];
    let cameras = [];
    let time = 0;

    const buildGeometry = () => {
      pts = [];
      cameras = [];
      const numRings = 26;
      const pointsPerRing = 28;
      const radius = 210; // reduced by 0.3x
      const length = 620;

      // 1. Generate Arched Tunnel Corridor & Ribs
      for (let r = 0; r < numRings; r++) {
        const z = -length / 2 + (r / (numRings - 1)) * length;
        for (let i = 0; i < pointsPerRing; i++) {
          const theta = -Math.PI + (i / (pointsPerRing - 1)) * Math.PI; // Arch curve
          const x = Math.cos(theta) * radius + (Math.random() - 0.5) * 8;
          const y = Math.sin(theta) * (radius * 0.92) + 48 + (Math.random() - 0.5) * 8;
          const isHighlight = Math.random() < 0.24;
          pts.push({
            x, y, z,
            ox: 0, oy: 0, vx: 0, vy: 0,
            isHighlight,
            isFloor: false
          });
        }
      }

      // 2. Floor Grid & Walkway Points
      for (let fz = -length / 2; fz <= length / 2; fz += 24) {
        for (let fx = -radius * 0.88; fx <= radius * 0.88; fx += 26) {
          pts.push({
            x: fx + (Math.random() - 0.5) * 6,
            y: 50 + (Math.random() - 0.5) * 3,
            z: fz + (Math.random() - 0.5) * 6,
            ox: 0, oy: 0, vx: 0, vy: 0,
            isHighlight: Math.abs(fx) < 38 && Math.random() < 0.45,
            isFloor: true
          });
        }
      }

      // 3. Two Parallel Rows of 3D Camera Wireframe Frustums
      const numCams = 9;
      const camSpacing = length / (numCams + 1);
      const rowOffset = 58; // Spacing between dual rails
      const camY = 20;

      for (let i = 0; i < numCams; i++) {
        const cz = -length / 2 + (i + 1) * camSpacing;
        // Left Row
        cameras.push({ cx: -rowOffset, cy: camY, cz });
        // Right Row
        cameras.push({ cx: rowOffset, cy: camY, cz });
      }
    };

    const resize = () => {
      const r = c.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = r.width;
      h = r.height;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildGeometry();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      time += 0.0055; // increased speed by 0.3x

      // Steady cinematic top-front revolving angle (mouse moves only points, not the tunnel orientation)
      const rotY = -0.74 + Math.sin(time * 0.58) * 0.15;
      const rotX = 0.42 + Math.cos(time * 0.45) * 0.07;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const fov = 490;
      const camDist = 540;
      const centerX = w * 0.53;
      const centerY = h * 0.52;

      // Transform & Project 3D Point
      const project = (x, y, z) => {
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX + camDist;
        const scale = fov / Math.max(z2, 60);
        return {
          sx: centerX + x1 * scale,
          sy: centerY + y2 * scale,
          z2,
          scale
        };
      };

      // Draw 3D Tunnel Point Cloud with Mouse Physics
      for (const p of pts) {
        const pr = project(p.x, p.y, p.z);
        const bx = pr.sx;
        const by = pr.sy;

        // Interactive mouse repulsion (only points move)
        const dx = bx + p.ox - mouse.current.x;
        const dy = by + p.oy - mouse.current.y;
        const dist = Math.hypot(dx, dy);
        if (mouse.current.active && dist < 110) {
          const force = (1 - dist / 110) * 2.0;
          p.vx += (dx / (dist || 1)) * force;
          p.vy += (dy / (dist || 1)) * force;
        }

        // Dampened spring physics
        p.vx += -p.ox * 0.02;
        p.vy += -p.oy * 0.02;
        p.vx *= 0.88;
        p.vy *= 0.88;
        p.ox += p.vx;
        p.oy += p.vy;

        // Depth coloring and sizing
        const depthAlpha = Math.max(0.1, Math.min(0.9, 1.18 - pr.z2 / 980));
        const ptSize = Math.max(0.7, (1.3 + (p.isHighlight ? 0.9 : 0)) * pr.scale * 1.55);

        ctx.beginPath();
        ctx.arc(bx + p.ox, by + p.oy, ptSize, 0, Math.PI * 2);

        if (p.isHighlight) {
          ctx.fillStyle = `rgba(215, 255, 57, ${depthAlpha})`;
        } else if (p.isFloor) {
          ctx.fillStyle = `rgba(88, 229, 255, ${depthAlpha * 0.8})`;
        } else {
          ctx.fillStyle = `rgba(165, 210, 220, ${depthAlpha * 0.6})`;
        }
        ctx.fill();
      }

      // Draw 3D Camera Wireframe Frustums
      for (const cam of cameras) {
        const camPr = project(cam.cx, cam.cy, cam.cz);
        const cw = 16;
        const ch = 11;
        const cd = 24;

        // Camera Frustum vertices (Apex lens pointing forward + 4 base corners)
        const vApex = project(cam.cx, cam.cy, cam.cz - cd * 0.45);
        const v1 = project(cam.cx - cw, cam.cy - ch, cam.cz + cd);
        const v2 = project(cam.cx + cw, cam.cy - ch, cam.cz + cd);
        const v3 = project(cam.cx + cw, cam.cy + ch, cam.cz + cd);
        const v4 = project(cam.cx - cw, cam.cy + ch, cam.cz + cd);

        const camAlpha = Math.max(0.18, Math.min(0.95, 1.22 - camPr.z2 / 980));

        ctx.strokeStyle = `rgba(215, 255, 57, ${camAlpha * 0.85})`;
        ctx.lineWidth = Math.max(0.7, 1.1 * camPr.scale);

        // Frustum base rectangle
        ctx.beginPath();
        ctx.moveTo(v1.sx, v1.sy);
        ctx.lineTo(v2.sx, v2.sy);
        ctx.lineTo(v3.sx, v3.sy);
        ctx.lineTo(v4.sx, v4.sy);
        ctx.closePath();
        ctx.stroke();

        // Lines from 4 corners to apex lens
        ctx.beginPath();
        ctx.moveTo(vApex.sx, vApex.sy); ctx.lineTo(v1.sx, v1.sy);
        ctx.moveTo(vApex.sx, vApex.sy); ctx.lineTo(v2.sx, v2.sy);
        ctx.moveTo(vApex.sx, vApex.sy); ctx.lineTo(v3.sx, v3.sy);
        ctx.moveTo(vApex.sx, vApex.sy); ctx.lineTo(v4.sx, v4.sy);
        ctx.stroke();

        // Apex lens glowing dot
        ctx.beginPath();
        ctx.arc(vApex.sx, vApex.sy, Math.max(1.2, 2.2 * camPr.scale), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(88, 229, 255, ${camAlpha})`;
        ctx.fill();
      }

      if (!reduced) frame.current = requestAnimationFrame(draw);
    };

    resize();
    draw();
    const ro = new ResizeObserver(resize);
    ro.observe(c);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <canvas
      ref={canvas}
      className="point-cloud"
      aria-hidden="true"
      onPointerEnter={() => { mouse.current.active = true; }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mouse.current.x = e.clientX - r.left;
        mouse.current.y = e.clientY - r.top;
        mouse.current.active = true;
      }}
      onPointerLeave={() => { mouse.current.active = false; }}
    />
  );
}

function Logo() {
  return <a className="logo" href="#top"><i />U2GS</a>;
}

function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header>
      <nav>
        <Logo />
        <button className="menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation">☰</button>
        <div className={'navlinks ' + (open ? 'open' : '')}>
          {[['Overview', 'overview'], ['Capture Rigs', 'modes'], ['Workflow', 'workflow'], ['Showcase', 'showcase'], ['Collision Engine', 'collision'], ['Features', 'features'], ['Use Cases', 'use-cases'], ['FAQ', 'faq']].map(([a, b]) => (
            <a key={b} href={'#' + b} onClick={() => setOpen(false)}>{a}</a>
          ))}
          <a className="nav-cta" href={FAB} target="_blank" rel="noreferrer">Get on Fab <Arrow /></a>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section id="overview" className="hero">
      <PointCloud />
      <div className="hero-copy">
        <p className="eyebrow">Unreal to Gaussian Splat 3.0</p>
        <h1>Turn Unreal Engine scenes into <em>Gaussian Splat</em> datasets.</h1>
        <p className="lede">
          Unreal to Gaussian Splat provides intuitive camera rigs for fast scene placement. Once your cameras are set, one click handles the rest — capturing high-res images, generating dense point clouds, and exporting ready-to-train COLMAP datasets directly inside Unreal Editor.
        </p>
        <div className="hero-actions">
          <a className="button primary" href={FAB} target="_blank" rel="noreferrer">Get it on Fab <Arrow /></a>
          <a className="button quiet" href="#showcase">Explore user splats <Arrow /></a>
        </div>
      </div>
      <div className="hero-pipeline">
        <span>UNREAL SCENE</span>
        <i>→</i>
        <strong title="Quick camera placement with dedicated rigs">SETUP CAMERA RIGS</strong>
        <i>→</i>
        <strong title="Automated rendering, point cloud & COLMAP export in one pass">ONE-CLICK GENERATE</strong>
        <i>→</i>
        <span>COLMAP DATASET</span>
        <i>→</i>
        <b>3DGS TRAINER</b>
      </div>
    </section>
  );
}

function Workflow() {
  const steps = [
    {
      num: '01',
      badge: 'Rig Setup',
      title: 'Place Camera Rigs',
      desc: 'Use product, path, volume, or oblique aerial rigs to position cameras across your scene in minutes.'
    },
    {
      num: '02',
      badge: '1-Click',
      title: 'Capture & Raycast',
      desc: 'Renders high-res RGB frames and auto-enables complex collision for sub-millimeter geometric raycasting.'
    },
    {
      num: '03',
      badge: 'Auto Export',
      title: 'Color & COLMAP Export',
      desc: 'Samples scene radiance onto the point cloud and outputs complete camera poses ready for training.'
    }
  ];

  return (
    <section id="workflow" className="section workflow">
      <div className="section-head">
        <div className="workflow-badge">
          <span className="pulse-dot" />
          <span>STRUCTURED 3DGS WORKFLOW</span>
        </div>
        <h2>From camera placement to COLMAP dataset in 3 steps.</h2>
        <p>
          Place your cameras quickly using dedicated rigs, then let Unreal to Gaussian Splat handle the heavy lifting: capturing high-res frames, generating dense geometry via complex collision raycasts, and coloring every point for 3DGS training.
        </p>
      </div>

      <div className="flow-wrapper">
        <div className="flow-one-click-banner">
          <span className="banner-tag">EFFICIENT PLUGIN WORKFLOW</span>
          <span className="banner-sub">Camera Rig Placement → One-Click Automated Capture & COLMAP Dataset</span>
        </div>
        <div className="flow">
          <div className="endpoint cyan">
            Unreal Engine
            <small>Your 3D Scene</small>
          </div>
          {steps.map((s) => (
            <React.Fragment key={s.num}>
              <i className="connector">→</i>
              <article className="flow-step highlighted-step">
                <div className="step-top">
                  <b>{s.num}</b>
                  <span className="step-badge">{s.badge}</span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </article>
            </React.Fragment>
          ))}
          <i className="connector">→</i>
          <div className="endpoint lime">
            COLMAP Dataset
            <small>Ready to Train</small>
          </div>
        </div>
      </div>

      {/* Resumable & Incremental Dataset Capture */}
      <div className="workflow-hero-feature">
        <div className="hero-feature-left">
          <span className="hero-feature-badge">RESUMABLE CAPTURE</span>
          <h3>Add More Data to Existing Datasets Anytime</h3>
          <p>
            Missed a critical angle or need extra fidelity in a specific spot? You never have to re-render or restart from scratch. With incremental capture, simply place new cameras where needed and capture only that specific part to expand your existing COLMAP dataset seamlessly.
          </p>
        </div>
        <div className="hero-feature-pills">
          <div className="hero-pill-item">
            <span className="pill-icon">🎯</span>
            <div>
              <b>Target Specific Areas</b>
              <small>Capture only newly added camera views without touching or re-rendering existing data.</small>
            </div>
          </div>
          <div className="hero-pill-item">
            <span className="pill-icon">⚡</span>
            <div>
              <b>Zero Full Recapture Penalty</b>
              <small>Append new images and points directly into your dataset, saving hours on large scenes.</small>
            </div>
          </div>
          <div className="hero-pill-item">
            <span className="pill-icon">🔄</span>
            <div>
              <b>Resumable Iteration</b>
              <small>Continuously refine and expand datasets across multiple sessions as your scene evolves.</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Showcase() {
  const [activeModal, setActiveModal] = useState(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [hoverKeys, setHoverKeys] = useState({});

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveModal(null);
      if (activeModal !== null) {
        if (e.key === 'ArrowRight') {
          setActiveModal((prev) => (prev + 1) % scenes.length);
          setIframeLoaded(false);
        }
        if (e.key === 'ArrowLeft') {
          setActiveModal((prev) => (prev - 1 + scenes.length) % scenes.length);
          setIframeLoaded(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal]);

  const handleCardMouseEnter = (idx) => {
    setHoveredIdx(idx);
    setHoverKeys(prev => ({ ...prev, [idx]: Date.now() }));
  };

  const handleCardMouseLeave = () => {
    setHoveredIdx(null);
  };

  const openSplat = (idx) => {
    setActiveModal(idx);
    setIframeLoaded(false);
  };

  const nextSplat = (e) => {
    e.stopPropagation();
    setActiveModal((prev) => (prev + 1) % scenes.length);
    setIframeLoaded(false);
  };

  const prevSplat = (e) => {
    e.stopPropagation();
    setActiveModal((prev) => (prev - 1 + scenes.length) % scenes.length);
    setIframeLoaded(false);
  };

  const currentScene = activeModal !== null ? scenes[activeModal] : null;

  return (
    <section id="showcase" className="section showcase">
      <div className="showcase-top">
        <div>
          <p className="eyebrow">Interactive Splats Gallery</p>
          <h2>Here's what users have created using this plugin</h2>
        </div>
      </div>

      {/* SuperSplat-style Responsive Grid */}
      <div className="splat-grid">
        {scenes.map((scene, idx) => (
          <div
            key={scene.id}
            className="splat-card"
            onClick={() => openSplat(idx)}
            onMouseEnter={() => handleCardMouseEnter(idx)}
            onMouseLeave={handleCardMouseLeave}
            role="button"
            tabIndex={0}
            aria-label={`Open 3D splat of ${scene.title}`}
          >
            <div className="splat-thumb-container">
              {/* Static high-res thumbnail */}
              <img
                src={scene.thumb}
                alt={scene.title}
                className="splat-thumb-img"
                loading="lazy"
              />
              {/* Motion animated webp preview - resets on every single hover */}
              {hoveredIdx === idx && (
                <img
                  key={hoverKeys[idx]}
                  src={`${scene.mov}?t=${hoverKeys[idx]}`}
                  alt={`${scene.title} motion preview`}
                  className="splat-thumb-mov visible"
                />
              )}
              <div className="splat-hover-overlay">
                <span className="splat-play-badge">
                  <span className="play-icon">▶</span> Click to Experience 3D
                </span>
              </div>
            </div>
            <div className="splat-card-meta">
              <div className="splat-card-title-row">
                <h4>{scene.title}</h4>
                <span className="splat-index">{String(idx + 1).padStart(2, '0')}</span>
              </div>
              <p className="splat-card-author">Created by <span>{scene.author}</span></p>
            </div>
          </div>
        ))}
      </div>

      {/* Big Screen Interactive Modal / Viewer */}
      {currentScene && (
        <div className="splat-modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="splat-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="splat-modal-header">
              <div className="splat-modal-info">
                <span className="modal-counter">SCENE {String(activeModal + 1).padStart(2, '0')} OF {scenes.length}</span>
                <h3>{currentScene.title}</h3>
                <p>Created by <strong>{currentScene.author}</strong></p>
              </div>
              <div className="splat-modal-controls">
                <a
                  href={`https://superspl.at/scene/${currentScene.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="modal-external-link"
                >
                  Open in SuperSplat ↗
                </a>
                <button
                  className="modal-nav-btn"
                  onClick={prevSplat}
                  aria-label="Previous Splat"
                  title="Previous scene (Left Arrow)"
                >
                  ←
                </button>
                <button
                  className="modal-nav-btn"
                  onClick={nextSplat}
                  aria-label="Next Splat"
                  title="Next scene (Right Arrow)"
                >
                  →
                </button>
                <button
                  className="modal-close-btn"
                  onClick={() => setActiveModal(null)}
                  aria-label="Close viewer"
                  title="Close (Esc)"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="splat-modal-body">
              {!iframeLoaded && (
                <div className="splat-modal-loader">
                  <span className="spinner" />
                  <b>Loading 3D Gaussian Splat…</b>
                  <small>{currentScene.title}</small>
                </div>
              )}
              <iframe
                key={currentScene.id}
                title={`${currentScene.title} 3D Gaussian Splat`}
                src={`https://superspl.at/s?id=${currentScene.id}`}
                allow="fullscreen; xr-spatial-tracking; accelerometer; gyroscope"
                onLoad={() => setIframeLoaded(true)}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function CollisionFeature() {
  return (
    <section id="collision" className="section collision-section">
      <div className="collision-header">
        <p className="eyebrow">Precision Point Cloud Engine</p>
        <h2>How our plugin generates per-poly precision point clouds</h2>
      </div>

      <div className="collision-grid">
        <div className="collision-card">
          <div className="card-phase">STEP 01</div>
          <div className="card-icon">⚡</div>
          <h3>Enables Complex Collision</h3>
          <p>
            Automatically switches every scene mesh to per-polygon collision so raycasts hit true geometry instead of simplified boxes.
          </p>
        </div>

        <div className="collision-card highlighted">
          <div className="card-phase">STEP 02</div>
          <div className="card-icon">🎯</div>
          <h3>Dense Surface Raycasting</h3>
          <p>
            Casts sub-millimeter geometric rays against exact polygon faces to accurately capture fine trims, foliage, and organic surfaces.
          </p>
        </div>

        <div className="collision-card">
          <div className="card-phase">STEP 03</div>
          <div className="card-icon">🛡️</div>
          <h3>Restores Original Settings</h3>
          <p>
            Immediately reverts all mesh collision presets back to their exact original state once done. Your project stays cleanly untouched.
          </p>
        </div>
      </div>
    </section>
  );
}

function ModeVisual({type, src, title}) {
  return (
    <div className={'mode-visual ' + type}>
      <img src={src} alt={title} loading="lazy" />
      <span />
    </div>
  );
}

function Modes() {
  return (
    <section id="modes" className="section modes">
      <div className="section-head">
        <p className="eyebrow">Camera Rigs & Capture Options</p>
        <h2>Build a capture plan that matches your scene.</h2>
        <p>Purpose-built camera placement rigs for objects, paths, rooms, and large exterior maps — saving you hours of manual camera positioning.</p>
      </div>
      <div className="mode-grid">
        {modes.map(([type, title, copy, src]) => (
          <article key={type}>
            <ModeVisual type={type} src={src} title={title} />
            <div className="mode-copy">
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="section features">
      <div className="feature-intro">
        <p className="eyebrow feature-label">What's New in 3.0</p>
        <h2>Capture faster.<br />Iterate with control.</h2>
      </div>
      <article className="speed-card">
        <span>UP TO APPROXIMATELY</span>
        <strong>4×</strong>
        <h3>faster image capture in tested projects</h3>
        <p>Performance varies by scene, settings, storage and hardware.</p>
      </article>
      <div className="feature-cards">
        <article>
          <b>Movie Render Queue</b>
          <p>Anti-aliasing, temporal and spatial sampling controls.</p>
        </article>
        <article>
          <b>Oblique Capture Rig</b>
          <p>Smart Ortho 3-View and Smart Oblique 5-View.</p>
        </article>
        <article>
          <b>Automated Dataset Pipeline</b>
          <p>Multi-angle capture, point cloud generation & radiance coloring in one pass.</p>
        </article>
      </div>
      <aside className="iteration">
        <p className="eyebrow">Incremental Capture</p>
        <h3>Expand scene coverage without recapturing everything.</h3>
        <p className="iteration-desc">
          Version 3.0 lets you append new cameras and capture missing angles without starting over. Seamlessly update existing datasets while preserving your previous renders and point cloud data.
        </p>
      </aside>
    </section>
  );
}

function UseCases() {
  const audiences = ['Arch-viz', 'Product Visualization', 'Game Development', 'Technical Art', 'Virtual Production', '3DGS / NeRF Research'];
  return (
    <section id="use-cases" className="section compat">
      <div className="audience">
        <p className="eyebrow">Use cases</p>
        <h2>Built for technical 3D workflows.</h2>
        <div className="audience-tags">
          {audiences.map((x) => (
            <span key={x}>{x}</span>
          ))}
        </div>
      </div>
      <div className="requirements">
        <article>
          <small>Platform</small>
          <b>Windows</b>
        </article>
        <article>
          <small>Unreal Engine</small>
          <b>5.4 — 5.8</b>
        </article>
      </div>
    </section>
  );
}

function CompanionPlugin() {
  return (
    <section className="section companion-section">
      <div className="companion-card">
        <div className="companion-media">
          <img
            src="./wallgs-thumbnail.webp"
            alt="WallGS - Render Gaussian Splats inside Unreal Engine"
            loading="lazy"
          />
        </div>
        <div className="companion-content">
          <p className="companion-eyebrow">/ COMPANION WORKFLOW</p>
          <h2>Looking to render Gaussian splats inside Unreal Engine instead?</h2>
          <p className="companion-desc">
            WallGS gives you the tools you need to import and render 3D Gaussian Splats directly inside Unreal Engine with high real-time performance and seamless scene integration.
          </p>
          <div className="companion-actions">
            <a className="companion-btn" href={WALLGS_FAB} target="_blank" rel="noreferrer">
              Get the plugin on Fab ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="section faq">
      <div className="section-head">
        <p className="eyebrow">FAQ</p>
        <h2>Frequently Asked Questions</h2>
      </div>
      <div className="faq-list">
        {faqs.map(([q, a], i) => (
          <article key={q}>
            <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
              {q}
              <span>{open === i ? '−' : '+'}</span>
            </button>
            <div className={'answer ' + (open === i ? 'open' : '')}>
              <p>{a}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function App() {
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <Modes />
        <Workflow />
        <Showcase />
        <CollisionFeature />
        <Features />
        <UseCases />
        <CompanionPlugin />
        <FAQ />
        <section className="section final">
          <p className="eyebrow">Speed up your 3DGS pipeline</p>
          <h2>Ready to turn your Unreal scenes into Gaussian Splat datasets?</h2>
          <p className="final-sub">
            Set up camera rigs in minutes, generate COLMAP datasets with one click, and train high-fidelity Gaussian Splats in Postshot, LichtFeld Studio, or your favorite 3DGS trainer.
          </p>
          <div className="hero-actions">
            <a className="button primary" href={FAB} target="_blank" rel="noreferrer">Get it on Fab <Arrow /></a>
            <a className="button quiet" href={DOCS} target="_blank" rel="noreferrer">Read documentation</a>
            <a className="button quiet" href={DISCORD} target="_blank" rel="noreferrer">Join Discord</a>
          </div>
        </section>
      </main>
      <footer>
        <Logo />
        <p>Unreal to Gaussian Splat — Camera Rigs & Automated COLMAP Dataset Generator</p>
        <a href={FAB}>Fab ↗</a>
        <a href={DOCS}>Docs ↗</a>
        <a href={DISCORD}>Discord ↗</a>
      </footer>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
