## Auditoría profunda de 5 módulos

Recorrer Journal/Import, Analytics, Behavioral, Onboarding y Settings — leer código, ejecutar en el preview los flujos críticos, corregir bugs y dejar todo internacionalizado y consistente.

## Por módulo

### 1. Journal / Import / Export
- Leer `Journal.tsx`, `useTrades`, `useInfiniteTrades`, `useImportTrades`, `useImportBatches`, `useExportTrades`, `ImportPreviewModal`, `ImportHistorySection`, parsers de broker (MT4/MT5/cTrader/TradingView), `xlsx-adapter`, `error-detection`.
- Verificar: crear/editar/eliminar trade, sync de balance, paginación infinita, dedupe por `import_row_hash`, modal preview obligatorio, undo de import, export HTML/PDF/XLSX con datos reales.
- Strings hardcodeadas → mover a diccionario i18n.
- Probar en preview: importar CSV de muestra (si hay), crear trade manual, exportar.

### 2. Analytics Hub
- Leer `AnalyticsHub`, `Analytics`, `Insights`, `Reports`, `useInsights`, `useAnalytics`.
- Verificar: tabs traducidas, métricas (win rate, profit factor, expectativa, Sharpe, drawdown, equity), estados vacíos, exportación de reportes, AI insights.
- Confirmar cálculos contra fórmulas del project-knowledge.

### 3. Behavioral / Pre-Market
- Leer `Psychology`, `PreMarketCheckInModal`, `PreMarketGate`, `TaxometerWidget`, `TaxometerDashboard`, `TaxometerAlert`, `usePsychologyEntries`, `usePreMarketCheckIn`, `useTaxometer`, `streak-manager`, `color-psychology`.
- Verificar: gate diario, check-in se guarda, taxometer reacciona a P&L vs riesgo, streaks, alertas, psychology entries CRUD.
- i18n completo en alertas y labels.

### 4. Onboarding
- Leer `OnboardingWizard`, `WelcomeScreen`, `WelcomeModal`, `AccountSetupStep`, `FirstCheckInStep`, `TourStep`, `OnboardingTour`, `useOnboarding`.
- Verificar: secuencia welcome → account → tour, persistencia de paso, skip, primera cuenta creada correctamente, tour highlights navegan a las secciones reales.
- i18n completo (sin "Bienvenido" hardcoded).

### 5. Settings / Profile
- Leer `Settings.tsx`, `Profile.tsx`, `AvatarUploader`, `LanguageSelector`, edge function `delete-account`.
- Verificar: cambio de idioma persiste en `profiles.preferred_language`, tema dark/light, avatar upload a bucket `avatars`, export de datos JSON, eliminar cuenta (confirma + llama edge function + signOut), validaciones.

## Estrategia de ejecución

1. **Lectura paralela** de los archivos clave de cada módulo (batch grande).
2. **Lista priorizada de bugs** detectados (críticos / medios / cosméticos).
3. **Fixes en parallel writes** por módulo, agrupando por archivo.
4. **Verificación visual** en preview de los flujos críticos (crear trade, abrir import modal, abrir check-in, cambiar idioma, abrir onboarding).
5. **Re-scan i18n**: `rg` final para strings ES/EN hardcodeadas en los módulos auditados.
6. **Reporte final** con bugs encontrados, fixes aplicados y acciones pendientes del usuario.

## Fuera de alcance esta pasada

- Activar Stripe / pagos.
- Performance profiling profundo (sólo lazy-load y memo obvios si aparecen).
- Tests automatizados nuevos (sólo correré los existentes si fallan).

## Entregable

Reporte estructurado por módulo con: ✅ verificado, 🔧 corregido, ⚠️ requiere acción del usuario (ej. completar copy legal, configurar OAuth, etc.).
