NOMBRE DEL PROYECTO: FootballHub

INTEGRANTES: Florencia Sirotinsky, Camila Zielonka y Victoria Tandeter

API UTILIZADA:

API de ESPN Sports
- Link: https://publicapis.io/espn-sports-api
- Es una API pública, no oficial, y gratuita. Tiene restricciones no especificadas respecto de la cantidad de request por día, por lo que si se usa por mucho tiempo el proyecto deja de traer la información en un punto.

DESCRIPCIÓN DE LA APP:

FootballHub es una plataforma que te permite consultar información de partidos de fútbol en tiempo real y resultados de diferentes competiciones.

El usuario puede consultar los partidos disponibles y acceder al detalle de cada uno y visualizar información como el rsultado, estado del partido, eventos, alineaciones y tabla de posiciones.

ORGANIZACIÓN DE LOS COMPONENTES:

El proyecto está organizado en componentes reutilizables, divididos en carpetas por paginas y con una carpeta exclusiva para los archivos de estilos. Además, tiene una carpeta services en la que se encuentran el archivo con las llamadas a la api (utilizando axios), el storage, etc.

Estructura:

src/
│
├── components/
│   ├── Home/
│   │   ├── MatchList
│   │   └── HomePage
│   │   └── MatchCard
│   │   └── SearchBar
│   │   └── StatusBadge
│   │   └── WeekMatches
│   │
│   ├── MatchDetail/
│   │   ├── MatchDetail
│   │   ├── ScoreHeader
│   │   ├── EventsTab
│   │   ├── EventContent
│   │   ├── LineUpsTab
│   │   └── StandingsTab
│   │
│   ├── Favorites/
│   │   └── FavoritesPage
│   │
│   ├── Header
│   ├── Footer
│   │
│   └── estilos/
│       └── archivos de estilos
│   
├── services/
│   ├── api.js
│   └── storage.js
│   └── events.js
│
└── App.css
└── App.jsx

FUNCIONALIDADES IMPLEMENTADAS:

Partidos
- Consulta de partidos mediante la API de ESPN.
- Visualización de partidos por competición.
- Visualización de resultados.
- Identificación de partidos en vivo.
- Estado del partido: programado, en vivo o finalizado.
- Información de fecha y estadio.
- Detalle del partido

Cada partido cuenta con una pantalla de detalle con diferentes pestañas:
- Eventos (un resumen de eventos que ocurrieron durante un partido)
- Alineaciones (con posición y número de camiseta de cada jugador)
- Posiciones (la posición en la tabla de la competición actual de ambos equipos)

Favoritos:
- Agregar un equipo a favoritos (desde la página del detalle del partido)
- Ver los equipos favoritos.
- Quitar un equipo de favoritos