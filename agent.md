# Weather Flow - Mobile APK Project Rules

## Stack Tecnológico
- **Framework:** React Native con Expo (para agilizar el despliegue del APK).
- **Lenguaje:** TypeScript (tipado estricto).
- **Estilos:** Tailwind CSS (NativeWind) para una UI moderna y minimalista.
- **Iconografía:** Lucide React Native.
- **Estado:** React Query (TanStack Query) para gestión de caché del clima.

## Reglas de Arquitectura
- Sigue la metodología **Spec-First**: No se genera código sin una especificación aprobada [12, 13].
- **Estructura:** Modular por capas (services, components, hooks, widgets).
- **Geolocalización:** Uso de `expo-location` para actualizaciones en tiempo real.
- **Widget:** Implementación mediante `expo-widgets` o módulos nativos puente.

## Preferencias de Código
- Componentes funcionales y Hooks personalizados.
- Manejo de errores global para fallos de red o permisos de GPS.
- Persistencia de la última ciudad consultada en `AsyncStorage`.
2. Prompt para OpenCode (Fase de Especificación)
Utiliza este prompt estructurado bajo los ejes de Rol, Contexto, Tarea y Restricciones para que el agente genere el documento técnico en lugar de código prematuro
.