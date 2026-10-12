# CarMe
**Fundamentos de la Web**  
**2º - Grado en Ingeniería del Software**  
**Proyecto 2026 – 2027**

## Development Team
| Nombre                           | Email                                          | Github Username                         |
|----------------------------------|------------------------------------------------|-----------------------------------------|
| **Raúl Martín Sánchez**          | [r.martinsa.2024@alumnos.urjc.es](mailto:r.martinsa.2024@alumnos.urjc.es) | [@raulmrtnsa](https://github.com/raulmrtnsa) |
| **Rodrigo Blazquez Barbacid** | [r.blazquez.2024@alumnos.urjc.es](mailto:r.blazquez.2024@alumnos.urjc.es) | [@RodrigoBlazquez](https://github.com/RodrigoBlazquez)   |
| **Daniel Villalón Muñoz**        | [d.villalon.2024@alumnos.urjc.es](mailto:d.villalon.2024@alumnos.urjc.es)   | [@DanielVM6](https://github.com/DanielVM6) |
| **Raul Garcia Piedra**        | [r.garciapi.2024@alumnos.urjc.es](mailto:r.garciapi.2024@alumnos.urjc.es)   | [@Raulgrp7](https://github.com/Raulgrp7) |


## Features 

### Entities
  
#### Main entity: Driver
Our idea is to have a page where drivers can sign up and display their public information. This will be the main section displayed in a grid format on the home page. When you select a driver, you will be able to view their specific details and the list of trips they have scheduled or completed.

**Attributes:**
- **ID** (ID)
- **Full Name** (name)
- **Autonomous comunity** (com)
- **Vehículo** (vehicle)
- **Puntuación** (rating) (1-5) 
- **Experience** (exp)
- **Availability** (available) (boolean)
- **Available Spots** (spots)
  
#### Secondary entity: Journey
Journeys associated with each driver. On a driver's detail page, a list of the trips they offer will be displayed.

**Attributes:**
- **Origin** (origin)
- **Destination** (dest)
- **Date and time** (date_time)
- **Price** (price)
- **Intercommunity** (inter) (boolean)

### Images
Each entity will have an associated image of the driver and the secondary entity will have an associated image of the city.

### Search bar

It consists of a text box in the header that allows the user to enter a text string. It is used to search for the name of the driver whose information we want to know.

## Documentación Práctica 1

➡ **Imágenes (Capturas de pantalla)**
  - Página Principal (Grid de conductores)
  ![main 1](image-1.png)
  ![main 2](image-2.png)

  - Página de Detalle (Información del conductor y sus viajes)
  ![detail 1](image-3.png)
  ![detail 2](image-4.png)

  - Página de Nuevo Elemento (Formulario de alta de conductor)
  ![new_driver 1](image-5.png)


➡ **Raúl Martín Sánchez**
-Mi contribución principal se centró en el desarrollo frontend del módulo de creación de registros **(newdriver.html)**. Diseñé e implementé la interfaz de usuario para la captura de datos, estructurando los componentes del formulario. Además, asumí un rol clave en la arquitectura de estilos del proyecto, unificando y refactorizando los archivos CSS para garantizar un sistema de diseño escalable y una identidad visual coherente en toda la aplicación
- **Commits**:
  - [Crecion del formulario](https://github.com/CodeURJC-FW-2026-27/webapp08/commit/7248a866844ed6f7f23d245aed284dc079725407)
  - [Cambios en los tipos de input](https://github.com/CodeURJC-FW-2026-27/webapp08/commit/7248a866844ed6f7f23d245aed284dc079725407)
  - [Aportacion de contenido para el estilo](https://github.com/CodeURJC-FW-2026-27/webapp08/commit/41c898c8f43bc2469c9841cbe78a57e05b351aab)
  - [Mas aportaciones de estilo](https://github.com/CodeURJC-FW-2026-27/webapp08/commit/75b5b8321d3e67c863ab825615ce4bbb588350f5)
  - [Creacion de los ficheros html y css y orden en carpetas](https://github.com/CodeURJC-FW-2026-27/webapp08/commit/1321e602601eaa13c07bab5a001c24f0d506056f)
- **Ficheros en los que más he participado:**
  - `nuevo_conductor.html`
  - `style.css`
  - `main.html`
  - `detail.html`

➡ **Rodrigo Blázquez Barbacid**
-Durante esta práctica he sido el responsable de integrar el framework Bootstrap en dos de los tres archivos (main.html y detail.html). He maquetado los elementos estructurales compartidos por los archivos: la cabecera (header), que incluye un menú de navegación y el buscador, y el pie de página (footer). Además, me he encargado de refactorizar el código HTML y CSS del archivo main.html aplicando el Grid System de Bootstrap para estructurar las tarjetas en 1, 2 y 3 columnas según el tamaño de la pantalla.
- **Commits**:
  - [Implementación del Grid System en main](https://github.com/CodeURJC-FW-2026-27/webapp08/commit/7c5d04c81e38bb4f9d52a740bed6e3399fa73322)
  - [Integración de Bootstrap en detail](https://github.com/CodeURJC-FW-2026-27/webapp08/commit/88d639a7a4f621f4a7aee5dbbffff6ffcef5a173)
  - [Añado un buscador al header](https://github.com/CodeURJC-FW-2026-27/webapp08/commit/10a3e78304f6b2502270386051f5946812e68253)
  - [Integración de header y footer en main](https://github.com/CodeURJC-FW-2026-27/webapp08/commit/f819103270ef7988d9337c25895a306c3d7c9a3d)
  - [Integración de header y footer en detail](https://github.com/CodeURJC-FW-2026-27/webapp08/commit/8c776a798bc9bc0602d54446bd0033a9ade9edfa)
- **Ficheros en los que más he participado:**
  - `main.html`
  - `detail.html`
  - `newdriver.html`
  