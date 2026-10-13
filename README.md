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
- **Vehicle** (vehicle)
- **Rating** (rating) (1-5) 
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


➡ **Raúl García Piedra**
-En esta práctica he sido el responsable de la página principal, mostrando las imágenes de todos los conductores, poniendo los títulos y textos de la página, añadiendo las redirecciones a las diferentes páginas, implementar el botón de nuevo elemento además de incluir los iconos y edición en css de todas las clases utilizadas en esta página. También he implementado inicialmente el grid de bootstrap para colocar los elementos correctamente.
- **Commits**:
  - [Imagenes de conductores](https://github.com/CodeURJC-FW-2026-27/webapp08/commit/edb5a8bc5a08a68639607b5cda3097891b30b629)
  - [Continuacion de cada conductor](https://github.com/CodeURJC-FW-2026-27/webapp08/commit/f3ce89f90495d551747276aa2cadaeedf7e7221c)
  - [Correcion tamaños imagenes](https://github.com/CodeURJC-FW-2026-27/webapp08/commit/726bd55e4c4b58b1ae305f0a30403d72386811fa)
  - [Redirecciones y adaptacion bootstrap](https://github.com/CodeURJC-FW-2026-27/webapp08/commit/43d04001664e625e6af1c35be69b1b67006f0f1d)
  - [Informacion conductores](https://github.com/CodeURJC-FW-2026-27/webapp08/commit/098c3e4fbe6985a220f7696d4d2f31bfa2290bef)
- **Ficheros en los que más he participado:**
  - `main.html`
  - `style.css`

➡ **Daniel Villalón Muñoz**
-For this project, I was responsible for designing and developing the responsive web interface for the "CarMe" driver information system. My work included structuring the main driver profile section to clearly display key user details and creating a dynamic gallery to showcase scheduled trips. Additionally, I designed specific visual indicators to differentiate between local and intercommunity routes, and built a standardized form that allows users to easily register new trips on the platform.
- **Commits**:
  - [Start of deatil page](https://github.com/CodeURJC-FW-2026-27/webapp08/commit/cec3ae92086c3379c4d5941edde041f29cf500d2)
  - [Tripsarea created using Format](https://github.com/CodeURJC-FW-2026-27/webapp08/commit/9b311aa2d7f0712092554ceb7188a3e188f598a4)
  - [bootstrap responsive](https://github.com/CodeURJC-FW-2026-27/webapp08/commit/e92495f7ccfe3795e7a998310dd00424fc7af022)
  - [form on detail page](https://github.com/CodeURJC-FW-2026-27/webapp08/commit/59e53cc2ea35e7012eede31b3406dc5e1cb1eb28)
  - [driver info](https://github.com/CodeURJC-FW-2026-27/webapp08/commit/d3d4d469bb6b20c5e7f8571ae8427e26da028ce3)
- **Files I have worked on:**
  - [1. detail.html](https://github.com/CodeURJC-FW-2026-27/webapp08/blob/main/views/detail.html)
  - [2. style.css](https://github.com/CodeURJC-FW-2026-27/webapp08/blob/main/public/style.css)
  - [3. newdriver.html](https://github.com/CodeURJC-FW-2026-27/webapp08/blob/main/views/newdriver.html)
  - [4. main.html](https://github.com/CodeURJC-FW-2026-27/webapp08/blob/main/views/main.html)
  
