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

function loadParchment() {
  if (!loadParchment.promise) {
    loadParchment.promise = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('pergaminho'));
      img.src = '/pergaminho.jpg';
    });
  }
  return loadParchment.promise;
}

function drawParchment(ctx, img, width, height) {
  const scale = Math.max(width / img.width, height / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  ctx.drawImage(img, (width - dw) / 2, (height - dh) / 2, dw, dh);
}

export async function shareVerseCard({ ref, portuguese, original, transliteration, rtl }) {
  await document.fonts?.ready;
  const parchment = await loadParchment();
  const width = 1080;
  const padX = 108;
  const textWidth = width - padX * 2;
  const ptSize = 50;
  const ptGap = Math.round(ptSize * 1.38);
  const origSize = 54;
  const origGap = Math.round(origSize * 1.36);
  const trSize = 40;
  const trGap = Math.round(trSize * 1.4);
  const brandSize = 28;

  const measure = document.createElement('canvas').getContext('2d');
  measure.font = `600 ${ptSize}px "Noto Serif", Georgia, serif`;
  const ptLines = wrapLines(measure, portuguese || '', textWidth);
  measure.font = `600 ${origSize}px ${rtl ? '"Noto Sans Hebrew"' : '"Noto Serif"'}, serif`;
  const origLines = original ? wrapLines(measure, original, textWidth) : [];
  measure.font = `500 ${trSize}px "Noto Serif", Georgia, serif`;
  const trLines = transliteration ? wrapLines(measure, transliteration, textWidth) : [];

  const refY = 118;
  let lastBaseline = refY;
  let firstPt = 0;
  let firstOrig = 0;
  let firstTr = 0;
  if (ptLines.length) {
    firstPt = refY + 62 + ptSize;
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
  const brandY = lastBaseline + 22 + 44 + brandSize;
  const height = brandY + 88;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  drawParchment(ctx, parchment, width, height);

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

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92));
  if (!blob) throw new Error('card');
  const file = new File([blob], 'versiculo.jpg', { type: 'image/jpeg' });
  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title: ref || 'Bíblia Origens' });
    return 'shared';
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'versiculo.jpg';
  link.click();
  URL.revokeObjectURL(url);
  return 'saved';
}
