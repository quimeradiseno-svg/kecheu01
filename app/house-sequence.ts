export const houseMoments = [
  { image: 'house-building', label: 'La estructura', alt: 'La estructura exterior de madera de la casa-taller durante la obra' },
  { image: 'house-beams', label: 'El entramado', alt: 'El interior de la casa-taller con sus vigas y materiales durante la construcción' },
  { image: 'new-family-building', label: 'El barro', alt: 'La familia trabajando con barro sobre los muros de la casa-taller' },
  { image: 'house-inside', label: 'La casa', alt: 'El interior terminado de la casa-taller familiar, con madera, ventanales y hogar' },
] as const;

export function houseMomentIndex(progress: number) {
  const bounded = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
  return Math.min(houseMoments.length - 1, Math.floor(bounded * houseMoments.length));
}
