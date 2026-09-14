/* ===================================================
   product-data.js — Product Data Store
   Corardei — 2026
   =================================================== */

const PRODUCTS = {
  'rosario-francisco': {
    name: 'Rosario Francisco',
    category: 'Rosarios',
    price: '$10.000',
    priceNote: 'cada uno',
    promo: '¡Llevando dos pagá $17.000!',
    description: 'Rosario artesanal con medalla del Papa Francisco. Disponible en múltiples variantes de cuentas para que elijas la que más te guste.',
    shortDesc: 'Con cuentas plateadas, de madera, perladas, azules y bordó.',
    images: [
      'images/francisco_plateado.jpeg',
      'images/francisco_madera.jpeg',
      'images/francisco_perlado.jpeg',
      'images/francisco_azul.jpeg',
      'images/francisco_bordo.jpeg',
      'images/francisco_variedad.jpeg',
    ],
    variants: [
      { name: 'Plateado', image: 'images/francisco_plateado.jpeg' },
      { name: 'Madera', image: 'images/francisco_madera.jpeg' },
      { name: 'Perlado', image: 'images/francisco_perlado.jpeg' },
      { name: 'Azul', image: 'images/francisco_azul.jpeg' },
      { name: 'Bordó', image: 'images/francisco_bordo.jpeg' },
    ],
    details: [
      'Medalla central del Papa Francisco',
      'Crucifijo metálico resistente',
      'Cuentas de alta calidad',
      'Largo estándar (~50 cm)',
      'Hecho a mano con dedicación',
    ],
  },

  'rosario-san-benito': {
    name: 'Rosario San Benito',
    category: 'Rosarios',
    price: '$10.000',
    priceNote: 'cada uno',
    promo: '¡Llevando dos pagá $17.000!',
    description: 'Rosario artesanal con medalla de San Benito, patrono de Europa y protector contra el mal. Disponible en múltiples variantes de cuentas.',
    shortDesc: 'Con cuentas plateadas, de madera, perladas, azules y bordó.',
    images: [
      'images/san_benito_plateado.jpeg',
      'images/san_benito_madera.jpeg',
      'images/san_benito_perlado.jpeg',
      'images/san_benito_azul.jpeg',
      'images/san_benito_bordo.jpeg',
      'images/san_benito_variedad.jpeg',
    ],
    variants: [
      { name: 'Plateado', image: 'images/san_benito_plateado.jpeg' },
      { name: 'Madera', image: 'images/san_benito_madera.jpeg' },
      { name: 'Perlado', image: 'images/san_benito_perlado.jpeg' },
      { name: 'Azul', image: 'images/san_benito_azul.jpeg' },
      { name: 'Bordó', image: 'images/san_benito_bordo.jpeg' },
    ],
    details: [
      'Medalla central de San Benito',
      'Crucifijo metálico resistente',
      'Cuentas de alta calidad',
      'Largo estándar (~50 cm)',
      'Hecho a mano con dedicación',
    ],
  },

  'rosario-virgen-de-lujan': {
    name: 'Rosario Virgen de Luján',
    category: 'Rosarios',
    price: '$10.000',
    priceNote: 'cuentas celestes',
    priceAlt: '$12.000 con cuentas marmoladas',
    promo: '¡Llevando dos pagá $17.000!',
    description: 'Rosario artesanal dedicado a la Virgen de Luján, patrona de Argentina. Cuentas en tonos celestes y marmolados que evocan devoción mariana.',
    shortDesc: 'Con cuentas perladas celestes y marmoladas.',
    images: [
      'images/lujan_celeste.jpeg',
      'images/lujan_marmolado.jpeg',
      'images/lujan_variedad.jpeg',
    ],
    variants: [
      { name: 'Celeste', image: 'images/lujan_celeste.jpeg' },
      { name: 'Marmolado', image: 'images/lujan_marmolado.jpeg' },
    ],
    details: [
      'Medalla central de la Virgen de Luján',
      'Crucifijo metálico resistente',
      'Cuentas de alta calidad',
      'Largo estándar (~50 cm)',
      'Hecho a mano con dedicación',
    ],
  },

  'rosario-personalizado': {
    name: 'Rosario Personalizado',
    category: 'Rosarios',
    price: '$10.000',
    priceNote: 'cada uno',
    promo: '¡Llevando dos pagá $17.000!',
    description: 'Diseñá tu propio rosario eligiendo el crucifijo, las cuentas y el centro. ¡Escribinos por mensaje directo y te pasamos todas las opciones disponibles!',
    shortDesc: 'Podés personalizar el crucifijo, las cuentas y el centro.',
    images: [
      'images/personalizados.jpeg',
      'images/crucifijos1.jpeg',
      'images/crucifijos2.jpeg',
      'images/centro_francisco.jpeg',
      'images/centro_san_benito.jpeg',
    ],
    variants: [],
    details: [
      'Elegí tu crucifijo preferido',
      'Elegí el tipo y color de cuentas',
      'Elegí la medalla central',
      'Combinaciones únicas y personales',
      'Hecho a mano con dedicación',
    ],
  },

  'stickers-surtido': {
    name: 'Pack de Stickers Surtido',
    category: 'Stickers',
    price: '$2.500',
    priceNote: '10 stickers',
    priceAlt: '$1.500 por 5 stickers',
    promo: null,
    description: 'Pack de stickers católicos surtidos, ideales para decorar tu notebook, botella, celular o cuaderno. Diseños variados con temáticas de fe.',
    shortDesc: '10 stickers por $2.500 — 5 stickers por $1.500.',
    images: [
      'images/stickers1.jpeg',
    ],
    variants: [],
    details: [
      'Stickers de vinilo resistentes al agua',
      'Diseños católicos variados',
      'Ideales para notebooks, botellas y celulares',
      'Selección surtida por nosotras',
    ],
  },

  'stickers-eleccion': {
    name: 'Pack de Stickers a Elección',
    category: 'Stickers',
    price: '$3.500',
    priceNote: '10 stickers',
    priceAlt: '$2.500 por 5 stickers',
    promo: null,
    description: 'Elegí los stickers que más te gusten de nuestro catálogo. Pack personalizable con los diseños que vos quieras.',
    shortDesc: '10 stickers por $3.500 — 5 stickers por $2.500.',
    images: [
      'images/stickers2.jpeg',
    ],
    variants: [],
    details: [
      'Stickers de vinilo resistentes al agua',
      'Vos elegís los diseños',
      'Ideales para notebooks, botellas y celulares',
      'Catálogo amplio de diseños',
    ],
  },

  'stickers-personalizados': {
    name: 'Pack de Stickers Personalizados',
    category: 'Stickers',
    price: '$4.500',
    priceNote: '10 stickers',
    priceAlt: '$3.500 por 5 stickers',
    promo: null,
    description: 'Mandanos qué stickers querés y nosotras los hacemos. Diseño completamente personalizado según tus ideas.',
    shortDesc: '10 stickers por $4.500 — 5 stickers por $3.500.',
    images: [
      'images/stickers3.jpeg',
    ],
    variants: [],
    details: [
      'Stickers de vinilo resistentes al agua',
      'Diseño 100% personalizado',
      'Mandanos tu idea y lo hacemos realidad',
      'Ideales para regalos especiales',
    ],
  },
};
