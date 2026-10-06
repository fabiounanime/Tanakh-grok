function wrapLines(ctx, text, maxWidth) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  const pushLong = (token) => {
    let chunk = '';
    for (const char of token) {
      const next = chunk + char;
      if (ctx.measureText(next).width > maxWidth && chunk) {
        lines.push(chunk);
        chunk = char;
      } else {
        chunk = next;
      }
    }
    return chunk;
  };
  for (const word of words) {
    if (ctx.measureText(word).width > maxWidth) {
      if (line) {
        lines.push(line);
        line = '';
      }
      const rest = pushLong(word);
      if (rest) line = rest;
      continue;
    }
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function edgeWobble(t, side) {
  return Math.sin(t * 17 + side) * 14 + Math.sin(t * 6.5 + side * 2) * 9 + Math.sin(t * 31) * 4;
}

function paintRod(ctx, x, y, w, h) {
  const wood = ctx.createLinearGradient(x, y, x, y + h);
  wood.addColorStop(0, '#3d2412');
  wood.addColorStop(0.18, '#8a5a2b');
  wood.addColorStop(0.42, '#e7c48a');
  wood.addColorStop(0.58, '#b47a3c');
  wood.addColorStop(0.82, '#6a3e1c');
  wood.addColorStop(1, '#2c180c');
  ctx.fillStyle = wood;
  roundRect(ctx, x, y, w, h, h / 2);
  ctx.fill();
  ctx.fillStyle = '#f0d7a4';
  roundRect(ctx, x + 18, y + h * 0.28, w - 36, Math.max(3, h * 0.12), 4);
  ctx.fill();
  for (const cap of [x - 8, x + w - 28]) {
    const knob = ctx.createLinearGradient(cap, y - 6, cap, y + h + 6);
    knob.addColorStop(0, '#d7b173');
    knob.addColorStop(0.5, '#8d5a28');
    knob.addColorStop(1, '#3a2212');
    ctx.fillStyle = knob;
    roundRect(ctx, cap, y - 8, 36, h + 16, 12);
    ctx.fill();
  }
}

function paintParchment(ctx, width, height) {
  ctx.fillStyle = '#1a120c';
  ctx.fillRect(0, 0, width, height);

  const rodH = 58;
  const rodX = 70;
  const rodW = width - 140;
  paintRod(ctx, rodX, 28, rodW, rodH);
  paintRod(ctx, rodX, height - 28 - rodH, rodW, rodH);

  const top = 28 + rodH - 8;
  const bottom = height - 28 - rodH + 8;
  const bodyH = bottom - top;
  ctx.beginPath();
  ctx.moveTo(78, top);
  ctx.lineTo(width - 78, top);
  const steps = 28;
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    ctx.lineTo(width - 64 + edgeWobble(t, 1), top + bodyH * t);
  }
  for (let i = steps; i >= 0; i -= 1) {
    const t = i / steps;
    ctx.lineTo(64 + edgeWobble(t, 2), top + bodyH * t);
  }
  ctx.closePath();

  const skin = ctx.createLinearGradient(0, top, 0, bottom);
  skin.addColorStop(0, '#f4e2bc');
  skin.addColorStop(0.18, '#f7ebcf');
  skin.addColorStop(0.55, '#f0d7a6');
  skin.addColorStop(0.82, '#e7c48a');
  skin.addColorStop(1, '#d7ae6e');
  ctx.fillStyle = skin;
  ctx.fill();
  ctx.save();
  ctx.clip();

  for (let i = 0; i < 90; i += 1) {
    const y = top + ((i * 97) % bodyH);
    const stain = ctx.createRadialGradient(180 + (i % 5) * 160, y, 8, 180 + (i % 5) * 160, y, 90 + (i % 4) * 30);
    stain.addColorStop(0, 'rgba(120, 72, 28, 0.045)');
    stain.addColorStop(1, 'rgba(120, 72, 28, 0)');
    ctx.fillStyle = stain;
    ctx.fillRect(0, y - 80, width, 160);
  }

  ctx.globalAlpha = 0.22;
  ctx.strokeStyle = 'rgba(120, 74, 32, 0.35)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 46; i += 1) {
    const y = top + 20 + ((i * 53) % Math.max(1, bodyH - 40));
    ctx.beginPath();
    ctx.moveTo(90, y);
    ctx.bezierCurveTo(280, y - 8, 620, y + 10, width - 90, y - 4);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  const burn = ctx.createLinearGradient(0, top, 0, bottom);
  burn.addColorStop(0, 'rgba(90, 48, 16, 0.28)');
  burn.addColorStop(0.08, 'rgba(90, 48, 16, 0)');
  burn.addColorStop(0.92, 'rgba(90, 48, 16, 0)');
  burn.addColorStop(1, 'rgba(90, 48, 16, 0.34)');
  ctx.fillStyle = burn;
  ctx.fillRect(0, top, width, bodyH);

  ctx.restore();

  ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
  ctx.fillRect(90, top + 6, width - 180, 10);
  ctx.fillRect(90, bottom - 16, width - 180, 10);
}

