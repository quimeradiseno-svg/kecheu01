export const pauseMoments = [
  { image: 'new-living', text: 'Tomar mate.', alt: 'El living de la cabaña 01, con su sofá y la luz de la ventana' },
  { image: 'river', text: 'Escuchar el agua.', alt: 'Agua transparente entre los árboles del río en Epuyén' },
  { image: 'new-mountains', text: 'Mirar la montaña.', alt: 'Las montañas nevadas de Epuyén vistas desde Kecheu' },
  { image: 'pause', text: 'O nada.', alt: 'Un rincón vacío junto a la ventana y la vista a la montaña' },
] as const;

export function pauseMomentIndex(progress: number) {
  const bounded = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
  return Math.min(pauseMoments.length - 1, Math.floor(bounded * pauseMoments.length));
}
