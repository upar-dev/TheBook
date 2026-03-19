<script>
  import { BOOK_TITLE } from "../lib/config.js";
  import { Canvas, T } from "@threlte/core";
  import { OrbitControls } from "@threlte/extras";
  import * as THREE from "three";
  import { onMount } from "svelte";
  import coverUrl from "../assets/cover.png";

  // ── Book dimensions ──
  const W = 1.0;
  const H = 1.4;
  const COVER = 0.04;
  const SPINE_D = 0.35;
  const PAGES_D = SPINE_D - COVER * 2;
  const PAGES_INSET = 0.03;

  // ── Colors ──
  const COVER_COLOR = "#853953";
  const SPINE_COLOR = "#6E2F48";
  const PAGE_COLOR = "#FFFEF5";
  const PAGE_EDGE_COLOR = "#FFEF5F";

  // ── Text content ──
  const AUTHORS = "John Doe  ·  Van Dam  ·  Sam Alt";
  const DEPARTMENT = "University Department";

  // ── Texture resolution ──
  const TEX_W = 1024;
  const TEX_H = Math.round(TEX_W * (H / W));

  // ── Reactive state ──
  let frontTexture = $state(null);
  let backTexture = $state(null);

  // ── Multi-material for front cover box (6 faces) ──
  // BoxGeometry face order: +x, -x, +y, -y, +z (front), -z (back)
  let frontMaterials = $derived.by(() => {
    const side = new THREE.MeshStandardMaterial({ color: COVER_COLOR, roughness: 0.7 });
    if (!frontTexture) return [side, side, side, side, side, side];
    const face = new THREE.MeshStandardMaterial({ map: frontTexture, roughness: 0.55 });
    return [side, side, side, side, face, side];
  });

  let backMaterials = $derived.by(() => {
    const side = new THREE.MeshStandardMaterial({ color: COVER_COLOR, roughness: 0.7 });
    if (!backTexture) return [side, side, side, side, side, side];
    const face = new THREE.MeshStandardMaterial({ map: backTexture, roughness: 0.55 });
    return [side, side, side, side, side, face];
  });

  // ── Wavy page-edge geometry ──
  function createWavyPageEdge(width, height, axis = "x") {
    const segW = 120;
    const segH = 60;
    const geo = new THREE.PlaneGeometry(width, height, segW, segH);
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      let sample = axis === "x" ? y : x;
      const wave =
        Math.sin(sample * 55) * 0.003 +
        Math.sin(sample * 110 + 1.2) * 0.0015 +
        Math.sin(sample * 200 + 0.5) * 0.0008;
      pos.setZ(i, wave);
    }

    geo.computeVertexNormals();
    return geo;
  }

  const wavyTop = createWavyPageEdge(W - PAGES_INSET * 2, PAGES_D, "x");
  const wavyBottom = createWavyPageEdge(W - PAGES_INSET * 2, PAGES_D, "x");
  const wavyFore = createWavyPageEdge(PAGES_D, H - PAGES_INSET * 2, "y");

  // ── Helper: wrap text on canvas ──
  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    let curY = y;
    for (const word of words) {
      const test = line + word + " ";
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line.trim(), x, curY);
        line = word + " ";
        curY += lineHeight;
      } else {
        line = test;
      }
    }
    if (line.trim()) {
      ctx.fillText(line.trim(), x, curY);
      curY += lineHeight;
    }
    return curY;
  }

  // ── Build front cover texture ──
  function buildFrontCover(img) {
    const c = document.createElement("canvas");
    c.width = TEX_W;
    c.height = TEX_H;
    const ctx = c.getContext("2d");

    // Background
    ctx.fillStyle = COVER_COLOR;
    ctx.fillRect(0, 0, TEX_W, TEX_H);

    // Subtle inset border
    const pad = 40;
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(pad, pad, TEX_W - pad * 2, TEX_H - pad * 2);

    // Title
    const titleSize = Math.round(TEX_W * 0.065);
    ctx.font = `700 ${titleSize}px "DM Sans", "Helvetica Neue", sans-serif`;
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(BOOK_TITLE, TEX_W / 2, TEX_H * 0.08);

    // Rule under title
    const ruleY = TEX_H * 0.08 + titleSize + 18;
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(TEX_W * 0.3, ruleY);
    ctx.lineTo(TEX_W * 0.7, ruleY);
    ctx.stroke();

    // Cover image — centered in the middle zone
    if (img) {
      const maxImgW = TEX_W * 0.945;
      const maxImgH = TEX_H * 0.6;
      const imgAspect = img.width / img.height;
      let drawW, drawH;

      if (imgAspect > maxImgW / maxImgH) {
        drawW = maxImgW;
        drawH = maxImgW / imgAspect;
      } else {
        drawH = maxImgH;
        drawW = maxImgH * imgAspect;
      }

      const imgX = (TEX_W - drawW) / 2;
      const imgY = TEX_H * 0.28;
      ctx.drawImage(img, imgX, imgY, drawW, drawH);
    }

    // Authors
    const authSize = Math.round(TEX_W * 0.028);
    ctx.font = `400 ${authSize}px "DM Sans", "Helvetica Neue", sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.textBaseline = "bottom";
    ctx.fillText(AUTHORS, TEX_W / 2, TEX_H * 0.82);

    // Department
    const deptSize = Math.round(TEX_W * 0.022);
    ctx.font = `300 ${deptSize}px "DM Sans", "Helvetica Neue", sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillText(DEPARTMENT, TEX_W / 2, TEX_H * 0.92);

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  // ── Build back cover texture — review quotes ──
  function buildBackCover() {
    const c = document.createElement("canvas");
    c.width = TEX_W;
    c.height = TEX_H;
    const ctx = c.getContext("2d");

    // Background
    ctx.fillStyle = COVER_COLOR;
    ctx.fillRect(0, 0, TEX_W, TEX_H);

    // Border
    const pad = 40;
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(pad, pad, TEX_W - pad * 2, TEX_H - pad * 2);

    ctx.textAlign = "center";

    // "Praise for" header
    const headerSize = Math.round(TEX_W * 0.028);
    ctx.font = `300 ${headerSize}px "DM Sans", "Helvetica Neue", sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.textBaseline = "top";
    ctx.fillText(`Praise for ${BOOK_TITLE}`, TEX_W / 2, TEX_H * 0.08);

    // Review quotes
    const reviews = [
      {
        quote: "\u201CA masterful exploration of ideas that challenges everything you thought you knew. Essential reading for our times.\u201D",
        author: "\u2014 The Literary Review",
      },
      {
        quote: "\u201CBrilliantly argued and beautifully written. This book will stay with you long after the final page.\u201D",
        author: "\u2014 Prof. Jane Smith, Oxford",
      },
      {
        quote: "\u201CProvocative, compelling, and deeply researched. A landmark work that redefines the conversation.\u201D",
        author: "\u2014 The Sunday Times",
      },
    ];

    let yPos = TEX_H * 0.18;
    const quoteSize = Math.round(TEX_W * 0.027);
    const attrSize = Math.round(TEX_W * 0.021);
    const maxWidth = TEX_W * 0.75;

    for (const review of reviews) {
      // Quote text (italic serif)
      ctx.font = `italic 400 ${quoteSize}px "Source Serif 4", Georgia, serif`;
      ctx.fillStyle = "rgba(255,255,255,0.82)";
      ctx.textBaseline = "top";
      yPos = wrapText(ctx, review.quote, TEX_W / 2, yPos, maxWidth, quoteSize + 6);

      // Attribution
      yPos += 4;
      ctx.font = `500 ${attrSize}px "DM Sans", "Helvetica Neue", sans-serif`;
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.fillText(review.author, TEX_W / 2, yPos);
      yPos += attrSize + 35;
    }

    // ISBN placeholder
    const isbnSize = Math.round(TEX_W * 0.018);
    ctx.font = `400 ${isbnSize}px "DM Sans", monospace`;
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.textBaseline = "bottom";
    ctx.fillText("ISBN 978-0-000000-00-0", TEX_W / 2, TEX_H * 0.94);

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  // ── Load on mount ──
  onMount(() => {
    backTexture = buildBackCover();

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      frontTexture = buildFrontCover(img);
    };
    img.onerror = () => {
      // No image — text-only front cover
      frontTexture = buildFrontCover(null);
    };
    img.src = coverUrl;
  });
</script>

<section class="flex flex-col items-center justify-center py-16 md:py-24">
  <div class="w-[480px] h-[630px] md:w-[600px] md:h-[750px]">
    <Canvas>
      <!-- Camera -->
      <T.PerspectiveCamera position={[1.8, 1.2, 2.2]} fov={40} makeDefault>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={1.2}
          minPolarAngle={Math.PI * 0.25}
          maxPolarAngle={Math.PI * 0.65}
        />
      </T.PerspectiveCamera>

      <!-- Lighting -->
      <T.AmbientLight intensity={0.5} />
      <T.DirectionalLight position={[4, 6, 3]} intensity={1.4} castShadow />
      <T.DirectionalLight position={[-2, 3, -1]} intensity={0.3} />

      <!-- Book group -->
      <T.Group>

        <!-- Front cover -->
        <T.Mesh position={[0, 0, SPINE_D / 2 - COVER / 2]} material={frontMaterials}>
          <T.BoxGeometry args={[W, H, COVER]} />
        </T.Mesh>

        <!-- Back cover -->
        <T.Mesh position={[0, 0, -(SPINE_D / 2 - COVER / 2)]} material={backMaterials}>
          <T.BoxGeometry args={[W, H, COVER]} />
        </T.Mesh>

        <!-- Spine -->
        <T.Mesh position={[-(W / 2), 0, 0]}>
          <T.BoxGeometry args={[COVER, H, SPINE_D]} />
          <T.MeshStandardMaterial color={SPINE_COLOR} roughness={0.8} />
        </T.Mesh>

        <!-- Page block -->
        <T.Mesh position={[PAGES_INSET / 2, 0, 0]}>
          <T.BoxGeometry args={[W - PAGES_INSET * 2, H - PAGES_INSET * 2, PAGES_D]} />
          <T.MeshStandardMaterial color={PAGE_COLOR} roughness={0.9} />
        </T.Mesh>

        <!-- Wavy page edge — top -->
        <T.Mesh
          geometry={wavyTop}
          position={[PAGES_INSET / 2, (H - PAGES_INSET * 2) / 2, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <T.MeshStandardMaterial color={PAGE_EDGE_COLOR} roughness={0.85} side={2} />
        </T.Mesh>

        <!-- Wavy page edge — bottom -->
        <T.Mesh
          geometry={wavyBottom}
          position={[PAGES_INSET / 2, -(H - PAGES_INSET * 2) / 2, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <T.MeshStandardMaterial color={PAGE_EDGE_COLOR} roughness={0.85} side={2} />
        </T.Mesh>

        <!-- Wavy page edge — fore-edge -->
        <T.Mesh
          geometry={wavyFore}
          position={[(W - PAGES_INSET * 2) / 2 + PAGES_INSET / 2, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <T.MeshStandardMaterial color={PAGE_EDGE_COLOR} roughness={0.85} side={2} />
        </T.Mesh>

      </T.Group>
    </Canvas>
  </div>
  <p class="mt-4 font-body text-sm text-charcoal/40 italic">
    Drag to rotate · {BOOK_TITLE}
  </p>
</section>