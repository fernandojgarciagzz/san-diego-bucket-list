// San Diego Bucket List — items + coordenadas
// Las coordenadas son aproximadas. Ajusta lat/lng si encuentras la ubicación exacta.

const TRIP = {
  city: 'San Diego',
  dates: 'May 29 → Jun 3',
  year: 2026,
  groupLabel: 'Viaje familiar',
  center: [32.755, -117.20],
  initialZoom: 11
};

const SECTIONS = [
  {
    id: 'home',
    title: 'Airbnb',
    icon: '🏡',
    iconClass: 'icon-home',
    cardClass: 'card-home',
    markerColor: '#4A7C59',
    markerEmoji: '🏡',
    items: [
      {
        id: 'airbnb-del-cerro',
        name: 'Airbnb · Del Cerro',
        desc: '6201 Del Cerro Blvd, San Diego CA 92120. Base del viaje. Del Cerro queda al este, cerca de Mission Trails: ~15 min a Balboa Park y el Zoo, ~20 min a Downtown / Embarcadero, ~25 min a La Jolla y Mission Beach por la I-8 y la 52. Zona residencial tranquila.',
        tags: [
          { class: 'tag-group', label: 'Base familia' },
          { class: 'tag-tip', label: 'Del Cerro · zona residencial' }
        ],
        lat: 32.7898, lng: -117.0698, zoom: 15
      }
    ]
  },
  {
    id: 'race',
    title: 'La Carrera',
    icon: '🏁',
    iconClass: 'icon-race',
    cardClass: 'card-race',
    markerColor: '#C94F2A',
    items: [
      {
        id: 'rnr-half-marathon',
        name: "Rock 'n' Roll San Diego Half Marathon",
        desc: "Dom 31 Mayo · 6:15 AM · Inicio en Balboa Park (6th Ave & Quince St) · Finish en Downtown. El recorrido pasa por Mission Bay y SeaWorld. Usar trolley MTS para llegar — el estacionamiento es imposible con 20,000 corredores.",
        tags: [
          { class: 'tag-must', label: 'Must do' },
          { class: 'tag-race', label: '6:15 AM start' },
          { class: 'tag-tip', label: 'Kit listo noche anterior' }
        ],
        lat: 32.7424, lng: -117.1614, zoom: 16
      }
    ]
  },
  {
    id: 'food',
    title: 'Restaurantes',
    icon: '🍽️',
    iconClass: 'icon-food',
    cardClass: 'card-food',
    markerColor: '#C9962A',
    items: [
      {
        id: 'morning-glory',
        name: 'Morning Glory',
        recommended: true,
        desc: 'Desayuno icónico de San Diego — ir temprano, hace fila. Conocido por sus huevos benedict creativos y ambiente animado. Uno de los brunch spots más populares de Little Italy.',
        tags: [
          { class: 'tag-morning', label: 'Desayuno' },
          { class: 'tag-tip', label: 'Ir temprano · hace fila' }
        ],
        lat: 32.7250, lng: -117.1685, zoom: 16
      },
      {
        id: 'animae',
        name: 'Animae',
        recommended: true,
        desc: 'Cena oriental fusión — uno de los restaurantes más recomendados de SD para una noche especial. Ambiente elegante, coctelería buena. Reservación con anticipación.',
        tags: [
          { class: 'tag-night', label: 'Cena' },
          { class: 'tag-tip', label: 'Reservar con anticipación' },
          { class: 'tag-food', label: 'Fusión asiática' }
        ],
        lat: 32.7196, lng: -117.1735, zoom: 16
      },
      {
        id: 'born-and-raised',
        name: 'Born and Raised',
        recommended: true,
        desc: 'Steakhouse de lujo en Little Italy. Carnes de primera, drinks excelentes. Ambiente sofisticado — buena opción para una noche de celebración con el grupo completo.',
        tags: [
          { class: 'tag-night', label: 'Cena' },
          { class: 'tag-food', label: 'Carnes · Drinks' },
          { class: 'tag-tip', label: 'Reservar' }
        ],
        lat: 32.7286, lng: -117.1701, zoom: 16
      },
      {
        id: 'neighborhood',
        name: 'Neighborhood',
        recommended: true,
        desc: 'Pub casual en Downtown con un speakeasy escondido adentro. Ambiente relajado, buena cerveza artesanal. El speakeasy es uno de esos spots que hay que encontrar — bueno para la noche con el grupo.',
        tags: [
          { class: 'tag-night', label: 'Noche' },
          { class: 'tag-food', label: 'Pub · Speakeasy' },
          { class: 'tag-group', label: 'Grupo completo' }
        ],
        lat: 32.7110, lng: -117.1583, zoom: 16
      },
      {
        id: 'hodads',
        name: "Hodad's",
        desc: 'Ícono de SD desde 1969. Hamburguesas legendarias en Ocean Beach. El local original es el de OB. Llegar antes de las 8 PM — cierra temprano y puede haber fila.',
        tags: [
          { class: 'tag-food', label: 'Burgers' },
          { class: 'tag-tip', label: 'Antes de las 8 PM' },
          { class: 'tag-group', label: 'Casual · Grupo' }
        ],
        lat: 32.7494, lng: -117.2497, zoom: 16
      },
      {
        id: 'rosemary',
        name: 'Rosemary',
        desc: 'Restaurante de hamburguesas recomendado por el grupo. Buena opción para la primera noche del viaje — sin complicar la logística del día de llegada.',
        tags: [
          { class: 'tag-food', label: 'Burgers' },
          { class: 'tag-morning', label: 'Noche llegada' }
        ],
        lat: 32.7466, lng: -117.1670, zoom: 16
      }
    ]
  },
  {
    id: 'activity',
    title: 'Qué hacer',
    icon: '🗺️',
    iconClass: 'icon-activity',
    cardClass: 'card-place',
    markerColor: '#3D5A80',
    items: [
      {
        id: 'sd-zoo',
        name: 'San Diego Zoo',
        desc: 'Uno de los mejores zoológicos del mundo. Llegar a las 9 AM para el fresco y evitar filas. Tiene Sky Tram y Guided Bus Tour — si las piernas están destruidas post-carrera (Lun Jun 1), úsenlos sin culpa.',
        tags: [
          { class: 'tag-must', label: 'Must do' },
          { class: 'tag-tip', label: 'Llegar a las 9 AM' },
          { class: 'tag-tip', label: 'Tickets online' }
        ],
        bookingUrl: 'https://tickets.sandiegozoo.org/webstore/shop/ViewItems.aspx?CG=webstoresdz&C=sdztp',
        lat: 32.7360, lng: -117.1490, zoom: 15
      },
      {
        id: 'balboa-park',
        name: 'Balboa Park',
        desc: 'El parque más icónico de SD — arquitectura española, jardines, museos. El Zoo está adentro. Sáb 30 sirve para conocer el área del inicio de la carrera. El Japanese Friendship Garden también está aquí.',
        tags: [
          { class: 'tag-outdoor', label: 'Outdoor' },
          { class: 'tag-group', label: 'Papás friendly' }
        ],
        lat: 32.7341, lng: -117.1443, zoom: 15
      },
      {
        id: 'japanese-garden',
        name: 'Japanese Friendship Garden — Balboa Park',
        recommended: true,
        desc: 'Jardín japonés tradicional dentro de Balboa Park. Tranquilo, fotogénico, diferente al resto del parque. Buen complemento del día del Zoo o la caminata por Balboa.',
        tags: [
          { class: 'tag-outdoor', label: 'Jardín' },
          { class: 'tag-group', label: 'Tranquilo' }
        ],
        bookingUrl: 'https://www.niwa.org/visit',
        lat: 32.7300, lng: -117.1494, zoom: 17
      },
      {
        id: 'uss-midway',
        name: 'USS Midway Museum',
        desc: 'Portaaviones convertido en museo en el Embarcadero. Aviones de combate en cubierta, historia naval, experiencia inmersiva. No es físico — ideal para el día pre-carrera. Calculen 2–3 horas.',
        tags: [
          { class: 'tag-group', label: 'Papás friendly' },
          { class: 'tag-tip', label: 'Sáb 30 pre-carrera' }
        ],
        bookingUrl: 'https://www.midway.org/visit/buy-tickets/',
        lat: 32.7138, lng: -117.1751, zoom: 16
      },
      {
        id: 'sunset-cliffs',
        name: 'Sunset Cliffs',
        recommended: true,
        desc: 'Los acantilados más fotogénicos de SD — al suroeste, sobre el Pacífico. Llevar toallas o algo para sentarse, comida tipo picnic y llegar una hora antes del sunset. No hay infraestructura (ni baños ni food trucks), vengan preparados.',
        tags: [
          { class: 'tag-outdoor', label: 'Outdoor' },
          { class: 'tag-tip', label: '1h antes del sunset' },
          { class: 'tag-tip', label: 'Llevar picnic' },
          { class: 'tag-must', label: 'Vista épica' }
        ],
        lat: 32.7236, lng: -117.2546, zoom: 15
      },
      {
        id: 'la-jolla',
        name: 'La Jolla — día completo en el pueblito',
        recommended: true,
        desc: "Pasar el día entero en La Jolla Village + Cove: las focas en Children's Pool, los acantilados turquesa, el malecón, tiendas y cafés del village. Es de los spots más bonitos de todo California.",
        tags: [
          { class: 'tag-must', label: 'Must do' },
          { class: 'tag-outdoor', label: 'Día completo' },
          { class: 'tag-group', label: 'Todo el grupo' }
        ],
        lat: 32.8503, lng: -117.2731, zoom: 14
      },
      {
        id: 'bikes-boardwalk',
        name: 'Rentar bicis en el boardwalk',
        desc: 'El boardwalk de Mission Beach / Pacific Beach corre varios kilómetros junto al mar — plano, fácil, espectacular. Se renta por hora. Uno de los mejores paseos del viaje para el grupo atlético.',
        tags: [
          { class: 'tag-outdoor', label: 'Outdoor' },
          { class: 'tag-group', label: 'Grupo atlético' }
        ],
        lat: 32.7700, lng: -117.2530, zoom: 14
      },
      {
        id: 'seaworld',
        name: 'SeaWorld San Diego',
        desc: 'Shows acuáticos, atracciones, exhibiciones de vida marina. Calculen 3–4 horas mínimo. Queda en Mission Bay — perfecto para combinarlo con Belmont Park y el boardwalk en el mismo día.',
        tags: [
          { class: 'tag-group', label: 'Grupo completo' },
          { class: 'tag-tip', label: 'Abren 10 AM' },
          { class: 'tag-tip', label: 'City Pass' }
        ],
        bookingUrl: 'https://seaworld.com/san-diego/tickets/',
        lat: 32.7647, lng: -117.2266, zoom: 15
      },
      {
        id: 'belmont-park',
        name: 'Belmont Park',
        desc: 'Parque de atracciones en Mission Beach a 5 min de SeaWorld. La Giant Dipper es una montaña rusa de madera de 1925, clásico histórico de SD. Combinarlo con el boardwalk y Hodad\'s en el mismo día.',
        tags: [
          { class: 'tag-group', label: 'Grupo completo' },
          { class: 'tag-outdoor', label: 'Mission Beach' }
        ],
        bookingUrl: 'https://www.belmontpark.com/tickets-reservation',
        lat: 32.7708, lng: -117.2530, zoom: 16
      },
      {
        id: 'old-town',
        name: 'Old Town San Diego',
        desc: 'El barrio histórico mexicano de SD. Casa Guadalajara o El Agave para cenar. Mariachi, ambiente familiar. Buena opción para el grupo completo después del Zoo.',
        tags: [
          { class: 'tag-food', label: 'Comida mexicana' },
          { class: 'tag-group', label: 'Papás friendly' },
          { class: 'tag-night', label: 'Noche' }
        ],
        lat: 32.7556, lng: -117.1969, zoom: 15
      }
    ]
  }
];
