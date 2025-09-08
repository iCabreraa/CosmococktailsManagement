import { supabaseUrl } from "../services/supabase";
const imageUrl = `${supabaseUrl}/storage/v1/object/public/cocktails/`;

export const cocktails = [
  {
    name: "Sex on the Beach",
    description:
      "A sweet and fruity classic made with vodka, peach schnapps, orange juice, and cranberry juice. Popular for its smooth and tropical taste.",
    alcohol_percentage: 14,
    has_non_alcoholic_version: false,
    is_available: true,
    image_url: imageUrl + "sex_on_the_beach.webp",
  },
  {
    name: "Pornstar Martini",
    description:
      "Vanilla vodka mixed with passion fruit purée and a hint of tropical liqueur, served with a shot of chilled prosecco. Bold, fruity, and seductive.",
    alcohol_percentage: 15,
    has_non_alcoholic_version: true,
    is_available: true,
    image_url: imageUrl + "pornstar_martini.webp",
  },
  {
    name: "Pornstar Martini 0.0",
    description:
      "A non-alcoholic version of the iconic passion fruit cocktail. All the bold, tropical flavor, none of the alcohol.",
    alcohol_percentage: 0,
    has_non_alcoholic_version: false,
    is_available: true,
    image_url: imageUrl + "pornstar_martini_00.webp",
  },
  {
    name: "Piña Colada",
    description:
      "A tropical blend of white rum, creamy coconut milk, and pineapple juice. Cold, smooth, and like a Caribbean vacation in a glass.",
    alcohol_percentage: 14,
    has_non_alcoholic_version: true,
    is_available: true,
    image_url: imageUrl + "pina_colada.webp",
  },
  {
    name: "Piña Colada 0.0",
    description:
      "A creamy, alcohol-free version of the tropical classic. Coconut and pineapple unite in a smooth, sweet escape.",
    alcohol_percentage: 0,
    has_non_alcoholic_version: false,
    is_available: true,
    image_url: imageUrl + "pina_colada_00.webp",
  },
  {
    name: "Gin and Tonic",
    description:
      "A crisp and refreshing mix of dry gin and tonic water, served over ice with a slice of lime. Clean, botanical, and timeless.",
    alcohol_percentage: 16,
    has_non_alcoholic_version: false,
    is_available: true,
    image_url: imageUrl + "gin_and_tonic.webp",
  },
  {
    name: "Margarita",
    description:
      "Tequila, lime juice, and triple sec, shaken with ice and served with a salted rim. A zesty and refreshing Mexican classic.",
    alcohol_percentage: 18,
    has_non_alcoholic_version: false,
    is_available: true,
    image_url: imageUrl + "margarita.webp",
  },
  {
    name: "Paloma",
    description:
      "Tequila mixed with grapefruit soda, lime juice, and a pinch of salt. Light, citrusy, and perfectly bubbly.",
    alcohol_percentage: 12,
    has_non_alcoholic_version: false,
    is_available: true,
    image_url: imageUrl + "paloma.webp",
  },
];
