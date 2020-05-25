# entregarPortal
Herramienta hecha usando shell y electron para preparar los archivos de subida al SAO.

Se deben configurar 3 paths en la pestaña de Configuración->Carpetas de entrega para que el script funcione correctamente.
Para asegurar la consistencia de la forma en que se configura, se recomienda usar el bash para navegar hasta la carpeta y
utilizar el comando `pwd`, copiar lo que devuelve en el texto de configuración.

* Path de directorio de entrega: Es la carpeta donde se van a guardar los .zip compilados que se descargan de Gitlab
al ejecutar el pipeline de QA, ej: /d/dmartinez/InfoSaos.

  Actualmente se soporta la siguiente estructura de carpetas, solo se debe definir `path/to/file/`, pero se debe asegurar
  que exista la carpeta de entrega y los archivos .zip con los artefactos compilados:
  ```
  path/to/file/
  ├── # de sao/
  ├── 452879/
  ├── 478556/
  ├── 502145/
  │   ├── entrega/
  │       ├── artifacts.zip
  │       └── artifacts(2).zip
  └── 502145/
      └── entrega/
  ```
* Path de directorio de entregas del SAO: Carpeta definida para las entregas del SAO.

* Path de código fuente de proyectos: Es la carpeta se encuentran los proyectos. El script utiliza esta ruta para 
para navegar a los proyectos de eportal y broadbandsale, y realizar un `git pull` de la rama `master`.

  ```
  path/to/projects/
  ├── eportal/
  ├── broadbandsale/
  ```