export async function shareVerseCard({ ref, portuguese, original, transliteration, rtl }) {
  await document.fonts?.ready;
  const width = 1080;
  const padX = 120;
  const textWidth = width - padX * 2;
  const ptSize = 50;
  const ptGap = Math.round(ptSize * 1.38);
  const origSize = 54;
  const origGap = Math.round(origSize * 1.36);
  const trSize = 40;
  const trGap = Math.round(trSize * 1.4);
  const brandSize = 28;
  const rodBlock = 108;

  const measure = document.createElement('canvas').getContext('2d');
  measure.font = `600 ${ptSize}px "Noto Serif", Georgia, serif`;
  const ptLines = wrapLines(measure, portuguese || '', textWidth);
  measure.font = `600 ${origSize}px ${rtl ? '"Noto Sans Hebrew"' : '"Noto Serif"'}, serif`;
  const origLines = original ? wrapLines(measure, original, textWidth) : [];
  measure.font = `500 ${trSize}px "Noto Serif", Georgia, serif`;
  const trLines = transliteration ? wrapLines(measure, transliteration, textWidth) : [];

  const refY = rodBlock + 36;
  let lastBaseline = refY;
  let firstPt = 0;
  let firstOrig = 0;
  let firstTr = 0;
  if (ptLines.length) {
    firstPt = refY + 64 + ptSize;
    lastBaseline = firstPt + (ptLines.length - 1) * ptGap;
  }
  if (origLines.length) {
    firstOrig = lastBaseline + 48 + origSize;
    lastBaseline = firstOrig + (origLines.length - 1) * origGap;
  }
  if (trLines.length) {
    firstTr = lastBaseline + 36 + trSize;
    lastBaseline = firstTr + (trLines.length - 1) * trGap;
  }
  const descent = 18;
  const brandY = lastBaseline + descent + 48 + brandSize;
  const height = brandY + rodBlock;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  paintParchment(ctx, width, height);

  ctx.fillStyle = '#6a3b16';
  ctx.font = '700 36px Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(ref || 'Bíblia Origens', padX, refY);

  ctx.strokeStyle = 'rgba(106, 59, 22, 0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padX, refY + 18);
  ctx.lineTo(width - padX, refY + 18);
  ctx.stroke();

  ctx.fillStyle = '#2b1d12';
  ctx.font = `600 ${ptSize}px "Noto Serif", Georgia, serif`;
  ptLines.forEach((line, index) => {
    ctx.fillText(line, padX, firstPt + index * ptGap);
  });

  if (origLines.length) {
    ctx.fillStyle = '#3a2718';
    ctx.font = `600 ${origSize}px ${rtl ? '"Noto Sans Hebrew"' : '"Noto Serif"'}, serif`;
    ctx.textAlign = rtl ? 'right' : 'left';
    const x = rtl ? width - padX : padX;
    origLines.forEach((line, index) => {
      ctx.fillText(line, x, firstOrig + index * origGap);
    });
  }

  if (trLines.length) {
    ctx.textAlign = 'left';
    ctx.fillStyle = '#5c4630';
    ctx.font = `500 italic ${trSize}px "Noto Serif", Georgia, serif`;
    trLines.forEach((line, index) => {
      ctx.fillText(line, padX, firstTr + index * trGap);
    });
  }

  ctx.textAlign = 'left';
  ctx.fillStyle = '#7a4e28';
  ctx.font = `600 ${brandSize}px Inter, sans-serif`;
  ctx.fillText('Bíblia Origens', padX, brandY);

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('card');
  const file = new File([blob], 'versiculo.png', { type: 'image/png' });
  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title: ref || 'Bíblia Origens' });
    return 'shared';
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'versiculo.png';
  link.click();
  URL.revokeObjectURL(url);
  return 'saved';
}
