
# SwiftTS CLI

SwiftTS es una herramienta de línea de comandos que te permite generar y gestionar proyectos de APIs utilizando TypeScript de manera rápida y sencilla.

## Instalación

Para instalar SwiftTS de manera global, usa el siguiente comando:

```bash
npm i -g swiftts
```

## Uso

Después de la instalación, puedes ejecutar `swiftts` desde la línea de comandos. A continuación se describen los comandos básicos:

### Crear un nuevo proyecto

Para generar un nuevo proyecto de API en TypeScript, usa el comando `new`:

```bash
swiftts new
```

Esto creará una estructura de proyecto inicial, configurada con TypeScript y los módulos básicos necesarios para comenzar.

### Agregar módulos o paquetes

Si necesitas agregar un nuevo módulo o paquete a tu proyecto, puedes usar el comando `add`:

```bash
swiftts add <nombre-del-paquete>
```

Este comando instalará el paquete especificado y lo agregará al proyecto.

### Ver la versión de SwiftTS

Puedes consultar la versión actual de SwiftTS instalada con el comando:

```bash
swiftts --version
```

### Obtener ayuda

Para ver una lista de los comandos disponibles y sus descripciones, utiliza:

```bash
swiftts --help
```

O simplemente:

```bash
swiftts help
```

### Eliminar modulos

Si necesitas eliminar un módulo o paquete a tu proyecto, puedes usar el comando `remove`:

```bash
swiftts remove <nombre-del-paquete>
```

### Construir la api

Si deseas construir la api, puedes usar el comando `build`:

```bash
swiftts build
```

### Iniciar la API

Si deseas iniciar la api puedes ejecutar el comando `start`:

```bash
swiftts start
```

### Iniciar los testeaos de la api

Si deseas iniciar los test de la API con jest puedes ejecutar el comando `test`:

```bash
swifts test
```

### Configuracion Vercel

Si deseas publicar la API en vercel con este comando se crea el archivo de configuracion y publica la API ejecutando el comando `vercel`:

```bash
swiftts vercel
```

### Iniciar la API en modo dev

Si deseas iniciar la API en modo desarrollo puedes ejecutar el comando `dev`:

```bash
swiftts dev
```

## Contribuir

Si deseas contribuir a este proyecto, puedes hacerlo creando issues o PRs en el repositorio oficial.

---

¡Disfruta creando tus APIs en TypeScript con SwiftTS!
