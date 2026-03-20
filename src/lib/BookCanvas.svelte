<script>
  import { BOOK_TITLE } from "../lib/config.js";
  import { Canvas, T } from "@threlte/core";
  import { OrbitControls } from "@threlte/extras";
  import * as THREE from "three";
  import { onMount } from "svelte";
  import coverTextureUrl from "../assets/book_cover.jpeg";

  // ── Book dimensions ──
  const W = 1.0;
  const H = 1.4;
  const COVER = 0.04;
  const SPINE_D = 0.35;
  const PAGES_D = SPINE_D - COVER * 2;
  const PAGES_INSET = 0.03;

  // ── Colors ──
  const PAGE_COLOR = "#FFFEF5";
  const PAGE_EDGE_COLOR = "#FFEF5F";
  const EDGE_COLOR = "#1a6b6b"; // Darker teal for cover edges — reduces flicker contrast

  // ── Text content ──
  const AUTHORS = "John Doe  ·  Van Dam  ·  Sam Alt";
  const DEPARTMENT = "University Department";

  // ── Texture resolution ──
  const TEX_W = 1024;
  const TEX_H = Math.round(TEX_W * (H / W));

  // ── State ──
  let coverTexture = $state(null);
  let frontComposite = $state(null);
  let backComposite = $state(null);

  // ── Helper: wrap text returning final Y ──
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

  // ── Helper: draw a rounded rect ──
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  // ── Build front cover: texture + shadowed text overlay ──
  function buildFrontComposite(baseTex) {
    const c = document.createElement("canvas");
    c.width = TEX_W;
    c.height = TEX_H;
    const ctx = c.getContext("2d");

    // Draw the painting texture as background
    ctx.drawImage(baseTex.image, 0, 0, TEX_W, TEX_H);

    ctx.textAlign = "center";

    // Title with shadow
    const titleSize = Math.round(TEX_W * 0.065);
    ctx.font = `700 ${titleSize}px "DM Sans", "Helvetica Neue", sans-serif`;
    ctx.textBaseline = "top";
    // Shadow layers (multiple for a soft glow)
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillText(BOOK_TITLE, TEX_W / 2 + 2, TEX_H * 0.08 + 3);
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillText(BOOK_TITLE, TEX_W / 2 + 1, TEX_H * 0.08 + 1);
    // Actual text
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(BOOK_TITLE, TEX_W / 2, TEX_H * 0.08);

    // Thin rule
    const ruleY = TEX_H * 0.08 + titleSize + 14;
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(TEX_W * 0.3, ruleY);
    ctx.lineTo(TEX_W * 0.7, ruleY);
    ctx.stroke();

    // Authors with shadow
    const authSize = Math.round(TEX_W * 0.026);
    ctx.font = `400 ${authSize}px "DM Sans", "Helvetica Neue", sans-serif`;
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillText(AUTHORS, TEX_W / 2 + 1, ruleY + 15);
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.fillText(AUTHORS, TEX_W / 2, ruleY + 14);

    // Department at bottom with shadow
    const deptSize = Math.round(TEX_W * 0.022);
    ctx.font = `400 ${deptSize}px "DM Sans", "Helvetica Neue", sans-serif`;
    ctx.textBaseline = "bottom";
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillText(DEPARTMENT, TEX_W / 2 + 1, TEX_H * 0.93 + 1);
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fillText(DEPARTMENT, TEX_W / 2, TEX_H * 0.93);

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.anisotropy = 8;
    return tex;
  }

  // ── Build back cover: texture + review cards ──
  function buildBackComposite(baseTex) {
    const c = document.createElement("canvas");
    c.width = TEX_W;
    c.height = TEX_H;
    const ctx = c.getContext("2d");

    // Draw the painting (mirrored) as background
    ctx.save();
    ctx.translate(TEX_W, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(baseTex.image, 0, 0, TEX_W, TEX_H);
    ctx.restore();

    // Darken slightly for readability
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fillRect(0, 0, TEX_W, TEX_H);

    ctx.textAlign = "center";

    // "Praise for" header in a small pill
    const headerSize = Math.round(TEX_W * 0.024);
    const pillW = TEX_W * 0.5;
    const pillH = TEX_H * 0.04;
    const pillX = (TEX_W - pillW) / 2;
    const pillY = TEX_H * 0.05;

    roundRect(ctx, pillX, pillY, pillW, pillH, 6);
    ctx.fillStyle = "#1B2A4A";
    ctx.fill();

    ctx.font = `400 ${headerSize}px "DM Sans", "Helvetica Neue", sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.textBaseline = "middle";
    ctx.fillText(`Praise for ${BOOK_TITLE}`, TEX_W / 2, pillY + pillH / 2);

    // Review cards
    const reviews = [
      {
        quote: "\u201CA masterful exploration of ideas that challenges everything you thought you knew. Essential reading.\u201D",
        author: "\u2014 The Literary Review",
      },
      {
        quote: "\u201CBrilliantly argued and beautifully written. This book will stay with you long after the final page.\u201D",
        author: "\u2014 Prof. Jane Smith, Oxford",
      },
      {
        quote: "\u201CProvocative, compelling, and deeply researched. A landmark work in its field.\u201D",
        author: "\u2014 The Sunday Times",
      },
    ];

    const cardPad = 20;
    const cardX = TEX_W * 0.08;
    const cardW = TEX_W * 0.84;
    const quoteSize = Math.round(TEX_W * 0.025);
    const attrSize = Math.round(TEX_W * 0.019);
    const maxTextW = cardW - cardPad * 2;

    let yPos = TEX_H * 0.14;

    for (const review of reviews) {
      // Measure text height first
      ctx.font = `italic 400 ${quoteSize}px "Source Serif 4", Georgia, serif`;
      const words = review.quote.split(" ");
      let line = "";
      let lines = [];
      for (const word of words) {
        const test = line + word + " ";
        if (ctx.measureText(test).width > maxTextW && line) {
          lines.push(line.trim());
          line = word + " ";
        } else {
          line = test;
        }
      }
      if (line.trim()) lines.push(line.trim());

      const textH = lines.length * (quoteSize + 5);
      const cardH = cardPad + textH + 8 + attrSize + cardPad;

      // Draw card background — solid navy
      roundRect(ctx, cardX, yPos, cardW, cardH, 10);
      ctx.fillStyle = "#1B2A4A";
      ctx.fill();

      // Draw quote text
      ctx.font = `italic 400 ${quoteSize}px "Source Serif 4", Georgia, serif`;
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.textBaseline = "top";
      let textY = yPos + cardPad;
      for (const l of lines) {
        ctx.fillText(l, TEX_W / 2, textY);
        textY += quoteSize + 5;
      }

      // Attribution
      ctx.font = `500 ${attrSize}px "DM Sans", "Helvetica Neue", sans-serif`;
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.fillText(review.author, TEX_W / 2, textY + 6);

      yPos += cardH + 16;
    }

    // ISBN at bottom
    const isbnSize = Math.round(TEX_W * 0.017);
    ctx.font = `400 ${isbnSize}px "DM Sans", monospace`;
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.textBaseline = "bottom";
    ctx.fillText("ISBN 978-0-000000-00-0", TEX_W / 2, TEX_H * 0.95);

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.anisotropy = 8;
    return tex;
  }

  // ── Materials ──
  let frontMaterials = $derived.by(() => {
    const edge = new THREE.MeshStandardMaterial({
      color: EDGE_COLOR,
      roughness: 0.7,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });
    if (!frontComposite) return [edge, edge, edge, edge, edge, edge];
    const face = new THREE.MeshStandardMaterial({
      map: frontComposite,
      roughness: 0.45,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    return [edge, edge, edge, edge, face, edge];
  });

  let backMaterials = $derived.by(() => {
    const edge = new THREE.MeshStandardMaterial({
      color: EDGE_COLOR,
      roughness: 0.7,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });
    if (!backComposite) return [edge, edge, edge, edge, edge, edge];
    const face = new THREE.MeshStandardMaterial({
      map: backComposite,
      roughness: 0.45,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    return [edge, edge, edge, edge, edge, face];
  });

  let spineMaterial = $derived.by(() => {
    if (!coverTexture) {
      return new THREE.MeshStandardMaterial({ color: EDGE_COLOR, roughness: 0.7 });
    }
    const spineTex = coverTexture.clone();
    spineTex.wrapS = THREE.ClampToEdgeWrapping;
    spineTex.wrapT = THREE.ClampToEdgeWrapping;
    spineTex.repeat.set(0.3, 1);
    spineTex.offset.set(0.35, 0);
    spineTex.needsUpdate = true;
    return new THREE.MeshStandardMaterial({ map: spineTex, roughness: 0.6 });
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

  // ── Load texture on mount ──
  onMount(() => {
    const loader = new THREE.TextureLoader();
    loader.load(coverTextureUrl, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.anisotropy = 8;
      coverTexture = tex;

      // Build composites with text overlays
      frontComposite = buildFrontComposite(tex);
      backComposite = buildBackComposite(tex);
    });
  });
</script>

<section class="flex flex-col items-center justify-center py-16 md:py-10">
  <div class="w-[360px] h-[470px] md:w-[450px] md:h-[560px]">
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
      <T.AmbientLight intensity={0.6} />
      <T.DirectionalLight position={[4, 6, 3]} intensity={1.2} castShadow />
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
        <T.Mesh position={[-(W / 2), 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <T.BoxGeometry args={[SPINE_D, H, COVER]} />
          <T.MeshStandardMaterial
            map={spineMaterial.map}
            roughness={0.6}
          />
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