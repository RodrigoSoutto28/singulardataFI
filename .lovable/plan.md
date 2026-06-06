Cambiar el tiempo de reflexión de la alerta psicológica de 60s a 20s.

Archivo único: `src/features/behavioral/components/TaxometerAlert.tsx`
- Línea 22: `useState(60)` → `useState(20)`
- Línea 30: `setCountdown(60)` → `setCountdown(20)`
- Línea 37: `((60 - countdown) / 60) * 100` → `((20 - countdown) / 20) * 100`

Sin otros cambios.