# CAR ME
**Fundamentos de la Web**  
**2º - Grado en Ingeniería del Software**  
**Proyecto 2026 – 2027**

## Development Team
| Nombre                           | Email                                          | Github Username                         |
|----------------------------------|------------------------------------------------|-----------------------------------------|
| **Raúl Martín Sánchez**          | [r.martinsa.2024@alumnos.urjc.es](mailto:r.martinsa.2024@alumnos.urjc.es) | [@raulmrtnsa](https://github.com/raulmrtnsa) |
| **Rodrigo Blazquez Barbacid** | [s.cherkhavskyy.2024@alumnos.urjc.es](mailto:s.cherkhavskyy.2024@alumnos.urjc.es) | [@stann15](https://github.com/stann15)   |
| **Daniel Villalón Muñoz**        | [d.villalon.2024@alumnos.urjc.es](mailto:d.villalon.2024@alumnos.urjc.es)   | [@DanielVM6](https://github.com/DanielVM6) |
| **Raul Garcia Piedra**        | [r.garciapi.2024@alumnos.urjc.es](mailto:r.garciapi.2024@alumnos.urjc.es)   | [@Raulgrp7](https://github.com/Raulgrp7) |


## Features 

### Entities
  
#### Main entity: Conductor (Driver)
Nuestra idea es tener una página donde los conductores se dan de alta mostrando su información pública. Esta será la entidad principal que se mostrará en formato Grid en la página de inicio. Al seleccionar un conductor, podremos ver sus detalles específicos y el listado de viajes que tiene programados o completados.

**Attributes:**
- **ID** (Identificador único)
- **Nombre y Apellidos** (Name)
- **Vehículo** (Vehicle - Marca y modelo)
- **Puntuación** (Rating - ej. 4.5/5 estrellas)
- **Años de experiencia** (Experience)
- **Imagen de perfil** (Profile Picture)
  
#### Secondary entity: Viaje (Trip)
Los viajes son las rutas o trayectos asociados a cada conductor. En la página de detalle de un conductor, se mostrará un listado con los viajes que este ofrece.

**Attributes:**
- **Origen** (Start Location)
- **Destino** (End Location)
- **Fecha y Hora** (Date & Time)
- **Precio** (Price)
- **Plazas disponibles** (Available seats)
  
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

#esto es de ejemplo

➡ **Raúl Martín Sánchez**
- Mi principal aportación ha sido la maquetación de la **página principal (main)**. He utilizado el Grid de Bootstrap para mostrar los 9 conductores de ejemplo, configurando las columnas para que sean responsive (1 columna en móviles, 2 en tablets/pantallas pequeñas y 3 en monitores grandes). Además, he diseñado el **pie de página (footer)** común y he colaborado en armonizar los archivos CSS para que todas las páginas mantengan la misma identidad visual.
- **Commits**:
  - [Creación del HTML de la página principal](https://github.com/tu-repo/commit/ejemplo1)
  - [Implementación del Grid responsive 1-2-3 columnas](https://github.com/tu-repo/commit/ejemplo2)
  - [Creación del footer compartido y su CSS](https://github.com/tu-repo/commit/ejemplo3)
  - [Inserción de los 9 elementos (conductores) de ejemplo](https://github.com/tu-repo/commit/ejemplo4)
  - [Botón 'Crear nuevo elemento' alineado y enlazado](https://github.com/tu-repo/commit/ejemplo5)
- **Ficheros en los que más he participado:**
  - `main.html`
  - `style_main.css`
  - `footer.css`
  - `estilos_globales.css`
  - `nuevo_conductor.html`
