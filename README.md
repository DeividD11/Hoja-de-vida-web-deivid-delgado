# Hoja de vida web profesional

**Hoja de vida web profesional** es una aplicación frontend estática, moderna y lista para desplegar, desarrollada con **HTML, CSS y JavaScript puro**. El proyecto está organizado con una estructura inspirada en **MVC** para mantener el código limpio, separado por responsabilidades y fácil de mantener.

La experiencia está pensada para presentar el perfil de **Deivid Aldemar Delgado Naranjo** con una interfaz responsive, accesible y optimizada para navegador, impresión y GitHub Pages. No utiliza React, Vue, Angular, jQuery, frameworks CSS ni backend adicional.

## Propósito del proyecto

Este sitio busca convertir un currículum tradicional en una presentación web clara, profesional y fácil de navegar. El resultado prioriza:

- lectura rápida y ordenada;
- navegación por secciones;
- diseño responsive;
- buena accesibilidad base;
- rendimiento alto en equipos modestos;
- exportación limpia para impresión o PDF.

## Tecnologías usadas

- **HTML5** para la estructura semántica.
- **CSS3** para diseño visual, responsive y estados de interfaz.
- **JavaScript (ES Modules)** para lógica, renderizado y navegación.
- **SVG** para favicon ligero y escalable.
- **GitHub Pages** como destino de publicación.

## Qué incluye la aplicación

- Si el navegador interno bloquea la impresión, el botón abre una vista exportable o descarga un HTML listo para imprimir.

- encabezado principal con resumen profesional;
- navegación por secciones con URLs limpias;
- título de página dinámico según la sección visible;
- favicon animado de forma sutil;
- tarjetas informativas con datos resumidos;
- secciones de perfil, datos personales, formación, cursos, experiencia, habilidades, referencias y contacto;
- botón de impresión / exportación con respaldo para navegadores internos como Facebook en celular;
- botón de retorno al inicio;
- preparación específica para impresión sin animaciones pesadas;
- diseño adaptable a móvil, tablet y escritorio.

## Arquitectura MVC

Aunque es un proyecto frontend puro, la estructura sigue la lógica de MVC para organizar mejor el código.

### Model
Archivo: `js/models/cvData.js`

Centraliza los datos del currículo:

- identidad principal;
- resumen profesional;
- perfil;
- datos personales;
- formación académica;
- cursos y seminarios;
- experiencia;
- habilidades;
- referencias;
- contacto.

Separar los datos en un solo archivo facilita cambiar el contenido sin tocar la lógica de presentación.

### View
Archivo: `js/views/render.js`

Se encarga de construir la interfaz en el DOM:

- tarjetas de resumen;
- secciones de contenido;
- listas y líneas de tiempo;
- componentes reutilizables;
- bloques visuales para cada apartado del CV.

Esta capa transforma los datos en elementos presentables, sin mezclar lógica de negocio.

### Controller
Archivo: `js/controllers/app.js`

Orquesta el comportamiento general:

- carga inicial;
- renderizado de secciones;
- navegación interna;
- sincronización de rutas;
- actualización del `title` y del favicon;
- manejo del historial del navegador;
- impresión;
- control de animaciones;
- adaptación a dispositivos con menos recursos.

## Navegación y rutas

El proyecto utiliza rutas más limpias para cada sección. Al moverse por la página, la URL cambia a nombres descriptivos como:

- `perfil-profesional`
- `datos-personales`
- `formacion-academica`
- `cursos-y-certificaciones`
- `experiencia-laboral`
- `habilidades`
- `referencias`
- `contacto`

Además, la aplicación actualiza el título del navegador según la sección visible, lo que mejora la orientación del usuario y da una sensación de producto más cuidado.

### GitHub Pages

El proyecto incluye soporte para navegación directa en GitHub Pages mediante archivo `404.html`, lo que ayuda a recuperar rutas al abrir una sección específica desde el navegador.

## Diseño y experiencia de usuario

La interfaz fue pensada para verse profesional sin exceso decorativo.

### Principios visuales aplicados

