export function generatePalette(count = 5) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const color = '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
    colors.push(color);
  }
  return colors;
}