# Memoria de Desarrollo — MedGestión

## 1. Problema identificado

Los consultorios odontológicos pequeños gestionan sus turnos y pacientes de forma manual: cuadernos, planillas de Excel o aplicaciones genéricas que no se adaptan al flujo real del consultorio. El problema concreto es la falta de una herramienta centralizada que permita a la secretaria registrar pacientes y turnos, y al odontólogo consultar su agenda y el historial de cada paciente de forma rápida.

El sistema debía ser simple de usar, accesible desde cualquier dispositivo y no requerir una infraestructura compleja para su despliegue en un consultorio pequeño.

---

## 2. Solución desarrollada

**MedGestión** es una aplicación web de gestión para consultorio odontológico con dos perfiles de usuario:

- **Secretaria:** gestión completa de pacientes y turnos (alta, edición, eliminación)
- **Odontólogo:** acceso a toda la información con su nombre y rol identificado en la interfaz

Las funcionalidades centrales son:
- Registro y búsqueda de pacientes con ficha clínica (datos personales, cobertura médica, notas)
- Gestión de turnos con calendario mensual, filtros y cambio de estado
- Panel de resumen diario con estadísticas del mes y gráfico de distribución
- Exportación de turnos mensuales a CSV compatible con Excel

---

## 3. Decisiones técnicas principales

**PocketBase como backend:**  
Se eligió PocketBase porque fue presentado en clase como una opción viable para proyectos pequeños. Ofrece base de datos SQLite embebida, autenticación JWT, API REST y panel de administración, todo en un único ejecutable sin necesidad de configurar un servidor externo. Esto permitió iterar rápido sin preocuparse por la infraestructura.

**React + Vite:**  
Stack frontend estándar para desarrollo ágil. Vite ofrece hot reload instantáneo durante el desarrollo. React permite componentes reutilizables y manejo de estado con hooks.

**Tailwind CSS con paleta Material Design 3:**  
Se optó por Tailwind para velocidad de desarrollo y consistencia visual. La paleta MD3 (azul médico) aporta una identidad profesional sin necesidad de diseñar desde cero.

**Roles por campo en la misma colección:**  
En lugar de crear dos colecciones separadas para los usuarios, se agregó un campo `rol` (select: `odontologo` / `secretaria`) a la colección `users` de PocketBase. Esto simplifica la autenticación y el mantenimiento del sistema.

**Fechas sin conversión UTC:**  
Se detectó un bug crítico donde al guardar turnos se convertía la hora local a UTC, desplazando los horarios. La solución fue guardar la fecha directamente desde el input `datetime-local` sin conversión, evitando el problema.

---

## 4. Uso de inteligencia artificial en el proceso

El desarrollo siguió un proceso iterativo con tres herramientas de IA en distintas etapas:

**Stitch (Google):** Se utilizó para el diseño visual inicial. Permitió generar rápidamente una propuesta de interfaz con la paleta de colores, la estructura de navegación y los componentes base antes de escribir código.

**ChatGPT:** Se usó en la fase exploratoria para decidir qué aplicación construir, evaluar alternativas de stack tecnológico y definir el alcance del proyecto.

**Claude (Anthropic):** Fue la herramienta principal durante todo el desarrollo del código. Se utilizó para:
- Generar y refinar componentes React
- Depurar errores concretos (bugs de timezone, migraciones conflictivas en PocketBase, estructura JSX incorrecta)
- Tomar decisiones de arquitectura (cómo implementar roles, cómo estructurar los filtros de fecha)
- Implementar features completas como el calendario, la exportación CSV y el diseño responsive

El criterio propio del desarrollador estuvo presente en cada etapa: decidir qué construir, validar si el código generado era correcto, detectar cuándo una solución era innecesariamente compleja y orientar el desarrollo hacia las necesidades reales del consultorio. La IA fue una herramienta de aceleración, no de reemplazo del juicio técnico.

---

## 5. Mejoras futuras

- **Multi-profesional:** Actualmente el sistema está pensado para un solo odontólogo. Se podría ampliar para gestionar múltiples profesionales con agendas independientes, lo que haría el sistema útil para clínicas más grandes.

- **Migración a Supabase y despliegue en la nube:** PocketBase es ideal para desarrollo local, pero para un uso real el sistema debería estar desplegado. Supabase ofrece una alternativa compatible (PostgreSQL + API REST) con hosting incluido, lo que permitiría acceder al sistema desde cualquier lugar sin depender de un servidor local.

- **Estadísticas anuales y por profesional:** El panel actual muestra datos del mes en curso. Sería valioso agregar una vista histórica anual con comparativas, promedio de turnos por semana y tasas de cancelación a lo largo del tiempo.

- **Recordatorios automáticos:** Envío de recordatorios de turno por WhatsApp o email al paciente el día anterior, lo que reduciría el ausentismo.