- jerarquía clara entre títulos, contenido y acciones;
- tipografía legible;
- espaciado consistente;
- contraste alto;
- tarjetas limpias y ordenadas;
- elementos visuales discretos pero útiles;
- comportamiento responsive para diferentes tamaños de pantalla.

### Estados de interacción

La interfaz contempla:

- carga;
- foco por teclado;
- navegación activa;
- retroalimentación visual al imprimir;
- animaciones suaves y controladas.

## Rendimiento

El proyecto está optimizado para no castigar dispositivos lentos.

Se aplicaron decisiones concretas para mantener fluidez:

- se evitaron librerías externas;
- se redujo la complejidad visual innecesaria;
- se limitaron efectos costosos como blur y filtros pesados;
- se ajustaron animaciones para dispositivos con menos recursos;
- se desactivan animaciones cuando el usuario prefiere reducir movimiento;
- se pausa la animación del título y del favicon cuando la pestaña no está activa.

## Impresión y exportación a PDF

El sitio está preparado para una salida limpia al imprimir desde el navegador.

Durante impresión se busca:

- una composición plana;
- legibilidad alta;
- ausencia de animaciones;
- menor peso visual;
- menor probabilidad de bloqueos o retrasos.

Esto hace que el resultado exportado sea más consistente y rápido de generar.

## Accesibilidad

Se incorporaron bases de accesibilidad para mejorar la experiencia de uso:

- etiquetas semánticas correctas;
- estructura HTML ordenada;
- enlace de salto al contenido principal;
- foco visible en controles interactivos;
- navegación cómoda con teclado;
- textos claros y comprensibles;
- uso de elementos semánticos en lugar de solo `div`.

## Personalización del contenido

Si se desea cambiar la información del CV, los archivos más importantes son:

- `js/models/cvData.js` para modificar datos y textos;
- `css/styles.css` para ajustar colores, tamaños y espaciado;
- `js/views/render.js` para variar la estructura visual;
- `js/controllers/app.js` para cambiar comportamiento, rutas o animaciones.

## Cómo ejecutar el proyecto

### Opción recomendada: servidor local
Como el proyecto usa módulos ES y rutas internas, conviene ejecutarlo con un servidor local.

Ejemplo con Python:

```bash
cd CV2
python -m http.server 8000
```

Luego abre:

```text
http://localhost:8000
```

### Opción de prueba rápida
También puede abrirse `index.html` directamente en el navegador, aunque la experiencia de rutas es más confiable con servidor local o GitHub Pages.

## Despliegue en GitHub Pages

1. Sube el contenido del proyecto al repositorio.
2. Verifica que la carpeta raíz contenga `index.html`.
3. Activa GitHub Pages desde la rama correspondiente.
4. Comprueba que `404.html` esté incluido para soportar rutas directas.
5. Confirma que los assets cargan correctamente desde rutas relativas.

## Estructura del proyecto

```text
CV2/
├─ index.html
├─ 404.html
├─ assets/
│  └─ favicon.svg
├─ css/
│  └─ styles.css
├─ js/
│  ├─ controllers/
│  │  └─ app.js
│  ├─ models/
│  │  └─ cvData.js
│  └─ views/
│     └─ render.js
└─ README.md
```

## Resultado esperado

Al abrir el proyecto se obtiene:

- una hoja de vida web profesional;
- navegación fluida entre secciones;
- contenido bien organizado;
- título dinámico por sección;
- favicon animado;
- experiencia responsive;
- impresión limpia;
- código simple, modular y mantenible.

## Criterio de diseño aplicado

El proyecto prioriza funcionalidad real sobre adorno innecesario. La idea no era “hacerlo ruidoso”, sino hacerlo sólido: claro, rápido, bonito y fácil de sostener en el tiempo.

## Licencia y uso

Este proyecto está pensado como portafolio personal y presentación web de la hoja de vida. Puede adaptarse libremente para fines académicos o de portafolio, manteniendo la autoría y la estructura base.

---

**Proyecto frontend estático · MVC nativo · Sin dependencias externas · Listo para publicar**
