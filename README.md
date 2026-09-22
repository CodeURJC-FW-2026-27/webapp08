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
