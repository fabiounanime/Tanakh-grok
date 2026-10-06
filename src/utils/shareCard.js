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

function paintParchment(ctx, width, height) {
  const paper = ctx.createLinearGradient(0, 0, width, height);
  paper.addColorStop(0, '#f8efd8');
  paper.addColorStop(0.45, '#f3e2c0');
  paper.addColorStop(1, '#e6cd9e');
  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, width, height);

  const stains = [
    [170, 140, 240],
    [880, 260, 280],
    [420, height * 0.72, 320],
    [760, height - 120, 200],
  ];
  for (const [x, y, radius] of stains) {
    const spot = ctx.createRadialGradient(x, y, 10, x, y, radius);
    spot.addColorStop(0, 'rgba(122, 74, 28, 0.07)');
    spot.addColorStop(1, 'rgba(122, 74, 28, 0)');
    ctx.fillStyle = spot;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const edge = ctx.createLinearGradient(0, 0, width, 0);
  edge.addColorStop(0, 'rgba(92, 52, 18, 0.2)');
  edge.addColorStop(0.07, 'rgba(92, 52, 18, 0)');
  edge.addColorStop(0.93, 'rgba(92, 52, 18, 0)');
  edge.addColorStop(1, 'rgba(92, 52, 18, 0.2)');
  ctx.fillStyle = edge;
  ctx.fillRect(0, 0, width, height);

  const shade = ctx.createLinearGradient(0, 0, 0, height);
  shade.addColorStop(0, 'rgba(92, 52, 18, 0.12)');
  shade.addColorStop(0.06, 'rgba(92, 52, 18, 0)');
  shade.addColorStop(0.94, 'rgba(92, 52, 18, 0)');
  shade.addColorStop(1, 'rgba(92, 52, 18, 0.16)');
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = '#8a5424';
  ctx.lineWidth = 8;
  ctx.strokeRect(28, 28, width - 56, height - 56);
  ctx.strokeStyle = 'rgba(138, 84, 36, 0.45)';
  ctx.lineWidth = 2;
  ctx.strokeRect(46, 46, width - 92, height - 92);
}

export async function shareVerseCard({ ref, portuguese, original, rtl }) {
  await document.fonts?.ready;
  const width = 1080;
  const padX = 96;
  const textWidth = width - padX * 2;
  const ptSize = 52;
  const ptGap = Math.round(ptSize * 1.38);
  const origSize = 58;
  const origGap = Math.round(origSize * 1.36);
  const brandSize = 30;

  const measure = document.createElement('canvas').getContext('2d');
  measure.font = `600 ${ptSize}px "Noto Serif", Georgia, serif`;
  const ptLines = wrapLines(measure, portuguese || '', textWidth);
  measure.font = `600 ${origSize}px ${rtl ? '"Noto Sans Hebrew"' : '"Noto Serif"'}, serif`;
  const origLines = original ? wrapLines(measure, original, textWidth) : [];

  const refY = 132;
  let lastBaseline = refY;
  let firstPt = 0;
  let firstOrig = 0;
  let dividerY = 0;
  if (ptLines.length) {
    firstPt = refY + 70 + ptSize;
    lastBaseline = firstPt + (ptLines.length - 1) * ptGap;
  }
  if (origLines.length) {
    dividerY = lastBaseline + (ptLines.length ? 44 : 56);
    firstOrig = dividerY + 36 + origSize;
    lastBaseline = firstOrig + (origLines.length - 1) * origGap;
  }
  const descent = Math.round((origLines.length ? origSize : ptSize) * 0.32);
  const brandY = lastBaseline + descent + 52 + brandSize;
  const height = brandY + 64;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  paintParchment(ctx, width, height);

  ctx.fillStyle = '#6d3d16';
  ctx.font = '700 40px Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(ref || 'Bíblia Origens', padX, refY);

  ctx.strokeStyle = 'rgba(109, 61, 22, 0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padX, refY + 24);
  ctx.lineTo(width - padX, refY + 24);
  ctx.stroke();

  ctx.fillStyle = '#2c2116';
  ctx.font = `600 ${ptSize}px "Noto Serif", Georgia, serif`;
  ptLines.forEach((line, index) => {
    ctx.fillText(line, padX, firstPt + index * ptGap);
  });

  if (origLines.length) {
    ctx.strokeStyle = 'rgba(109, 61, 22, 0.28)';
    ctx.beginPath();
    ctx.moveTo(padX, dividerY);
    ctx.lineTo(width - padX, dividerY);
    ctx.stroke();
    ctx.fillStyle = '#3b2918';
    ctx.font = `600 ${origSize}px ${rtl ? '"Noto Sans Hebrew"' : '"Noto Serif"'}, serif`;
    ctx.textAlign = rtl ? 'right' : 'left';
    const x = rtl ? width - padX : padX;
    origLines.forEach((line, index) => {
      ctx.fillText(line, x, firstOrig + index * origGap);
    });
  }

  ctx.textAlign = 'left';
  ctx.fillStyle = '#8a5a32';
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
