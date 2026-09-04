// Replace individual sources here without changing layout or motion.
export type Photo = { name: string; alt: string; caption?: string; generated?: boolean; position?: string };
export const photos = {
  hero: { name: 'hero', alt: 'El conjunto de dos cabañas de barro, rodeado de vegetación, bajo las montañas de Epuyén' },
  hands: { name:'real-clay', alt:'Fotografía del taller: una mano sostiene una pieza de arcilla decorada' },
  clay: { name:'ceramic-switch', alt:'Detalle real de una pieza cerámica que enmarca una tecla de luz en la casa' },
} satisfies Record<string,Photo>;
export const contact = {
  // Leave blank until the owner supplies verified contact information.
  whatsappNumber: '',
  instagramUrl: '',
  airbnbUrl: '',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Epuy%C3%A9n%2C+Chubut%2C+Argentina',
};
export const cabins = [
  { number:'01', title:'La luz entra primero.', label:'Cabaña 01', capacity:'4 personas', description:'Un ventanal para mirar afuera. Madera, barro y una habitación que se asoma al living.', cover:'cabin-one', images:[
    {name:'cabin-one',alt:'Cabaña 01: living soleado, ventanales y escalera de madera',caption:'El living, abierto al paisaje.'},
    {name:'new-living',alt:'Cabaña 01: rincón del living con sillón, banderines y luz sobre los ventanales',caption:'La luz de la tarde en el living de la cabaña 01.'},
    {name:'cabin-one-kitchen',alt:'Cabaña 01: cocina, comedor y escalera artesanal',caption:'Cocina y comedor completos.'},
    {name:'cabin-one-bedroom',alt:'Cabaña 01: dormitorio principal en el entrepiso',caption:'El dormitorio balconea al living.'},
    {name:'cabin-one-light',alt:'Cabaña 01: luz atravesando vidrios de colores en el barro',caption:'La luz también habita la pared.'},
    {name:'new-exterior',alt:'Frente compartido de las dos cabañas para cuatro, con dos accesos independientes',caption:'Exterior compartido por las cabañas 01 y 02. Dos unidades construidas en espejo.'}
  ]},
  { number:'02', title:'Del otro lado, otro ritmo.', label:'Cabaña 02', capacity:'4 personas', description:'Al lado de la primera, construida en espejo. La misma forma de habitar, con sus propios rincones.', cover:'cabin-two', images:[
    {name:'cabin-two',alt:'Cabaña 02: escalera de madera y dormitorio en altura',caption:'Una escalera que conserva la forma de la madera.'},
    {name:'cabin-two-living',alt:'Cabaña 02: mesa y living junto al ventanal',caption:'El comedor, la cocina y el living.'},
    {name:'cabin-two-window',alt:'Cabaña 02: rincón para descansar frente a la montaña',caption:'Un rincón junto a la ventana.'},
    {name:'cabin-two-stairs',alt:'Cabaña 02: detalle de los escalones artesanales',caption:'Cada detalle, hecho a mano.'},
    {name:'new-exterior',alt:'Frente compartido de las dos cabañas para cuatro, con dos accesos independientes',caption:'Exterior compartido por las cabañas 01 y 02. Dos unidades construidas en espejo.'}
  ]},
  { number:'03', title:'Un pequeño refugio.', label:'Cabaña para dos', capacity:'2 personas', description:'Más pequeña, más íntima. Una ventana en flor y lo necesario para quedarse un rato más.', cover:'cabin-small', images:[
    {name:'cabin-small',alt:'Exterior de la cabaña para dos, con madera y ventana en forma de flor',caption:'La más pequeña de las tres.'},
    {name:'cabin-small-inside',alt:'Interior de la cabaña para dos: cama, madera y vidrios de colores',caption:'Un interior de barro, madera y color.'},
    {name:'cabin-small-window',alt:'Mesa junto a la ventana flor de la cabaña para dos',caption:'Un lugar para el mate, o para nada.'},
    {name:'cabin-small-bath',alt:'Bacha de cerámica y espejo artesanal de la cabaña para dos',caption:'Los detalles también se habitan.'}
  ]}
];
