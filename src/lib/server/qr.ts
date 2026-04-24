import qrcode from 'qrcode-generator';

// Renders a QR code as an inline SVG string. Pure-JS, no Node APIs — safe on
// the Cloudflare Workers runtime without the nodejs_compat flag.
export function toSvgString(data: string): string {
  const qr = qrcode(0, 'M');
  qr.addData(data);
  qr.make();
  const count = qr.getModuleCount();
  const cell = 8;
  const margin = cell * 2;
  const size = count * cell + margin * 2;

  let rects = '';
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (qr.isDark(r, c)) {
        rects += `<rect x="${margin + c * cell}" y="${margin + r * cell}" width="${cell}" height="${cell}"/>`;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="100%" height="100%" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="#ffffff"/><g fill="#1a1a1a">${rects}</g></svg>`;
}
