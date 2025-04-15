import { supabaseUrl } from "../services/supabase";
const imageUrl = `${supabaseUrl}/storage/v1/object/public/cocktails/`;

export const cocktails = [
  {
    name: "Old Fashioned",
    description:
      "Un cóctel clásico del siglo XIX que combina bourbon o whisky de centeno con un toque de azúcar, amargos aromáticos y una piel de naranja flameada. Perfecto para los amantes de sabores intensos, secos y ligeramente dulces.",
    alcohol_percentage: 19,
    has_non_alcoholic_version: false,
    is_available: true,
    image_url: imageUrl + "old_fashioned.webp",
  },
  {
    name: "Negroni",
    description:
      "La mezcla italiana perfecta de gin seco, vermut rojo y Campari, agitada con hielo y servida con una rodaja de naranja. Ideal como aperitivo, con su sabor amargo y aromático que despierta los sentidos.",
    alcohol_percentage: 22,
    has_non_alcoholic_version: false,
    is_available: true,
    image_url: imageUrl + "negroni.webp",
  },
  {
    name: "Espresso Martini",
    description:
      "Una combinación sofisticada de vodka premium, café espresso recién hecho y licor de café. Con una textura sedosa y un sabor intenso a café, es perfecto como cóctel postre o para cerrar una noche especial.",
    alcohol_percentage: 18,
    has_non_alcoholic_version: false,
    is_available: true,
    image_url: imageUrl + "espresso_martini.webp",
  },
  {
    name: "Pornstar Martini",
    description:
      "Vodka infusionado con vainilla, puré de maracuyá fresco y licor de fruta tropical. Servido con una dosis de prosecco frío al lado. Es afrutado, sexy y provocativo, ideal para celebraciones atrevidas.",
    alcohol_percentage: 15,
    has_non_alcoholic_version: true,
    is_available: true,
    image_url: imageUrl + "pornstar_martini.webp",
  },
  {
    name: "Margarita",
    description:
      "El clásico mexicano por excelencia: tequila 100% agave, zumo de lima recién exprimido y triple sec. Sal en el borde y hielo picado para una experiencia refrescante y vibrante.",
    alcohol_percentage: 18,
    has_non_alcoholic_version: false,
    is_available: true,
    image_url: imageUrl + "margarita.webp",
  },
  {
    name: "Piña Colada",
    description:
      "Un trago tropical y cremoso que mezcla ron blanco, leche de coco espesa y jugo de piña natural. Se sirve frío y batido, como una escapada directa al Caribe.",
    alcohol_percentage: 14,
    has_non_alcoholic_version: true,
    is_available: true,
    image_url: imageUrl + "pina_colada.webp",
  },
  {
    name: "Mai Tai",
    description:
      "Doble ron (oscuro y claro), lima fresca, licor de naranja y almendra (orgeat), servido con hielo y una menta fresca. Es potente, tropical y uno de los grandes del tiki.",
    alcohol_percentage: 17,
    has_non_alcoholic_version: false,
    is_available: true,
    image_url: imageUrl + "mai_tai.webp",
  },
  {
    name: "Mojito",
    description:
      "Una mezcla refrescante de ron blanco, lima, azúcar, menta fresca y soda. Muy popular en verano por su frescura, y disponible en versión sin alcohol sin perder su esencia.",
    alcohol_percentage: 13,
    has_non_alcoholic_version: true,
    is_available: true,
    image_url: imageUrl + "mojito.webp",
  },
  {
    name: "Paloma",
    description:
      "Tequila combinado con soda de pomelo, zumo de lima y un toque de sal. Un cóctel ligero, cítrico y burbujeante que rivaliza con la Margarita en popularidad en México.",
    alcohol_percentage: 12,
    has_non_alcoholic_version: false,
    is_available: true,
    image_url: imageUrl + "paloma.webp",
  },
  {
    name: "Cosmopolitan",
    description:
      "Vodka premium, triple sec, zumo de arándano y lima. Elegante, ácido y frutal. Popularizado por la serie 'Sex and the City', es un clásico moderno.",
    alcohol_percentage: 16,
    has_non_alcoholic_version: true,
    is_available: true,
    image_url: imageUrl + "cosmopolitan.webp",
  },
  {
    name: "Bloody Mary",
    description:
      "Vodka, zumo de tomate, salsa Worcestershire, Tabasco, sal, pimienta y un toque de apio. Un cóctel brunch con carácter, especiado y revitalizante.",
    alcohol_percentage: 13,
    has_non_alcoholic_version: true,
    is_available: true,
    image_url: imageUrl + "bloody_mary.webp",
  },
  {
    name: "Manhattan",
    description:
      "Whiskey de centeno, vermut rojo y un par de gotas de angostura. Sabor robusto, amaderado y elegante, servido en copa cocktail con cereza de marrasquino.",
    alcohol_percentage: 21,
    has_non_alcoholic_version: false,
    is_available: true,
    image_url: imageUrl + "manhattan.webp",
  },
  {
    name: "Caipirinha",
    description:
      "Cachaça brasileña, azúcar y lima triturada. Refrescante, intenso y directo al paladar. El cóctel más representativo de Brasil.",
    alcohol_percentage: 20,
    has_non_alcoholic_version: false,
    is_available: true,
    image_url: imageUrl + "caipirinha.webp",
  },
  {
    name: "Aperol Spritz",
    description:
      "Aperol, prosecco y soda en partes equilibradas. Ligero, burbujeante y de color vibrante. Perfecto para una tarde soleada.",
    alcohol_percentage: 11,
    has_non_alcoholic_version: true,
    is_available: true,
    image_url: imageUrl + "aperol_spritz.webp",
  },
  {
    name: "Bellini",
    description:
      "Cóctel elegante hecho con puré de melocotón blanco y prosecco frío. Sutil, afrutado y sofisticado. Nacido en el Harry’s Bar de Venecia.",
    alcohol_percentage: 9,
    has_non_alcoholic_version: true,
    is_available: true,
    image_url: imageUrl + "bellini.webp",
  },
  {
    name: "Dark 'n' Stormy",
    description:
      "Ron oscuro y cerveza de jengibre con un toque de lima. Especiado, potente y refrescante. Originario de las Bermudas.",
    alcohol_percentage: 15,
    has_non_alcoholic_version: false,
    is_available: true,
    image_url: imageUrl + "dark_n_stormy.webp",
  },
  {
    name: "French 75",
    description:
      "Gin, champán, zumo de limón y azúcar. Burbujeante, seco y con un final elegante. Ideal para brindar en ocasiones especiales.",
    alcohol_percentage: 18,
    has_non_alcoholic_version: true,
    is_available: true,
    image_url: imageUrl + "french_75.webp",
  },
  {
    name: "Clover Club",
    description:
      "Gin, frambuesa, zumo de limón y clara de huevo. Cremoso, afrutado y con una textura única. Un cóctel olvidado que ha vuelto con fuerza.",
    alcohol_percentage: 16,
    has_non_alcoholic_version: false,
    is_available: true,
    image_url: imageUrl + "clover_club.webp",
  },
  {
    name: "Tom Collins",
    description:
      "Gin, zumo de limón, azúcar y soda. Sencillo, refrescante y burbujeante. Un clásico que nunca falla.",
    alcohol_percentage: 14,
    has_non_alcoholic_version: true,
    is_available: true,
    image_url: imageUrl + "tom_collins.webp",
  },
  {
    name: "Whiskey Sour",
    description:
      "Whiskey, zumo de limón, azúcar y clara de huevo. Equilibrio perfecto entre ácido, dulce y amargo, con una espuma suave y sedosa.",
    alcohol_percentage: 19,
    has_non_alcoholic_version: true,
    is_available: true,
    image_url: imageUrl + "whiskey_sour.webp",
  },
];
