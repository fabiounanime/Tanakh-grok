function wrapLines(ctx, text, maxWidth) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const word of words) {
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

export async function shareVerseCard({ ref, portuguese, original, rtl }) {
  await document.fonts?.ready;
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#100e0b';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#d4a017';
  ctx.lineWidth = 3;
  ctx.strokeRect(48, 48, canvas.width - 96, canvas.height - 96);

  ctx.fillStyle = '#d4a017';
  ctx.font = '600 42px Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(ref || 'Bíblia Origens', 96, 160);

  ctx.fillStyle = '#f4f1ea';
  ctx.font = '600 54px "Noto Serif", Georgia, serif';
  const ptLines = wrapLines(ctx, portuguese || '', 860).slice(0, 8);
  ptLines.forEach((line, i) => ctx.fillText(line, 96, 280 + i * 72));

  if (original) {
    const y = 280 + ptLines.length * 72 + 48;
    ctx.strokeStyle = 'rgba(212,160,23,0.45)';
    ctx.beginPath();
    ctx.moveTo(96, y);
    ctx.lineTo(984, y);
    ctx.stroke();
    ctx.fillStyle = '#f7f4ee';
    ctx.font = '600 64px "Noto Sans Hebrew", "Noto Serif", serif';
    ctx.textAlign = rtl ? 'right' : 'left';
    const origLines = wrapLines(ctx, original, 860).slice(0, 4);
    origLines.forEach((line, i) => {
      ctx.fillText(line, rtl ? 984 : 96, y + 90 + i * 84);
    });
  }

  ctx.textAlign = 'left';
  ctx.fillStyle = '#b7a078';
  ctx.font = '500 32px Inter, sans-serif';
  ctx.fillText('Bíblia Origens', 96, 1240);

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
