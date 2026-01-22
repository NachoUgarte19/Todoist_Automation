Todoist Automation Suite - Playwright & TypeScript

Este proyecto consiste en una suite de pruebas automatizadas para la plataforma Todoist, desarrollada con Playwright y TypeScript. El objetivo es validar los flujos críticos (Smoke & Regression tests) de la aplicación, aplicando las mejores prácticas de la industria QA.

Tecnologías Utilizadas

Framework: Playwright

Lenguaje: TypeScript

Patrón de Diseño: Page Object Model (POM)

Reportes: Playwright HTML Reporter

Arquitectura del Proyecto
El proyecto utiliza el patrón Page Object Model (POM) para mejorar la mantenibilidad y reutilización del código.

tests/: Contiene los 11 scripts de prueba.

pages/: Contiene las clases (Page Objects) que encapsulan la lógica de la interfaz y los selectores.

auth.setup.ts: Maneja la autenticación para evitar el login repetitivo en cada test.

Cobertura de Pruebas (11 Test Cases)
La suite cubre los siguientes escenarios clave:

Gestión de Tareas: Creación (título, descripción, prioridad y fechas dinámicas), edición, completado y eliminación.

Organización: Creación de proyectos y movimiento de tareas entre proyectos.

Filtros y Vistas: Validación de filtros por prioridad y restablecimiento de estados de vista.

Validaciones de Negocio: Validación de campos obligatorios y descarte de creación de tareas.


Desafíos Técnicos Resueltos
Manejo de Asincronía: Implementación de esperas dinámicas basadas en el estado de la URL y visibilidad de elementos para manejar la navegación en una SPA (Single Page Application).

Limpieza de Datos (Teardown): Creación de un hook afterEach robusto que utiliza rastreo por arrays (taskNames[]) para eliminar automáticamente la basura generada después de cada test exitoso.

Datos Dinámicos: Uso de Date.now() para nombres de tareas y RegExp dinámicas para asserts flexibles, evitando colisiones de datos.

Sincronización de UI: Resolución de conflictos de superposición de elementos (modales/pop-overs) mediante comandos de teclado y esperas de estado de red.


Instalación y Uso

Clonar el repositorio:

git clone [https://github.com/tu-usuario/todoist-automation.git](https://github.com/NachoUgarte19/Todoist_Automation)

Instalar dependencias:

npm install

Ejecutar las pruebas:

npx playwright test

Ver reportes:

npx playwright show-report

Sobre mí
Soy estudiante de Licenciatura en Gestión de Tecnología de la Información (UADE) y entusiasta del QA Automation. Este proyecto forma parte de mi especialización en pruebas E2E, aplicando conocimientos adquiridos en cursos de testing avanzado.
