export type Language = 'ES' | 'EN' | 'PT';

export interface Translations {
  // Common
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    view: string;
    add: string;
    search: string;
    filter: string;
    loading: string;
    noResults: string;
    pending: string;
    completed: string;
    inProgress: string;
    all: string;
    new: string;
    dismiss: string;
    enable: string;
    change: string;
    export: string;
    upgrade: string;
    currentPlan: string;
    mostPopular: string;
    excellent: string;
    good: string;
    improvable: string;
  };

  // Navigation
  nav: {
    dashboard: string;
    journal: string;
    analytics: string;
    psychology: string;
    insights: string;
    settings: string;
    logout: string;
    reports: string;
  };

  // TopBar
  topbar: {
    title: string;
    myAccount: string;
    profile: string;
    billing: string;
    settings: string;
    signOut: string;
    defaultTraderName: string;
    accountsCenter: string;
  };

  // Auth
  auth: {
    welcome: string;
    subtitle: string;
    signIn: string;
    signUp: string;
    email: string;
    password: string;
    fullName: string;
    signingIn: string;
    creatingAccount: string;
    createAccount: string;
    termsNotice: string;
    errorSignIn: string;
    errorSignUp: string;
    welcomeBack: string;
    accountCreated: string;
    welcomeToApp: string;
    headline: string;
    headlineHighlight: string;
    subheadline: string;
    features: {
      analytics: string;
      analyticsDesc: string;
      ai: string;
      aiDesc: string;
      equity: string;
      equityDesc: string;
      psychology: string;
      psychologyDesc: string;
    };
    stats: {
      activeTraders: string;
      analyzedTrades: string;
      satisfaction: string;
    };
  };

  // Dashboard
  dashboard: {
    mentalState: string;
    goodMorning: string;
    goodAfternoon: string;
    goodEvening: string;
    recentActivity: string;
    completeCheckIn: string;
    completeCheckInCTA: string;
    planActive: string;
    mentalStateTitle: string;
    disciplineTopTier: string;
    disciplineImprovement: string;
    viewFullAnalysis: string;
    recentTradesTitle: string;
    recentTradesSubtitle: string;
    viewAll: string;
    quickActionNewTrade: string;
    quickActionJournal: string;
    quickActionCheckIn: string;
    quickActionAnalytics: string;
    insightOfDay: string;
    tiltAlert: string;
    tiltDescription: string;
    tiltAdvice: string;
    ritualCompleted: string;
    comeBackTomorrow: string;
    dailyStreak: string;
    weeklySummary: string;
    bestDay: string;
    noTrades: string;
    patienceMessage: string;
    capitalRisk: string;
    accountBalance: string;
    operativePerformance: string;
    totalTrades: string;
    closed: string;
    equityCurve: string;
    preMarketProtocol: string;
    newProtocolItem: string;
    emptyList: string;
    aiFree: string;
    // Account setup
    editBalance: string;
    accountSetup: string;
    initialBalance: string;
    currentBalance: string;
    accountName: string;
    broker: string;
    saveAccount: string;
    createAccount: string;
    noAccountYet: string;
    clickToSetup: string;
    portfolioValue: string;
    discipline: string;
  };

  // Discipline Metrics
  disciplineMetrics: {
    streak3Days: string;
    streak3DaysDesc: string;
    weeklyTarget: string;
    analyticalMindset: string;
    operationalConsistency: string;
    operationalConsistencyDesc: string;
  };

  // Journal
  journal: {
    title: string;
    subtitle: string;
    addTrade: string;
    addNewTrade: string;
    logNewTrade: string;
    totalTrades: string;
    winRate: string;
    totalPnl: string;
    searchSymbol: string;
    filterStatus: string;
    allTrades: string;
    open: string;
    symbol: string;
    direction: string;
    selectDirection: string;
    long: string;
    short: string;
    entryPrice: string;
    exitPrice: string;
    quantity: string;
    stopLoss: string;
    stopSize?: string;
    stopSizeHint?: string;
    resultSection?: string;
    pnlManual?: string;
    pnlPercentManual?: string;
    pnlHint?: string;
    pnlRequired?: string;
    attachImage?: string;
    attachImageHint?: string;
    removeImage?: string;
    imageUploadFailed?: string;
    risk?: string;
    takeProfit: string;
    strategy: string;
    entryDate: string;
    notes: string;
    addNotesPlaceholder: string;
    noTradesFound: string;
    addFirstTrade: string;
    viewDetails: string;
    editTrade: string;
    addScreenshot: string;
    entry: string;
    exit: string;
    export: string;
    exportSuccess: string;
    exportError: string;
    import: string;
    importFile: string;
    importSuccess: string;
    importError: string;
    tradesImported: string;
    selectFile: string;
    supportedFormats: string;
    optional: string;
    closedStatus: string;
    openStatus: string;
    tradeStatus: string;
    openDateTime: string;
    closeDateTime: string;
    commission: string;
    pnlEstimated: string;
    openPositions: string;
    importEmptyHint: string;
    loadingTrades: string;
    closed: string;
    duplicateFileTitle: string;
    duplicateFileBody: string;
    duplicateFileHint: string;
    duplicateFileUnderstood: string;
    duplicateFileUndo: string;
    wizardStep1Title: string;
    wizardStep2Title: string;
    wizardStep1Subtitle: string;
    wizardStep2Subtitle: string;
    next: string;
    previous: string;
    registerTrade: string;
  };

  // Analytics
  analytics: {
    title: string;
    subtitle: string;
    last30Days: string;
    last90Days: string;
    sixMonths: string;
    allTime: string;
    totalPnl: string;
    winRate: string;
    profitFactor: string;
    totalTrades: string;
    monthlyPnl: string;
    monthlyPnlDesc: string;
    winLossRatio: string;
    distributionOutcomes: string;
    winning: string;
    losing: string;
    weekdayPerformance: string;
    winRateByDay: string;
    timeAnalysis: string;
    bestTradingHours: string;
    assetDistribution: string;
    breakdownByMarket: string;
    trades: string;
  };

  // Psychology
  psychology: {
    title: string;
    subtitle: string;
    errorTaxometer: string;
    loading: string;
    noErrorsRegistered: string;
    totalLost: string;
    thisWeek: string;
    viewDetail: string;
    newEntry: string;
    avgDiscipline: string;
    rulesFollowed: string;
    avgSleep: string;
    entriesThisWeek: string;
    todaysCheckin: string;
    howAreYou: string;
    currentEmotion: string;
    disciplineScore: string;
    sleepQuality: string;
    stressLevel: string;
    lessonsLearned: string;
    whatDidYouLearn: string;
    saveEntry: string;
    recentEntries: string;
    journalHistory: string;
    currentStreak: string;
    bestStreak: string;
    weekly: string;
    monthly: string;
    completion: string;
    completedCheckins: string;
    daysUnit: string;
    periodGoal: string;
    weeklyGoal: string;
    monthlyGoal: string;
    goalReached: string;
    remainingCheckins: string;
    goalAtRisk: string;
    goalProgress: string;

    emotions: {
      confident: string;
      calm: string;
      neutral: string;
      excited: string;
      anxious: string;
      fearful: string;
      greedy: string;
      frustrated: string;
      fomo: string;
      vengeful: string;
    };
  };

  // Insights
  insights: {
    title: string;
    subtitle: string;
    poweredByAI: string;
    refreshAnalysis: string;
    patternsDetected: string;
    edgesFound: string;
    warnings: string;
    actionsTaken: string;
    allInsights: string;
    overtrading: string;
    patterns: string;
    edges: string;
    newInsights: string;
    aiConfidence: string;
    aiCapabilities: string;
    whatAiAnalyzes: string;
    overtradingDetection: string;
    overtradingDesc: string;
    patternRecognition: string;
    patternDesc: string;
    edgeDiscovery: string;
    edgeDesc: string;
    riskAnalysis: string;
    riskDesc: string;
    timeAnalysis: string;
    timeDesc: string;
    psychologyCorrelation: string;
    psychologyDesc: string;
    // Dynamic insight translations
    insightTitles: {
      overtradingAlert: string;
      fridayPattern: string;
      eurUsdEdge: string;
      riskManagement: string;
      cryptoPotential: string;
    };
    insightDescriptions: {
      overtradingAlert: string;
      fridayPattern: string;
      eurUsdEdge: string;
      riskManagement: string;
      cryptoPotential: string;
    };
    insightDetails: {
      overtradingAlert: string;
      fridayPattern: string;
      eurUsdEdge: string;
      riskManagement: string;
      cryptoPotential: string;
    };
    insightActions: {
      viewTradingFrequency: string;
      analyzeFridayTrades: string;
      viewStrategyDetails: string;
      reviewRiskSettings: string;
      portfolioAnalysis: string;
    };
  };

  // Settings
  settings: {
    title: string;
    subtitle: string;
    profile: string;
    personalInfo: string;
    fullName: string;
    yourName: string;
    email: string;
    timezone: string;
    currency: string;
    saveChanges: string;
    saveSuccess: string;
    saving: string;
    dataAndOnboarding: string;
    notifications: string;
    configureAlerts: string;
    aiInsights: string;
    aiInsightsDesc: string;
    tradeReminders: string;
    tradeRemindersDesc: string;
    weeklyReports: string;
    weeklyReportsDesc: string;
    overtradingAlerts: string;
    overtradingAlertsDesc: string;
    subscription: string;
    managePlan: string;
    security: string;
    protectAccount: string;
    twoFactor: string;
    twoFactorDesc: string;
    changePassword: string;
    changePasswordDesc: string;
    activeSessions: string;
    activeSessionsDesc: string;
    viewAll: string;
    dangerZone: string;
    irreversibleActions: string;
    exportAllData: string;
    exportDataDesc: string;
    deleteAccount: string;
    deleteAccountDesc: string;
    plans: {
      free: string;
      freeDesc: string;
      pro: string;
      proDesc: string;
      power: string;
      powerDesc: string;
      features: {
        tradesPerMonth: string;
        basicAnalytics: string;
        psychologyTracking: string;
        dataRetention: string;
        unlimited: string;
        aiInsights: string;
        advancedAnalytics: string;
        exportReports: string;
        multipleAccounts: string;
        prioritySupport: string;
        everythingInPro: string;
        backtesting: string;
        apiAccess: string;
        customIntegrations: string;
        dedicatedSupport: string;
        whiteLabel: string;
      };
    };
    geolocation?: {
      title: string;
      description: string;
      toggle: string;
      privacy: string;
      detected: string;
      country: string;
      city: string;
      language: string;
      source: string;
      detectNow: string;
      clear: string;
    };
  };

  brain: {
    title: string;
    subtitle: string;
    addSample: string;
    editSample: string;
    sampleImage: string;
    pickImage: string;
    session: string;
    sessionAsia: string;
    sessionLondon: string;
    sessionNewYork: string;
    sessionOverlap: string;
    symbol: string;
    timeframe: string;
    occurredAt: string;
    structure: string;
    tagTrend: string;
    tagRange: string;
    tagLiquiditySweep: string;
    tagFvg: string;
    tagOrderBlock: string;
    tagFalseBreakout: string;
    tagHighVolatility: string;
    tagLowVolatility: string;
    tagNews: string;
    outcome: string;
    outcomeWin: string;
    outcomeStop: string;
    rMultiple: string;
    setupType: string;
    notes: string;
    notesPlaceholder: string;
    save: string;
    saving: string;
    analyzing: string;
    aiAnalysis: string;
    reanalyze: string;
    aiPending: string;
    aiError: string;
    qualityScore: string;
    patterns: string;
    library: string;
    empty: string;
    emptyDesc: string;
    filterSession: string;
    filterOutcome: string;
    all: string;
    search: string;
    searchPlaceholder: string;
    totalSamples: string;
    winsVsStops: string;
    bySession: string;
    topPatterns: string;
    saved: string;
    deleted: string;
    deleteConfirm: string;
    errorImage: string;
    errorRequired: string;
    detail: string;
  };

  welcomeModal?: {
    sampleLoaded: string;
    sampleLoadedDesc: string;
    sampleFailed: string;
  };

  extra?: {
    refresh: string;
    undo: string;
    generate: string;
    preview: string;
    print: string;
    share: string;
    exportPdf: string;
    viewAll: string;
    importHistoryTitle: string;
    noImportsYet: string;
    loadHistoryError: string;
    undoConfirm: string;
    removedTrades: string;
    undoError: string;
    colDate: string;
    colFile: string;
    colHash: string;
    colImported: string;
    colSkipped: string;
    colStatus: string;
    colActions: string;
    statusUndone: string;
    statusNotImported: string;
    statusWithSkips: string;
    statusActive: string;
    analyticsTab: string;
    reportsTab: string;
    notEnoughData: string;
    addTradesToSeeStats: string;
    startLoggingTrades: string;
    needFiveTrades: string;
    noInsightsYet: string;
    insightsGeneratedAuto: string;
    aiInsightsTitle: string;
    poweredByML: string;
    reportTypePlaceholder: string;
    weekly: string;
    monthly: string;
    quarterly: string;
    yearly: string;
    generateReport: string;
    noDataReports: string;
    addTradesForReports: string;
    monthlyPerformanceReport: string;
    latest: string;
    generated: string;
    reportSections: string;
    executiveSummary: string;
    executiveSummaryDesc: string;
    tradeAnalysis: string;
    tradeAnalysisDesc: string;
    psychologyInsights: string;
    psychologyInsightsDesc: string;
    exportOptions: string;
    exportOptionsDesc: string;
    pdfReport: string;
    pdfReportDesc: string;
    csvData: string;
    csvDataDesc: string;
    shareLink: string;
    shareLinkDesc: string;
    totalPnl: string;
    winRate: string;
    totalTrades: string;
    profitFactor: string;
    averageWin: string;
    averageLoss: string;
    bestTrade: string;
    worstTrade: string;
    detectedBroker: string;
    delimiter: string;
    duplicates: string;
    fileLabel: string;
    brokerLabel: string;
    tradesLabel: string;
    ignored: string;
    missing: string;
    unmapped: string;
    symbol: string;
    direction: string;
    entryCol: string;
    exitCol: string;
    volume: string;
    dateCol: string;
    sourceCol: string;
  };
}


const baseTranslations: Record<Language, Translations> = {
  ES: {
    common: {
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      view: 'Ver',
      add: 'Agregar',
      search: 'Buscar',
      filter: 'Filtrar',
      loading: 'Cargando...',
      noResults: 'Sin resultados',
      pending: 'Pendientes',
      completed: 'Completado',
      inProgress: 'En Progreso',
      all: 'Todos',
      new: 'NUEVO',
      dismiss: 'Descartar',
      enable: 'Habilitar',
      change: 'Cambiar',
      export: 'Exportar',
      upgrade: 'Mejorar',
      currentPlan: 'Plan Actual',
      mostPopular: 'Más Popular',
      excellent: 'Excelente',
      good: 'Bien',
      improvable: 'Mejorable',
    },
    nav: {
      dashboard: 'Panel de Control',
      journal: 'Registro de Operaciones',
      analytics: 'Centro de Análisis',
      psychology: 'Métricas Conductuales',
      insights: 'Motor de Insights',
      settings: 'Configuración',
      logout: 'Cerrar Sesión',
      reports: 'Reportes',
    },
    topbar: {
      title: 'Trading Software',
      myAccount: 'Mi Cuenta',
      profile: 'Perfil',
      billing: 'Facturación',
      settings: 'Configuración',
      signOut: 'Cerrar sesión',
      defaultTraderName: 'Trader',
      accountsCenter: 'Centro de cuentas',
    },
    auth: {
      welcome: 'Bienvenido a Mind On',
      subtitle: 'Accede a tu plataforma de inteligencia de trading',
      signIn: 'Iniciar Sesión',
      signUp: 'Registrarse',
      email: 'Correo electrónico',
      password: 'Contraseña',
      fullName: 'Nombre completo',
      signingIn: 'Iniciando sesión...',
      creatingAccount: 'Creando cuenta...',
      createAccount: 'Crear Cuenta',
      termsNotice: 'Al registrarte, aceptas nuestros Términos de Servicio y Política de Privacidad',
      errorSignIn: 'Error al iniciar sesión',
      errorSignUp: 'Error al crear cuenta',
      welcomeBack: '¡Bienvenido de nuevo!',
      accountCreated: '¡Cuenta creada!',
      welcomeToApp: '¡Bienvenido a Mind On!',
      headline: 'Opera más inteligente con insights',
      headlineHighlight: 'potenciados por IA',
      subheadline: 'Únete a miles de traders que usan Mind On para rastrear, analizar y mejorar su rendimiento.',
      features: {
        analytics: 'Analítica Avanzada',
        analyticsDesc: 'Insights profundos de tu rendimiento',
        ai: 'Insights con IA',
        aiDesc: 'Machine learning detecta patrones',
        equity: 'Curva de Equidad',
        equityDesc: 'Visualiza tu crecimiento',
        psychology: 'Psicología Trading',
        psychologyDesc: 'Domina tu mentalidad',
      },
      stats: {
        activeTraders: 'Traders activos',
        analyzedTrades: 'Trades analizados',
        satisfaction: 'Satisfacción',
      },
    },
    dashboard: {
      mentalState: 'Estado Operacional',
      goodMorning: 'Buenos días',
      goodAfternoon: 'Buenas tardes',
      goodEvening: 'Buenas noches',
      recentActivity: 'Actividad Reciente',
      completeCheckIn: 'Completa tu check-in pre-mercado para comenzar.',
      completeCheckInCTA: 'Hacer Check-in',
      planActive: 'Tu plan de hoy está activo. Mantén la disciplina.',
      mentalStateTitle: 'Estado Mental',
      disciplineTopTier: 'Mantén este nivel de disciplina. Eres Top 10% de traders.',
      disciplineImprovement: 'Pequeños ajustes en tu rutina pueden mejorar tu score. Revisa tu check-in.',
      viewFullAnalysis: 'Ver Análisis Completo',
      recentTradesTitle: 'Operaciones Recientes',
      recentTradesSubtitle: 'Tu actividad de trading más reciente',
      viewAll: 'Ver todo',
      quickActionNewTrade: 'Nuevo Trade',
      quickActionJournal: 'Mi Journal',
      quickActionCheckIn: 'Check-in',
      quickActionAnalytics: 'Analytics',
      discipline: 'Índice de Disciplina',
      insightOfDay: 'Insight del Día',
      tiltAlert: 'Alerta de Riesgo Conductual',
      tiltDescription: 'El sistema ha detectado sesiones con múltiples pérdidas consecutivas. Esto indica un patrón de riesgo emocional.',
      tiltAdvice: 'Protocolo recomendado: Pausar operaciones tras 2 pérdidas consecutivas.',
      ritualCompleted: 'Protocolo Completado',
      comeBackTomorrow: 'Vuelve mañana para un nuevo análisis.',
      dailyStreak: 'Racha de Consistencia',
      weeklySummary: 'Reporte Semanal',
      bestDay: 'Mejor día',
      noTrades: 'Sin operaciones registradas.',
      patienceMessage: 'La paciencia es parte del proceso.',
      capitalRisk: 'Gestión de Capital',
      accountBalance: 'Balance de Portafolio',
      operativePerformance: 'Métricas de Rendimiento',
      totalTrades: 'Operaciones Totales',
      closed: 'Ejecutadas',
      equityCurve: 'Curva de Capital',
      preMarketProtocol: 'Protocolo Pre-Mercado',
      newProtocolItem: 'Nuevo ítem de protocolo...',
      emptyList: 'Lista vacía',
      aiFree: 'AI-Free',
      editBalance: 'Editar Capital',
      accountSetup: 'Configurar Portafolio',
      initialBalance: 'Capital Inicial',
      currentBalance: 'Capital Actual',
      accountName: 'Nombre del Portafolio',
      broker: 'Broker',
      saveAccount: 'Guardar Configuración',
      createAccount: 'Crear Portafolio',
      noAccountYet: 'Sin portafolio configurado',
      clickToSetup: 'Configurar ahora',
      portfolioValue: 'Valor del Portafolio',
    },
    disciplineMetrics: {
      streak3Days: 'Consistencia 3 Días',
      streak3DaysDesc: '3 días de protocolo cumplido.',
      weeklyTarget: 'Objetivo Semanal',
      analyticalMindset: 'Enfoque Analítico',
      operationalConsistency: 'Consistencia Operacional',
      operationalConsistencyDesc: 'Operaste 3+ días esta semana.',
    },
    journal: {
      title: 'Diario de Operaciones',
      subtitle: 'Registra y analiza tus operaciones',
      addTrade: 'Agregar Operación',
      addNewTrade: 'Agregar Nueva Operación',
      logNewTrade: 'Registra una nueva operación en tu diario',
      totalTrades: 'Total Operaciones',
      winRate: 'Win Rate',
      totalPnl: 'P&L Total',
      searchSymbol: 'Buscar por símbolo...',
      filterStatus: 'Filtrar por estado',
      allTrades: 'Todas las Operaciones',
      open: 'Abierta',
      symbol: 'Símbolo',
      direction: 'Dirección',
      selectDirection: 'Seleccionar dirección',
      long: 'Largo',
      short: 'Corto',
      entryPrice: 'Precio de Entrada',
      exitPrice: 'Precio de Salida',
      quantity: 'Cantidad',
      stopLoss: 'Stop Loss',
      stopSize: 'Tamaño del Stop',
      stopSizeHint: 'Cuánto dinero estás dispuesto a perder si se ejecuta el stop',
      resultSection: 'Resultado de la operación',
      pnlManual: 'Resultado (P&L)',
      pnlPercentManual: 'Resultado %',
      pnlHint: 'Ingresá la ganancia o pérdida real de la operación (negativo = pérdida)',
      pnlRequired: 'Ingresá el resultado de la operación cerrada',
      attachImage: 'Captura / Imagen',
      attachImageHint: 'PNG, JPG, WEBP o GIF — máx. 5MB',
      removeImage: 'Quitar imagen',
      imageUploadFailed: 'La operación se guardó, pero la imagen no se pudo subir.',
      risk: 'Riesgo',
      takeProfit: 'Take Profit',
      strategy: 'Estrategia',
      entryDate: 'Fecha de Entrada',
      notes: 'Notas',
      addNotesPlaceholder: 'Agrega notas sobre esta operación...',
      noTradesFound: 'No se encontraron operaciones',
      addFirstTrade: 'Agregar tu primera operación',
      viewDetails: 'Ver Detalles',
      editTrade: 'Editar Operación',
      addScreenshot: 'Agregar Captura',
      entry: 'Entrada',
      exit: 'Salida',
      export: 'Exportar',
      exportSuccess: 'Exportado a {format} correctamente',
      exportError: 'Error al exportar',
      import: 'Importar',
      importFile: 'Importar Archivo',
      importSuccess: 'Archivo importado correctamente',
      importError: 'Error al importar archivo',
      tradesImported: '{count} operaciones importadas',
      selectFile: 'Seleccionar archivo',
      supportedFormats: 'Formatos soportados: CSV, Excel (.xlsx)',
      optional: 'opcional',
      closedStatus: 'Cerrada',
      openStatus: 'Abierta',
      tradeStatus: 'Estado',
      openDateTime: 'Fecha/Hora de Apertura',
      closeDateTime: 'Fecha/Hora de Cierre',
      commission: 'Comisión',
      pnlEstimated: 'P&L Estimado',
      openPositions: 'Posiciones Abiertas',
      importEmptyHint: 'Importá un archivo CSV/Excel o agregá tu primera operación para comenzar a registrar tu rendimiento.',
      loadingTrades: 'Cargando operaciones...',
      closed: 'Cerrada',
      duplicateFileTitle: 'Archivo duplicado detectado',
      duplicateFileBody: 'Este archivo ya fue importado anteriormente con el nombre "{name}" el {date}. Trajo {count} operación(es).',
      duplicateFileHint: 'Para volver a cargarlo, primero deshaz la importación previa.',
      duplicateFileUnderstood: 'Entendido',
      duplicateFileUndo: 'Deshacer último proceso',
      wizardStep1Title: 'Detalles de Entrada',
      wizardStep2Title: 'Gestión y Salida',
      wizardStep1Subtitle: '1/2 Detalles de Entrada',
      wizardStep2Subtitle: '2/2 Gestión y Salida',
      next: 'Siguiente',
      previous: 'Anterior',
      registerTrade: 'Registrar Operación',
    },
    analytics: {
      title: 'Analítica',
      subtitle: 'Análisis profundo de tu rendimiento en trading',
      last30Days: 'Últimos 30 Días',
      last90Days: 'Últimos 90 Días',
      sixMonths: '6 Meses',
      allTime: 'Todo el Tiempo',
      totalPnl: 'P&L Total',
      winRate: 'Win Rate',
      profitFactor: 'Factor de Ganancia',
      totalTrades: 'Total Operaciones',
      monthlyPnl: 'P&L Mensual',
      monthlyPnlDesc: 'Ganancias y pérdidas por mes',
      winLossRatio: 'Ratio Ganadas/Perdidas',
      distributionOutcomes: 'Distribución de resultados',
      winning: 'Ganadas',
      losing: 'Perdidas',
      weekdayPerformance: 'Rendimiento por Día',
      winRateByDay: 'Win rate por día de la semana',
      timeAnalysis: 'Análisis por Hora',
      bestTradingHours: 'Mejores horarios de trading',
      assetDistribution: 'Distribución por Activo',
      breakdownByMarket: 'Desglose por mercado',
      trades: 'operaciones',
    },
    psychology: {
      title: 'Seguimiento Psicológico',
      subtitle: 'Monitorea tu mentalidad y emociones de trading',
      errorTaxometer: 'Taxímetro de Errores',
      loading: 'Cargando…',
      noErrorsRegistered: 'Sin errores registrados — sigue así.',
      totalLost: 'Total perdido',
      thisWeek: 'Esta semana',
      viewDetail: 'Ver detalle',
      newEntry: 'Nueva Entrada',
      avgDiscipline: 'Disciplina Promedio',
      rulesFollowed: 'Reglas Seguidas',
      avgSleep: 'Sueño Promedio',
      entriesThisWeek: 'Entradas Esta Semana',
      todaysCheckin: 'Check-in de Hoy',
      howAreYou: '¿Cómo te sientes hoy?',
      currentEmotion: 'Emoción Actual',
      disciplineScore: 'Puntuación de Disciplina',
      sleepQuality: 'Calidad de Sueño',
      stressLevel: 'Nivel de Estrés',
      lessonsLearned: 'Lecciones Aprendidas',
      whatDidYouLearn: '¿Qué aprendiste hoy?',
      saveEntry: 'Guardar Entrada',
      recentEntries: 'Entradas Recientes',
      journalHistory: 'Historial de tu diario psicológico',
      currentStreak: 'Racha actual',
      bestStreak: 'Mejor racha',
      weekly: 'Semanal',
      monthly: 'Mensual',
      completion: 'Cumplimiento',
      completedCheckins: 'check-ins completados',
      daysUnit: 'días',
      periodGoal: 'Meta del período',
      weeklyGoal: 'Meta semanal',
      monthlyGoal: 'Meta mensual',
      goalReached: 'Meta cumplida',
      remainingCheckins: 'check-ins restantes',
      goalAtRisk: 'Meta en riesgo',
      goalProgress: 'Progreso vs meta',

      emotions: {
        confident: 'Confiado',
        calm: 'Calmado',
        neutral: 'Neutral',
        excited: 'Emocionado',
        anxious: 'Ansioso',
        fearful: 'Temeroso',
        greedy: 'Codicioso',
        frustrated: 'Frustrado',
        fomo: 'FOMO',
        vengeful: 'Vengativo',
      },
    },
    insights: {
      title: 'Insights de IA',
      subtitle: 'Análisis de machine learning de tus patrones de trading',
      poweredByAI: 'Potenciado por IA',
      refreshAnalysis: 'Actualizar Análisis',
      patternsDetected: 'Patrones Detectados',
      edgesFound: 'Ventajas Encontradas',
      warnings: 'Advertencias',
      actionsTaken: 'Acciones Tomadas',
      allInsights: 'Todos los Insights',
      overtrading: 'Sobreoperación',
      patterns: 'Patrones',
      edges: 'Ventajas',
      newInsights: 'Nuevos Insights',
      aiConfidence: 'Confianza de IA',
      aiCapabilities: 'Capacidades de IA',
      whatAiAnalyzes: 'Lo que analiza nuestro motor de IA',
      overtradingDetection: 'Detección de Sobreoperación',
      overtradingDesc: 'Monitorea frecuencia y calidad de operaciones',
      patternRecognition: 'Reconocimiento de Patrones',
      patternDesc: 'Encuentra errores y patrones recurrentes',
      edgeDiscovery: 'Descubrimiento de Ventajas',
      edgeDesc: 'Identifica ventajas estadísticas',
      riskAnalysis: 'Análisis de Riesgo',
      riskDesc: 'Monitorea comportamiento de gestión de riesgo',
      timeAnalysis: 'Análisis Temporal',
      timeDesc: 'Mejores y peores horarios de trading',
      psychologyCorrelation: 'Correlación Psicológica',
      psychologyDesc: 'Vincula emociones con rendimiento',
      insightTitles: {
        overtradingAlert: 'Alerta de Sobreoperación',
        fridayPattern: 'Patrón de Pérdida Recurrente: Viernes Tarde',
        eurUsdEdge: 'Ventaja Estadística: EUR/USD Sesión Londres',
        riskManagement: 'Problema de Gestión de Riesgo',
        cryptoPotential: 'Potencial Sin Explotar: Mercados Crypto',
      },
      insightDescriptions: {
        overtradingAlert: 'Realizaste 15 operaciones esta semana, 67% sobre tu promedio de 6 meses de 9 operaciones.',
        fridayPattern: 'Tus operaciones los viernes después de las 14:00 muestran un 23% menos de win rate.',
        eurUsdEdge: 'Posiciones largas durante la sesión de Londres (08:00-10:00 GMT) muestran un 73% de win rate.',
        riskManagement: 'El tamaño promedio de pérdida aumentó 34% este mes comparado con el mes pasado.',
        cryptoPotential: 'Tus operaciones en crypto muestran un 78% de win rate pero representan solo el 12% de tu portafolio.',
      },
      insightDetails: {
        overtradingAlert: 'Los datos históricos muestran que tu win rate baja 18% cuando operas más de 12 veces por semana. Considera reducir la frecuencia.',
        fridayPattern: 'Análisis de 47 operaciones viernes tarde muestra 41% win rate vs 64% general. Considera evitar nuevas posiciones en esta ventana.',
        eurUsdEdge: 'Basado en 34 operaciones en 6 meses. R:R promedio de 1.8:1. Esto representa una ventaja significativa.',
        riskManagement: 'Tu pérdida promedio pasó de $87 a $117. Revisa la colocación de stop-loss y el tamaño de posición.',
        cryptoPotential: 'Considera aumentar la asignación a mercados crypto donde demuestras ventaja consistente.',
      },
      insightActions: {
        viewTradingFrequency: 'Ver Frecuencia de Trading',
        analyzeFridayTrades: 'Analizar Operaciones Viernes',
        viewStrategyDetails: 'Ver Detalles de Estrategia',
        reviewRiskSettings: 'Revisar Configuración de Riesgo',
        portfolioAnalysis: 'Análisis de Portafolio',
      },
    },
    settings: {
      title: 'Configuración',
      subtitle: 'Administra tu cuenta y preferencias',
      profile: 'Perfil',
      personalInfo: 'Tu información personal',
      fullName: 'Nombre Completo',
      yourName: 'Tu nombre',
      email: 'Correo Electrónico',
      timezone: 'Zona Horaria',
      currency: 'Moneda',
      saveChanges: 'Guardar Cambios',
      saveSuccess: 'Perfil actualizado correctamente',
      saving: 'Guardando...',
      dataAndOnboarding: 'Datos y Onboarding',
      notifications: 'Notificaciones',
      configureAlerts: 'Configura cómo recibes alertas',
      aiInsights: 'Insights de IA',
      aiInsightsDesc: 'Recibe notificación cuando hay nuevos insights disponibles',
      tradeReminders: 'Recordatorios de Operaciones',
      tradeRemindersDesc: 'Recordatorio diario para registrar tus operaciones',
      weeklyReports: 'Reportes Semanales',
      weeklyReportsDesc: 'Recibe resúmenes de rendimiento semanales',
      overtradingAlerts: 'Alertas de Sobreoperación',
      overtradingAlertsDesc: 'Recibe advertencia cuando operas muy frecuentemente',
      subscription: 'Suscripción',
      managePlan: 'Administra tu plan y facturación',
      security: 'Seguridad',
      protectAccount: 'Protege tu cuenta',
      twoFactor: 'Autenticación de Dos Factores',
      twoFactorDesc: 'Agrega una capa extra de seguridad',
      changePassword: 'Cambiar Contraseña',
      changePasswordDesc: 'Actualiza tu contraseña regularmente',
      activeSessions: 'Sesiones Activas',
      activeSessionsDesc: 'Administra tus dispositivos conectados',
      viewAll: 'Ver Todos',
      dangerZone: 'Zona de Peligro',
      irreversibleActions: 'Acciones irreversibles',
      exportAllData: 'Exportar Todos los Datos',
      exportDataDesc: 'Descarga todas tus operaciones y configuración',
      deleteAccount: 'Eliminar Cuenta',
      deleteAccountDesc: 'Eliminar permanentemente tu cuenta y datos',
      plans: {
        free: 'Gratis',
        freeDesc: 'Comienza con diario de trading básico',
        pro: 'Pro',
        proDesc: 'Funciones avanzadas para traders serios',
        power: 'Power',
        powerDesc: 'Suite completa para traders profesionales',
        features: {
          tradesPerMonth: '50 operaciones/mes',
          basicAnalytics: 'Analítica básica',
          psychologyTracking: 'Seguimiento psicológico',
          dataRetention: 'Retención de datos 7 días',
          unlimited: 'Operaciones ilimitadas',
          aiInsights: 'Insights de IA',
          advancedAnalytics: 'Analítica avanzada',
          exportReports: 'Exportar reportes',
          multipleAccounts: 'Múltiples cuentas',
          prioritySupport: 'Soporte prioritario',
          everythingInPro: 'Todo en Pro',
          backtesting: 'Módulo de backtesting',
          apiAccess: 'Acceso API',
          customIntegrations: 'Integraciones personalizadas',
          dedicatedSupport: 'Soporte dedicado',
          whiteLabel: 'Opción white-label',
        },
      },
      geolocation: {
        title: 'Detección de Ubicación',
        description: 'Usa tu ubicación para detectar automáticamente el idioma apropiado.',
        toggle: 'Detección de idioma por IP',
        privacy: 'Privacidad: Solo detectamos tu país (no guardamos tu IP). Los resultados se guardan localmente por 7 días.',
        detected: 'Ubicación detectada',
        country: 'País',
        city: 'Ciudad',
        language: 'Idioma',
        source: 'Servicio',
        detectNow: 'Detectar ahora',
        clear: 'Limpiar caché',
      },
    },
    extra: {
      refresh: 'Actualizar', undo: 'Deshacer', generate: 'Generar', preview: 'Vista previa',
      print: 'Imprimir', share: 'Compartir', exportPdf: 'Exportar PDF', viewAll: 'Ver todos',
      importHistoryTitle: 'Historial de importaciones',
      noImportsYet: 'Aún no has importado archivos.',
      loadHistoryError: 'No se pudo cargar el historial de importaciones',
      undoConfirm: '¿Deshacer esta importación? Se eliminarán las operaciones cargadas.',
      removedTrades: 'Se eliminaron {n} operaciones',
      undoError: 'No se pudo deshacer la importación',
      colDate: 'Fecha', colFile: 'Archivo', colHash: 'Hash', colImported: 'Importadas',
      colSkipped: 'Omitidas', colStatus: 'Estado', colActions: 'Acciones',
      statusUndone: 'Deshecho', statusNotImported: 'Sin importar',
      statusWithSkips: 'Con omisiones', statusActive: 'Activo',
      analyticsTab: 'Analítica', reportsTab: 'Reportes',
      notEnoughData: 'Sin datos suficientes para mostrar análisis',
      addTradesToSeeStats: 'Agrega operaciones en el diario para ver estadísticas',
      startLoggingTrades: 'Comienza a registrar operaciones para recibir insights',
      needFiveTrades: 'Necesitas al menos 5 operaciones para que la IA analice tus patrones',
      noInsightsYet: 'No hay insights disponibles aún',
      insightsGeneratedAuto: 'Los insights se generarán automáticamente a medida que registres operaciones',
      aiInsightsTitle: 'Insights de IA', poweredByML: 'Impulsado por machine learning',
      reportTypePlaceholder: 'Tipo de reporte',
      weekly: 'Semanal', monthly: 'Mensual', quarterly: 'Trimestral', yearly: 'Anual',
      generateReport: 'Generar Reporte',
      noDataReports: 'No hay datos para generar reportes',
      addTradesForReports: 'Agrega operaciones en el diario para generar reportes de rendimiento',
      monthlyPerformanceReport: 'Reporte de Rendimiento Mensual', latest: 'Último',
      generated: 'Generado',
      reportSections: 'Secciones del reporte',
      executiveSummary: 'Resumen ejecutivo',
      executiveSummaryDesc: 'Vista general de tu rendimiento de trading',
      tradeAnalysis: 'Análisis de operaciones',
      tradeAnalysisDesc: 'Desglose detallado de todas las operaciones con estadísticas',
      psychologyInsights: 'Insights de psicología',
      psychologyInsightsDesc: 'Patrones emocionales y seguimiento de disciplina',
      exportOptions: 'Opciones de Exportación',
      exportOptionsDesc: 'Elegí el formato de exportación que preferís',
      pdfReport: 'Reporte PDF', pdfReportDesc: 'Reporte completo con formato',
      csvData: 'Datos CSV', csvDataDesc: 'Exportación de datos sin procesar',
      shareLink: 'Link para compartir', shareLinkDesc: 'Generar reporte compartible',
      totalPnl: 'P&L Total', winRate: 'Tasa de aciertos',
      totalTrades: 'Operaciones totales', profitFactor: 'Factor de beneficio',
      averageWin: 'Ganancia promedio', averageLoss: 'Pérdida promedio',
      bestTrade: 'Mejor operación', worstTrade: 'Peor operación',
      detectedBroker: 'Broker detectado', delimiter: 'Delimitador', duplicates: 'Duplicados',
      fileLabel: 'Archivo', brokerLabel: 'Broker', tradesLabel: 'Operaciones',
      ignored: 'Ignoradas', missing: 'Faltantes', unmapped: 'Sin mapear',
      symbol: 'Símbolo', direction: 'Dirección', entryCol: 'Entrada', exitCol: 'Salida',
      volume: 'Volumen', dateCol: 'Fecha', sourceCol: 'Origen',
    },
  },
  EN: {
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      add: 'Add',
      search: 'Search',
      filter: 'Filter',
      loading: 'Loading...',
      noResults: 'No results',
      pending: 'Pending',
      completed: 'Completed',
      inProgress: 'In Progress',
      all: 'All',
      new: 'NEW',
      dismiss: 'Dismiss',
      enable: 'Enable',
      change: 'Change',
      export: 'Export',
      upgrade: 'Upgrade',
      currentPlan: 'Current Plan',
      mostPopular: 'Most Popular',
      excellent: 'Excellent',
      good: 'Good',
      improvable: 'Improvable',
    },
    nav: {
      dashboard: 'Command Center',
      journal: 'Trade Ledger',
      analytics: 'Analytics Hub',
      psychology: 'Behavioral Metrics',
      insights: 'Insight Engine',
      settings: 'Settings',
      logout: 'Logout',
      reports: 'Reports',
    },
    topbar: {
      title: 'Trading Software',
      myAccount: 'My Account',
      profile: 'Profile',
      billing: 'Billing',
      settings: 'Settings',
      signOut: 'Sign out',
      defaultTraderName: 'Trader',
      accountsCenter: 'Accounts Center',
    },
    auth: {
      welcome: 'Welcome to Mind On',
      subtitle: 'Access your trading intelligence platform',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      email: 'Email',
      password: 'Password',
      fullName: 'Full name',
      signingIn: 'Signing in...',
      creatingAccount: 'Creating account...',
      createAccount: 'Create Account',
      termsNotice: 'By signing up, you agree to our Terms of Service and Privacy Policy',
      errorSignIn: 'Error signing in',
      errorSignUp: 'Error creating account',
      welcomeBack: 'Welcome back!',
      accountCreated: 'Account created!',
      welcomeToApp: 'Welcome to Mind On!',
      headline: 'Trade smarter with',
      headlineHighlight: 'AI-powered insights',
      subheadline: 'Join thousands of traders using Mind On to track, analyze and improve their performance.',
      features: {
        analytics: 'Advanced Analytics',
        analyticsDesc: 'Deep insights into your performance',
        ai: 'AI Insights',
        aiDesc: 'Machine learning detects patterns',
        equity: 'Equity Curve',
        equityDesc: 'Visualize your growth',
        psychology: 'Trading Psychology',
        psychologyDesc: 'Master your mindset',
      },
      stats: {
        activeTraders: 'Active traders',
        analyzedTrades: 'Trades analyzed',
        satisfaction: 'Satisfaction',
      },
    },
    dashboard: {
      mentalState: 'Operational State',
      goodMorning: 'Good morning',
      goodAfternoon: 'Good afternoon',
      goodEvening: 'Good evening',
      recentActivity: 'Recent Activity',
      completeCheckIn: 'Complete your pre-market check-in to get started.',
      completeCheckInCTA: 'Complete Check-in',
      planActive: 'Your plan for today is active. Stay disciplined.',
      mentalStateTitle: 'Mental State',
      disciplineTopTier: 'Keep this discipline level. You are Top 10% of traders.',
      disciplineImprovement: 'Small routine adjustments can improve your score. Review your check-in.',
      viewFullAnalysis: 'View Full Analysis',
      recentTradesTitle: 'Recent Trades',
      recentTradesSubtitle: 'Your latest trading activity',
      viewAll: 'View all',
      quickActionNewTrade: 'New Trade',
      quickActionJournal: 'My Journal',
      quickActionCheckIn: 'Check-in',
      quickActionAnalytics: 'Analytics',
      discipline: 'Discipline Index',
      insightOfDay: 'Insight of the Day',
      tiltAlert: 'Behavioral Risk Alert',
      tiltDescription: 'The system has detected sessions with multiple consecutive losses. This indicates an emotional risk pattern.',
      tiltAdvice: 'Recommended protocol: Pause trading after 2 consecutive losses.',
      ritualCompleted: 'Protocol Completed',
      comeBackTomorrow: 'Come back tomorrow for a new analysis.',
      dailyStreak: 'Consistency Streak',
      weeklySummary: 'Weekly Report',
      bestDay: 'Best day',
      noTrades: 'No trades recorded.',
      patienceMessage: 'Patience is part of the process.',
      capitalRisk: 'Capital Management',
      accountBalance: 'Portfolio Balance',
      operativePerformance: 'Performance Metrics',
      totalTrades: 'Total Operations',
      closed: 'Executed',
      equityCurve: 'Equity Curve',
      preMarketProtocol: 'Pre-Market Protocol',
      newProtocolItem: 'New protocol item...',
      emptyList: 'Empty list',
      aiFree: 'AI-Free',
      editBalance: 'Edit Capital',
      accountSetup: 'Configure Portfolio',
      initialBalance: 'Initial Capital',
      currentBalance: 'Current Capital',
      accountName: 'Portfolio Name',
      broker: 'Broker',
      saveAccount: 'Save Configuration',
      createAccount: 'Create Portfolio',
      noAccountYet: 'No portfolio configured',
      clickToSetup: 'Configure now',
      portfolioValue: 'Portfolio Value',
    },
    disciplineMetrics: {
      streak3Days: '3-Day Consistency',
      streak3DaysDesc: '3 days of protocol completed.',
      weeklyTarget: 'Weekly Target',
      analyticalMindset: 'Analytical Focus',
      operationalConsistency: 'Operational Consistency',
      operationalConsistencyDesc: 'Traded 3+ days this week.',
    },
    journal: {
      title: 'Trade Journal',
      subtitle: 'Track and analyze your trades',
      addTrade: 'Add Trade',
      addNewTrade: 'Add New Trade',
      logNewTrade: 'Log a new trade to your journal',
      totalTrades: 'Total Trades',
      winRate: 'Win Rate',
      totalPnl: 'Total P&L',
      searchSymbol: 'Search by symbol...',
      filterStatus: 'Filter by status',
      allTrades: 'All Trades',
      open: 'Open',
      symbol: 'Symbol',
      direction: 'Direction',
      selectDirection: 'Select direction',
      long: 'Long',
      short: 'Short',
      entryPrice: 'Entry Price',
      exitPrice: 'Exit Price',
      quantity: 'Quantity',
      stopLoss: 'Stop Loss',
      stopSize: 'Stop Size',
      stopSizeHint: 'How much money you are willing to lose if the stop is hit',
      resultSection: 'Trade result',
      pnlManual: 'Result (P&L)',
      pnlPercentManual: 'Result %',
      pnlHint: 'Enter the actual profit or loss of the trade (negative = loss)',
      pnlRequired: 'Enter the result of the closed trade',
      attachImage: 'Screenshot / Image',
      attachImageHint: 'PNG, JPG, WEBP or GIF — max 5MB',
      removeImage: 'Remove image',
      imageUploadFailed: 'The trade was saved, but the image could not be uploaded.',
      risk: 'Risk',
      takeProfit: 'Take Profit',
      strategy: 'Strategy',
      entryDate: 'Entry Date',
      notes: 'Notes',
      addNotesPlaceholder: 'Add any notes about this trade...',
      noTradesFound: 'No trades found',
      addFirstTrade: 'Add your first trade',
      viewDetails: 'View Details',
      editTrade: 'Edit Trade',
      addScreenshot: 'Add Screenshot',
      entry: 'Entry',
      exit: 'Exit',
      export: 'Export',
      exportSuccess: 'Successfully exported to {format}',
      exportError: 'Export failed',
      import: 'Import',
      importFile: 'Import File',
      importSuccess: 'File imported successfully',
      importError: 'Error importing file',
      tradesImported: '{count} trades imported',
      selectFile: 'Select file',
      supportedFormats: 'Supported formats: CSV, Excel (.xlsx)',
      optional: 'optional',
      closedStatus: 'Closed',
      openStatus: 'Open',
      tradeStatus: 'Status',
      openDateTime: 'Open Date/Time',
      closeDateTime: 'Close Date/Time',
      commission: 'Commission',
      pnlEstimated: 'Estimated P&L',
      openPositions: 'Open Positions',
      importEmptyHint: 'Import a CSV/Excel file or add your first trade to get started tracking your performance.',
      loadingTrades: 'Loading trades...',
      closed: 'Closed',
      duplicateFileTitle: 'Duplicate file detected',
      duplicateFileBody: 'This file was already imported as "{name}" on {date}. It brought {count} trade(s).',
      duplicateFileHint: 'To upload it again, undo the previous import first.',
      duplicateFileUnderstood: 'Understood',
      duplicateFileUndo: 'Undo last import',
      wizardStep1Title: 'Entry Details',
      wizardStep2Title: 'Management & Exit',
      wizardStep1Subtitle: '1/2 Entry Details',
      wizardStep2Subtitle: '2/2 Management & Exit',
      next: 'Next',
      previous: 'Previous',
      registerTrade: 'Register Trade',
    },
    analytics: {
      title: 'Analytics',
      subtitle: 'Deep dive into your trading performance',
      last30Days: 'Last 30 Days',
      last90Days: 'Last 90 Days',
      sixMonths: '6 Months',
      allTime: 'All Time',
      totalPnl: 'Total P&L',
      winRate: 'Win Rate',
      profitFactor: 'Profit Factor',
      totalTrades: 'Total Trades',
      monthlyPnl: 'Monthly P&L',
      monthlyPnlDesc: 'Profit and loss by month',
      winLossRatio: 'Win/Loss Ratio',
      distributionOutcomes: 'Distribution of outcomes',
      winning: 'Winning',
      losing: 'Losing',
      weekdayPerformance: 'Weekday Performance',
      winRateByDay: 'Win rate by day of week',
      timeAnalysis: 'Time of Day Analysis',
      bestTradingHours: 'Best trading hours',
      assetDistribution: 'Asset Class Distribution',
      breakdownByMarket: 'Breakdown by market',
      trades: 'trades',
    },
    psychology: {
      title: 'Psychology Tracker',
      subtitle: 'Monitor your trading mindset and emotions',
      errorTaxometer: 'Error Taximeter',
      loading: 'Loading…',
      noErrorsRegistered: 'No errors registered — keep it up.',
      totalLost: 'Total lost',
      thisWeek: 'This week',
      viewDetail: 'View detail',
      newEntry: 'New Entry',
      avgDiscipline: 'Avg Discipline',
      rulesFollowed: 'Rules Followed',
      avgSleep: 'Avg Sleep',
      entriesThisWeek: 'Entries This Week',
      todaysCheckin: "Today's Check-in",
      howAreYou: 'How are you feeling today?',
      currentEmotion: 'Current Emotion',
      disciplineScore: 'Discipline Score',
      sleepQuality: 'Sleep Quality',
      stressLevel: 'Stress Level',
      lessonsLearned: 'Lessons Learned',
      whatDidYouLearn: 'What did you learn today?',
      saveEntry: 'Save Entry',
      recentEntries: 'Recent Entries',
      journalHistory: 'Your psychology journal history',
      currentStreak: 'Current streak',
      bestStreak: 'Best streak',
      weekly: 'Weekly',
      monthly: 'Monthly',
      completion: 'Completion',
      completedCheckins: 'check-ins completed',
      daysUnit: 'days',
      periodGoal: 'Period goal',
      weeklyGoal: 'Weekly goal',
      monthlyGoal: 'Monthly goal',
      goalReached: 'Goal reached',
      remainingCheckins: 'check-ins to go',
      goalAtRisk: 'Goal at risk',
      goalProgress: 'Progress vs goal',

      emotions: {
        confident: 'Confident',
        calm: 'Calm',
        neutral: 'Neutral',
        excited: 'Excited',
        anxious: 'Anxious',
        fearful: 'Fearful',
        greedy: 'Greedy',
        frustrated: 'Frustrated',
        fomo: 'FOMO',
        vengeful: 'Vengeful',
      },
    },
    insights: {
      title: 'AI Insights',
      subtitle: 'Machine learning analysis of your trading patterns',
      poweredByAI: 'Powered by AI',
      refreshAnalysis: 'Refresh Analysis',
      patternsDetected: 'Patterns Detected',
      edgesFound: 'Edges Found',
      warnings: 'Warnings',
      actionsTaken: 'Actions Taken',
      allInsights: 'All Insights',
      overtrading: 'Overtrading',
      patterns: 'Patterns',
      edges: 'Edges',
      newInsights: 'New Insights',
      aiConfidence: 'AI Confidence',
      aiCapabilities: 'AI Analysis Capabilities',
      whatAiAnalyzes: 'What our AI engine analyzes',
      overtradingDetection: 'Overtrading Detection',
      overtradingDesc: 'Monitors trade frequency and quality',
      patternRecognition: 'Pattern Recognition',
      patternDesc: 'Finds recurring errors and patterns',
      edgeDiscovery: 'Edge Discovery',
      edgeDesc: 'Identifies statistical advantages',
      riskAnalysis: 'Risk Analysis',
      riskDesc: 'Monitors risk management behavior',
      timeAnalysis: 'Time Analysis',
      timeDesc: 'Best and worst trading times',
      psychologyCorrelation: 'Psychology Correlation',
      psychologyDesc: 'Links emotions to performance',
      insightTitles: {
        overtradingAlert: 'Overtrading Alert',
        fridayPattern: 'Recurring Loss Pattern: Friday Afternoon',
        eurUsdEdge: 'Statistical Edge: EUR/USD London Session',
        riskManagement: 'Risk Management Issue',
        cryptoPotential: 'Untapped Potential: Crypto Markets',
      },
      insightDescriptions: {
        overtradingAlert: 'You made 15 trades this week, 67% above your 6-month average of 9 trades.',
        fridayPattern: 'Your trades on Friday after 14:00 show a 23% lower win rate.',
        eurUsdEdge: 'Long positions during London session (08:00-10:00 GMT) show a 73% win rate.',
        riskManagement: 'Average loss size increased by 34% this month compared to last month.',
        cryptoPotential: 'Your crypto trades show a 78% win rate but represent only 12% of your portfolio.',
      },
      insightDetails: {
        overtradingAlert: 'Historical data shows your win rate drops by 18% when trading more than 12 times per week. Consider slowing down.',
        fridayPattern: 'Analysis of 47 Friday afternoon trades shows a 41% win rate vs 64% overall. Consider avoiding new positions during this window.',
        eurUsdEdge: 'Based on 34 trades over 6 months. Average R:R of 1.8:1. This represents a significant edge worth exploiting.',
        riskManagement: 'Your average loss went from $87 to $117. Review your stop-loss placement and position sizing.',
        cryptoPotential: 'Consider increasing allocation to crypto markets where you demonstrate consistent edge.',
      },
      insightActions: {
        viewTradingFrequency: 'View Trading Frequency',
        analyzeFridayTrades: 'Analyze Friday Trades',
        viewStrategyDetails: 'View Strategy Details',
        reviewRiskSettings: 'Review Risk Settings',
        portfolioAnalysis: 'Portfolio Analysis',
      },
    },
    settings: {
      title: 'Settings',
      subtitle: 'Manage your account and preferences',
      profile: 'Profile',
      personalInfo: 'Your personal information',
      fullName: 'Full Name',
      yourName: 'Your name',
      email: 'Email',
      timezone: 'Timezone',
      currency: 'Currency',
      saveChanges: 'Save Changes',
      saveSuccess: 'Profile updated successfully',
      saving: 'Saving...',
      dataAndOnboarding: 'Data & Onboarding',
      notifications: 'Notifications',
      configureAlerts: 'Configure how you receive alerts',
      aiInsights: 'AI Insights',
      aiInsightsDesc: 'Get notified when new insights are available',
      tradeReminders: 'Trade Reminders',
      tradeRemindersDesc: 'Daily reminder to log your trades',
      weeklyReports: 'Weekly Reports',
      weeklyReportsDesc: 'Receive weekly performance summaries',
      overtradingAlerts: 'Overtrading Alerts',
      overtradingAlertsDesc: 'Get warned when trading too frequently',
      subscription: 'Subscription',
      managePlan: 'Manage your plan and billing',
      security: 'Security',
      protectAccount: 'Protect your account',
      twoFactor: 'Two-Factor Authentication',
      twoFactorDesc: 'Add an extra layer of security',
      changePassword: 'Change Password',
      changePasswordDesc: 'Update your password regularly',
      activeSessions: 'Active Sessions',
      activeSessionsDesc: 'Manage your logged in devices',
      viewAll: 'View All',
      dangerZone: 'Danger Zone',
      irreversibleActions: 'Irreversible actions',
      exportAllData: 'Export All Data',
      exportDataDesc: 'Download all your trades and settings',
      deleteAccount: 'Delete Account',
      deleteAccountDesc: 'Permanently delete your account and data',
      plans: {
        free: 'Free',
        freeDesc: 'Get started with basic trading journal',
        pro: 'Pro',
        proDesc: 'Advanced features for serious traders',
        power: 'Power',
        powerDesc: 'Full suite for professional traders',
        features: {
          tradesPerMonth: '50 trades/month',
          basicAnalytics: 'Basic analytics',
          psychologyTracking: 'Psychology tracking',
          dataRetention: '7-day data retention',
          unlimited: 'Unlimited trades',
          aiInsights: 'AI insights',
          advancedAnalytics: 'Advanced analytics',
          exportReports: 'Export reports',
          multipleAccounts: 'Multiple accounts',
          prioritySupport: 'Priority support',
          everythingInPro: 'Everything in Pro',
          backtesting: 'Backtesting module',
          apiAccess: 'API access',
          customIntegrations: 'Custom integrations',
          dedicatedSupport: 'Dedicated support',
          whiteLabel: 'White-label option',
        },
      },
      geolocation: {
        title: 'Location Detection',
        description: 'Use your location to automatically detect the appropriate language.',
        toggle: 'IP-based language detection',
        privacy: 'Privacy: We only detect your country (we do not store your IP). Results are saved locally for 7 days.',
        detected: 'Detected location',
        country: 'Country',
        city: 'City',
        language: 'Language',
        source: 'Service',
        detectNow: 'Detect now',
        clear: 'Clear cache',
      },
    },
    extra: {
      refresh: 'Refresh', undo: 'Undo', generate: 'Generate', preview: 'Preview',
      print: 'Print', share: 'Share', exportPdf: 'Export PDF', viewAll: 'View all',
      importHistoryTitle: 'Import history',
      noImportsYet: 'You have not imported any files yet.',
      loadHistoryError: 'Could not load import history',
      undoConfirm: 'Undo this import? The loaded trades will be removed.',
      removedTrades: 'Removed {n} trades',
      undoError: 'Could not undo the import',
      colDate: 'Date', colFile: 'File', colHash: 'Hash', colImported: 'Imported',
      colSkipped: 'Skipped', colStatus: 'Status', colActions: 'Actions',
      statusUndone: 'Undone', statusNotImported: 'Not imported',
      statusWithSkips: 'With skips', statusActive: 'Active',
      analyticsTab: 'Analytics', reportsTab: 'Reports',
      notEnoughData: 'Not enough data to show analysis',
      addTradesToSeeStats: 'Add trades in the journal to see statistics',
      startLoggingTrades: 'Start logging trades to receive insights',
      needFiveTrades: 'You need at least 5 trades for the AI to analyze your patterns',
      noInsightsYet: 'No insights available yet',
      insightsGeneratedAuto: 'Insights will be generated automatically as you log trades',
      aiInsightsTitle: 'AI Insights', poweredByML: 'Powered by machine learning',
      reportTypePlaceholder: 'Report type',
      weekly: 'Weekly', monthly: 'Monthly', quarterly: 'Quarterly', yearly: 'Yearly',
      generateReport: 'Generate Report',
      noDataReports: 'No data to generate reports',
      addTradesForReports: 'Add trades in the journal to generate performance reports',
      monthlyPerformanceReport: 'Monthly Performance Report', latest: 'Latest',
      generated: 'Generated',
      reportSections: 'Report Sections',
      executiveSummary: 'Executive Summary',
      executiveSummaryDesc: 'High-level overview of your trading performance',
      tradeAnalysis: 'Trade Analysis',
      tradeAnalysisDesc: 'Detailed breakdown of all trades with statistics',
      psychologyInsights: 'Psychology Insights',
      psychologyInsightsDesc: 'Emotional patterns and discipline tracking',
      exportOptions: 'Export Options',
      exportOptionsDesc: 'Choose the export format you prefer',
      pdfReport: 'PDF Report', pdfReportDesc: 'Full formatted report',
      csvData: 'CSV Data', csvDataDesc: 'Raw data export',
      shareLink: 'Share Link', shareLinkDesc: 'Generate a shareable report',
      totalPnl: 'Total P&L', winRate: 'Win Rate',
      totalTrades: 'Total Trades', profitFactor: 'Profit Factor',
      averageWin: 'Average Win', averageLoss: 'Average Loss',
      bestTrade: 'Best Trade', worstTrade: 'Worst Trade',
      detectedBroker: 'Detected broker', delimiter: 'Delimiter', duplicates: 'Duplicates',
      fileLabel: 'File', brokerLabel: 'Broker', tradesLabel: 'Trades',
      ignored: 'Ignored', missing: 'Missing', unmapped: 'Unmapped',
      symbol: 'Symbol', direction: 'Direction', entryCol: 'Entry', exitCol: 'Exit',
      volume: 'Volume', dateCol: 'Date', sourceCol: 'Source',
    },
  },
  PT: {
    common: {
      save: 'Salvar',
      cancel: 'Cancelar',
      delete: 'Excluir',
      edit: 'Editar',
      view: 'Ver',
      add: 'Adicionar',
      search: 'Pesquisar',
      filter: 'Filtrar',
      loading: 'Carregando...',
      noResults: 'Sem resultados',
      pending: 'Pendentes',
      completed: 'Concluído',
      inProgress: 'Em Progresso',
      all: 'Todos',
      new: 'NOVO',
      dismiss: 'Dispensar',
      enable: 'Habilitar',
      change: 'Alterar',
      export: 'Exportar',
      upgrade: 'Atualizar',
      currentPlan: 'Plano Atual',
      mostPopular: 'Mais Popular',
      excellent: 'Excelente',
      good: 'Bom',
      improvable: 'Melhorável',
    },
    nav: {
      dashboard: 'Painel de Controle',
      journal: 'Registro de Operações',
      analytics: 'Centro de Análise',
      psychology: 'Métricas Comportamentais',
      insights: 'Motor de Insights',
      settings: 'Configurações',
      logout: 'Sair',
      reports: 'Relatórios',
    },
    topbar: {
      title: 'Trading Software',
      myAccount: 'Minha Conta',
      profile: 'Perfil',
      billing: 'Faturamento',
      settings: 'Configurações',
      signOut: 'Sair',
      defaultTraderName: 'Trader',
      accountsCenter: 'Central de contas',
    },
    auth: {
      welcome: 'Bem-vindo ao Mind On',
      subtitle: 'Acesse sua plataforma de inteligência de trading',
      signIn: 'Entrar',
      signUp: 'Registrar',
      email: 'E-mail',
      password: 'Senha',
      fullName: 'Nome completo',
      signingIn: 'Entrando...',
      creatingAccount: 'Criando conta...',
      createAccount: 'Criar Conta',
      termsNotice: 'Ao se registrar, você concorda com nossos Termos de Serviço e Política de Privacidade',
      errorSignIn: 'Erro ao entrar',
      errorSignUp: 'Erro ao criar conta',
      welcomeBack: 'Bem-vindo de volta!',
      accountCreated: 'Conta criada!',
      welcomeToApp: 'Bem-vindo ao Mind On!',
      headline: 'Opere com mais inteligência usando insights',
      headlineHighlight: 'alimentados por IA',
      subheadline: 'Junte-se a milhares de traders que usam Mind On para rastrear, analisar e melhorar seu desempenho.',
      features: {
        analytics: 'Análises Avançadas',
        analyticsDesc: 'Insights profundos do seu desempenho',
        ai: 'Insights de IA',
        aiDesc: 'Machine learning detecta padrões',
        equity: 'Curva de Patrimônio',
        equityDesc: 'Visualize seu crescimento',
        psychology: 'Psicologia do Trading',
        psychologyDesc: 'Domine sua mentalidade',
      },
      stats: {
        activeTraders: 'Traders ativos',
        analyzedTrades: 'Trades analisados',
        satisfaction: 'Satisfação',
      },
    },
    dashboard: {
      mentalState: 'Estado Operacional',
      goodMorning: 'Bom dia',
      goodAfternoon: 'Boa tarde',
      goodEvening: 'Boa noite',
      recentActivity: 'Atividade Recente',
      completeCheckIn: 'Complete seu check-in pré-mercado para começar.',
      completeCheckInCTA: 'Fazer Check-in',
      planActive: 'Seu plano de hoje está ativo. Mantenha a disciplina.',
      mentalStateTitle: 'Estado Mental',
      disciplineTopTier: 'Mantenha este nível de disciplina. Você está no Top 10% dos traders.',
      disciplineImprovement: 'Pequenos ajustes na sua rotina podem melhorar sua pontuação. Revise seu check-in.',
      viewFullAnalysis: 'Ver Análise Completa',
      recentTradesTitle: 'Operações Recentes',
      recentTradesSubtitle: 'Sua atividade de trading mais recente',
      viewAll: 'Ver tudo',
      quickActionNewTrade: 'Nova Operação',
      quickActionJournal: 'Meu Diário',
      quickActionCheckIn: 'Check-in',
      quickActionAnalytics: 'Análises',
      discipline: 'Índice de Disciplina',
      insightOfDay: 'Insight do Dia',
      tiltAlert: 'Alerta de Risco Comportamental',
      tiltDescription: 'O sistema detectou sessões com múltiplas perdas consecutivas. Isso indica um padrão de risco emocional.',
      tiltAdvice: 'Protocolo recomendado: Pausar operações após 2 perdas consecutivas.',
      ritualCompleted: 'Protocolo Concluído',
      comeBackTomorrow: 'Volte amanhã para uma nova análise.',
      dailyStreak: 'Sequência de Consistência',
      weeklySummary: 'Relatório Semanal',
      bestDay: 'Melhor dia',
      noTrades: 'Sem operações registradas.',
      patienceMessage: 'A paciência é parte do processo.',
      capitalRisk: 'Gestão de Capital',
      accountBalance: 'Saldo do Portfólio',
      operativePerformance: 'Métricas de Desempenho',
      totalTrades: 'Operações Totais',
      closed: 'Executadas',
      equityCurve: 'Curva de Capital',
      preMarketProtocol: 'Protocolo Pré-Mercado',
      newProtocolItem: 'Novo item de protocolo...',
      emptyList: 'Lista vazia',
      aiFree: 'Sem IA',
      editBalance: 'Editar Capital',
      accountSetup: 'Configurar Portfólio',
      initialBalance: 'Capital Inicial',
      currentBalance: 'Capital Atual',
      accountName: 'Nome do Portfólio',
      broker: 'Corretora',
      saveAccount: 'Salvar Configuração',
      createAccount: 'Criar Portfólio',
      noAccountYet: 'Sem portfólio configurado',
      clickToSetup: 'Configurar agora',
      portfolioValue: 'Valor do Portfólio',
    },
    disciplineMetrics: {
      streak3Days: 'Consistência 3 Dias',
      streak3DaysDesc: '3 dias de protocolo completado.',
      weeklyTarget: 'Meta Semanal',
      analyticalMindset: 'Foco Analítico',
      operationalConsistency: 'Consistência Operacional',
      operationalConsistencyDesc: 'Operou 3+ dias esta semana.',
    },
    journal: {
      title: 'Diário de Operações',
      subtitle: 'Rastreie e analise suas operações',
      addTrade: 'Adicionar Operação',
      addNewTrade: 'Adicionar Nova Operação',
      logNewTrade: 'Registre uma nova operação no seu diário',
      totalTrades: 'Total de Operações',
      winRate: 'Taxa de Acerto',
      totalPnl: 'P&L Total',
      searchSymbol: 'Pesquisar por símbolo...',
      filterStatus: 'Filtrar por status',
      allTrades: 'Todas as Operações',
      open: 'Aberta',
      symbol: 'Símbolo',
      direction: 'Direção',
      selectDirection: 'Selecionar direção',
      long: 'Compra',
      short: 'Venda',
      entryPrice: 'Preço de Entrada',
      exitPrice: 'Preço de Saída',
      quantity: 'Quantidade',
      stopLoss: 'Stop Loss',
      stopSize: 'Tamanho do Stop',
      stopSizeHint: 'Quanto dinheiro está disposto a perder se o stop for atingido',
      resultSection: 'Resultado da operação',
      pnlManual: 'Resultado (P&L)',
      pnlPercentManual: 'Resultado %',
      pnlHint: 'Digite o ganho ou perda real da operação (negativo = perda)',
      pnlRequired: 'Informe o resultado da operação fechada',
      attachImage: 'Captura / Imagem',
      attachImageHint: 'PNG, JPG, WEBP ou GIF — máx. 5MB',
      removeImage: 'Remover imagem',
      imageUploadFailed: 'A operação foi salva, mas a imagem não pôde ser enviada.',
      risk: 'Risco',
      takeProfit: 'Take Profit',
      strategy: 'Estratégia',
      entryDate: 'Data de Entrada',
      notes: 'Notas',
      addNotesPlaceholder: 'Adicione notas sobre esta operação...',
      noTradesFound: 'Nenhuma operação encontrada',
      addFirstTrade: 'Adicione sua primeira operação',
      viewDetails: 'Ver Detalhes',
      editTrade: 'Editar Operação',
      addScreenshot: 'Adicionar Captura',
      entry: 'Entrada',
      exit: 'Saída',
      export: 'Exportar',
      exportSuccess: 'Exportado para {format} com sucesso',
      exportError: 'Falha ao exportar',
      import: 'Importar',
      importFile: 'Importar Arquivo',
      importSuccess: 'Arquivo importado com sucesso',
      importError: 'Erro ao importar arquivo',
      tradesImported: '{count} operações importadas',
      selectFile: 'Selecionar arquivo',
      supportedFormats: 'Formatos suportados: CSV, Excel (.xlsx)',
      optional: 'opcional',
      closedStatus: 'Fechada',
      openStatus: 'Aberta',
      tradeStatus: 'Estado',
      openDateTime: 'Data/Hora de Abertura',
      closeDateTime: 'Data/Hora de Fechamento',
      commission: 'Comissão',
      pnlEstimated: 'P&L Estimado',
      openPositions: 'Posições Abertas',
      importEmptyHint: 'Importe um arquivo CSV/Excel ou adicione sua primeira operação para começar.',
      loadingTrades: 'Carregando operações...',
      closed: 'Fechada',
      duplicateFileTitle: 'Arquivo duplicado detectado',
      duplicateFileBody: 'Este arquivo já foi importado como "{name}" em {date}. Trouxe {count} operação(ões).',
      duplicateFileHint: 'Para enviá-lo novamente, desfaça a importação anterior primeiro.',
      duplicateFileUnderstood: 'Entendido',
      duplicateFileUndo: 'Desfazer último processo',
      wizardStep1Title: 'Detalhes de Entrada',
      wizardStep2Title: 'Gestão e Saída',
      wizardStep1Subtitle: '1/2 Detalhes de Entrada',
      wizardStep2Subtitle: '2/2 Gestão e Saída',
      next: 'Próximo',
      previous: 'Anterior',
      registerTrade: 'Registrar Operação',
    },
    analytics: {
      title: 'Análises',
      subtitle: 'Análise aprofundada do seu desempenho em trading',
      last30Days: 'Últimos 30 Dias',
      last90Days: 'Últimos 90 Dias',
      sixMonths: '6 Meses',
      allTime: 'Todo o Período',
      totalPnl: 'P&L Total',
      winRate: 'Taxa de Acerto',
      profitFactor: 'Fator de Lucro',
      totalTrades: 'Total de Operações',
      monthlyPnl: 'P&L Mensal',
      monthlyPnlDesc: 'Lucros e perdas por mês',
      winLossRatio: 'Razão Ganho/Perda',
      distributionOutcomes: 'Distribuição de resultados',
      winning: 'Ganhos',
      losing: 'Perdas',
      weekdayPerformance: 'Desempenho por Dia',
      winRateByDay: 'Taxa de acerto por dia da semana',
      timeAnalysis: 'Análise por Horário',
      bestTradingHours: 'Melhores horários de trading',
      assetDistribution: 'Distribuição por Ativo',
      breakdownByMarket: 'Detalhamento por mercado',
      trades: 'operações',
    },
    psychology: {
      title: 'Rastreador Psicológico',
      subtitle: 'Monitore sua mentalidade e emoções de trading',
      errorTaxometer: 'Taxímetro de Erros',
      loading: 'Carregando…',
      noErrorsRegistered: 'Sem erros registrados — continue assim.',
      totalLost: 'Total perdido',
      thisWeek: 'Esta semana',
      viewDetail: 'Ver detalhes',
      newEntry: 'Nova Entrada',
      avgDiscipline: 'Disciplina Média',
      rulesFollowed: 'Regras Seguidas',
      avgSleep: 'Sono Médio',
      entriesThisWeek: 'Entradas Esta Semana',
      todaysCheckin: 'Check-in de Hoje',
      howAreYou: 'Como você está se sentindo hoje?',
      currentEmotion: 'Emoção Atual',
      disciplineScore: 'Pontuação de Disciplina',
      sleepQuality: 'Qualidade do Sono',
      stressLevel: 'Nível de Estresse',
      lessonsLearned: 'Lições Aprendidas',
      whatDidYouLearn: 'O que você aprendeu hoje?',
      saveEntry: 'Salvar Entrada',
      recentEntries: 'Entradas Recentes',
      journalHistory: 'Histórico do seu diário psicológico',
      currentStreak: 'Sequência atual',
      bestStreak: 'Melhor sequência',
      weekly: 'Semanal',
      monthly: 'Mensal',
      completion: 'Cumprimento',
      completedCheckins: 'check-ins concluídos',
      daysUnit: 'dias',
      periodGoal: 'Meta do período',
      weeklyGoal: 'Meta semanal',
      monthlyGoal: 'Meta mensal',
      goalReached: 'Meta cumprida',
      remainingCheckins: 'check-ins restantes',
      goalAtRisk: 'Meta em risco',
      goalProgress: 'Progresso vs meta',

      emotions: {
        confident: 'Confiante',
        calm: 'Calmo',
        neutral: 'Neutro',
        excited: 'Animado',
        anxious: 'Ansioso',
        fearful: 'Temeroso',
        greedy: 'Ganancioso',
        frustrated: 'Frustrado',
        fomo: 'FOMO',
        vengeful: 'Vingativo',
      },
    },
    insights: {
      title: 'Insights de IA',
      subtitle: 'Análise de machine learning dos seus padrões de trading',
      poweredByAI: 'Alimentado por IA',
      refreshAnalysis: 'Atualizar Análise',
      patternsDetected: 'Padrões Detectados',
      edgesFound: 'Vantagens Encontradas',
      warnings: 'Avisos',
      actionsTaken: 'Ações Tomadas',
      allInsights: 'Todos os Insights',
      overtrading: 'Overtrading',
      patterns: 'Padrões',
      edges: 'Vantagens',
      newInsights: 'Novos Insights',
      aiConfidence: 'Confiança da IA',
      aiCapabilities: 'Capacidades da IA',
      whatAiAnalyzes: 'O que nosso motor de IA analisa',
      overtradingDetection: 'Detecção de Overtrading',
      overtradingDesc: 'Monitora frequência e qualidade das operações',
      patternRecognition: 'Reconhecimento de Padrões',
      patternDesc: 'Encontra erros e padrões recorrentes',
      edgeDiscovery: 'Descoberta de Vantagens',
      edgeDesc: 'Identifica vantagens estatísticas',
      riskAnalysis: 'Análise de Risco',
      riskDesc: 'Monitora comportamento de gestão de risco',
      timeAnalysis: 'Análise Temporal',
      timeDesc: 'Melhores e piores horários de trading',
      psychologyCorrelation: 'Correlação Psicológica',
      psychologyDesc: 'Vincula emoções ao desempenho',
      insightTitles: {
        overtradingAlert: 'Alerta de Overtrading',
        fridayPattern: 'Padrão de Perda Recorrente: Sexta Tarde',
        eurUsdEdge: 'Vantagem Estatística: EUR/USD Sessão Londres',
        riskManagement: 'Problema de Gestão de Risco',
        cryptoPotential: 'Potencial Inexplorado: Mercados Crypto',
      },
      insightDescriptions: {
        overtradingAlert: 'Você fez 15 operações esta semana, 67% acima da sua média de 6 meses de 9 operações.',
        fridayPattern: 'Suas operações às sextas após 14:00 mostram 23% menos taxa de acerto.',
        eurUsdEdge: 'Posições longas durante a sessão de Londres (08:00-10:00 GMT) mostram 73% de taxa de acerto.',
        riskManagement: 'O tamanho médio de perda aumentou 34% este mês comparado ao mês passado.',
        cryptoPotential: 'Suas operações em crypto mostram 78% de taxa de acerto mas representam apenas 12% do seu portfólio.',
      },
      insightDetails: {
        overtradingAlert: 'Dados históricos mostram que sua taxa de acerto cai 18% quando opera mais de 12 vezes por semana. Considere reduzir.',
        fridayPattern: 'Análise de 47 operações sexta tarde mostra 41% taxa de acerto vs 64% geral. Considere evitar novas posições nesta janela.',
        eurUsdEdge: 'Baseado em 34 operações em 6 meses. R:R médio de 1.8:1. Isso representa uma vantagem significativa.',
        riskManagement: 'Sua perda média foi de $87 para $117. Revise a colocação de stop-loss e tamanho de posição.',
        cryptoPotential: 'Considere aumentar a alocação para mercados crypto onde você demonstra vantagem consistente.',
      },
      insightActions: {
        viewTradingFrequency: 'Ver Frequência de Trading',
        analyzeFridayTrades: 'Analisar Operações Sexta',
        viewStrategyDetails: 'Ver Detalhes da Estratégia',
        reviewRiskSettings: 'Revisar Configurações de Risco',
        portfolioAnalysis: 'Análise de Portfólio',
      },
    },
    settings: {
      title: 'Configurações',
      subtitle: 'Gerencie sua conta e preferências',
      profile: 'Perfil',
      personalInfo: 'Suas informações pessoais',
      fullName: 'Nome Completo',
      yourName: 'Seu nome',
      email: 'E-mail',
      timezone: 'Fuso Horário',
      currency: 'Moeda',
      saveChanges: 'Salvar Alterações',
      saveSuccess: 'Perfil atualizado com sucesso',
      saving: 'Salvando...',
      dataAndOnboarding: 'Dados e Onboarding',
      notifications: 'Notificações',
      configureAlerts: 'Configure como você recebe alertas',
      aiInsights: 'Insights de IA',
      aiInsightsDesc: 'Seja notificado quando novos insights estiverem disponíveis',
      tradeReminders: 'Lembretes de Operações',
      tradeRemindersDesc: 'Lembrete diário para registrar suas operações',
      weeklyReports: 'Relatórios Semanais',
      weeklyReportsDesc: 'Receba resumos de desempenho semanais',
      overtradingAlerts: 'Alertas de Overtrading',
      overtradingAlertsDesc: 'Seja avisado quando operar muito frequentemente',
      subscription: 'Assinatura',
      managePlan: 'Gerencie seu plano e faturamento',
      security: 'Segurança',
      protectAccount: 'Proteja sua conta',
      twoFactor: 'Autenticação de Dois Fatores',
      twoFactorDesc: 'Adicione uma camada extra de segurança',
      changePassword: 'Alterar Senha',
      changePasswordDesc: 'Atualize sua senha regularmente',
      activeSessions: 'Sessões Ativas',
      activeSessionsDesc: 'Gerencie seus dispositivos conectados',
      viewAll: 'Ver Todos',
      dangerZone: 'Zona de Perigo',
      irreversibleActions: 'Ações irreversíveis',
      exportAllData: 'Exportar Todos os Dados',
      exportDataDesc: 'Baixe todas as suas operações e configurações',
      deleteAccount: 'Excluir Conta',
      deleteAccountDesc: 'Excluir permanentemente sua conta e dados',
      plans: {
        free: 'Grátis',
        freeDesc: 'Comece com diário de trading básico',
        pro: 'Pro',
        proDesc: 'Recursos avançados para traders sérios',
        power: 'Power',
        powerDesc: 'Suite completa para traders profissionais',
        features: {
          tradesPerMonth: '50 operações/mês',
          basicAnalytics: 'Análises básicas',
          psychologyTracking: 'Rastreamento psicológico',
          dataRetention: 'Retenção de dados de 7 dias',
          unlimited: 'Operações ilimitadas',
          aiInsights: 'Insights de IA',
          advancedAnalytics: 'Análises avançadas',
          exportReports: 'Exportar relatórios',
          multipleAccounts: 'Múltiplas contas',
          prioritySupport: 'Suporte prioritário',
          everythingInPro: 'Tudo no Pro',
          backtesting: 'Módulo de backtesting',
          apiAccess: 'Acesso API',
          customIntegrations: 'Integrações personalizadas',
          dedicatedSupport: 'Suporte dedicado',
          whiteLabel: 'Opção white-label',
        },
      },
      geolocation: {
        title: 'Detecção de Localização',
        description: 'Use sua localização para detectar automaticamente o idioma apropriado.',
        toggle: 'Detecção de idioma por IP',
        privacy: 'Privacidade: Apenas detectamos seu país (não armazenamos seu IP). Os resultados são salvos localmente por 7 dias.',
        detected: 'Localização detectada',
        country: 'País',
        city: 'Cidade',
        language: 'Idioma',
        source: 'Serviço',
        detectNow: 'Detectar agora',
        clear: 'Limpar cache',
      },
    },
    extra: {
      refresh: 'Atualizar', undo: 'Desfazer', generate: 'Gerar', preview: 'Visualizar',
      print: 'Imprimir', share: 'Compartilhar', exportPdf: 'Exportar PDF', viewAll: 'Ver todos',
      importHistoryTitle: 'Histórico de importações',
      noImportsYet: 'Você ainda não importou arquivos.',
      loadHistoryError: 'Não foi possível carregar o histórico de importações',
      undoConfirm: 'Desfazer esta importação? As operações carregadas serão removidas.',
      removedTrades: '{n} operações removidas',
      undoError: 'Não foi possível desfazer a importação',
      colDate: 'Data', colFile: 'Arquivo', colHash: 'Hash', colImported: 'Importadas',
      colSkipped: 'Ignoradas', colStatus: 'Status', colActions: 'Ações',
      statusUndone: 'Desfeito', statusNotImported: 'Não importado',
      statusWithSkips: 'Com omissões', statusActive: 'Ativo',
      analyticsTab: 'Analítica', reportsTab: 'Relatórios',
      notEnoughData: 'Sem dados suficientes para mostrar análise',
      addTradesToSeeStats: 'Adicione operações no diário para ver estatísticas',
      startLoggingTrades: 'Comece a registrar operações para receber insights',
      needFiveTrades: 'Você precisa de pelo menos 5 operações para a IA analisar seus padrões',
      noInsightsYet: 'Ainda não há insights disponíveis',
      insightsGeneratedAuto: 'Os insights serão gerados automaticamente conforme você registrar operações',
      aiInsightsTitle: 'Insights de IA', poweredByML: 'Impulsionado por machine learning',
      reportTypePlaceholder: 'Tipo de relatório',
      weekly: 'Semanal', monthly: 'Mensal', quarterly: 'Trimestral', yearly: 'Anual',
      generateReport: 'Gerar Relatório',
      noDataReports: 'Sem dados para gerar relatórios',
      addTradesForReports: 'Adicione operações no diário para gerar relatórios de desempenho',
      monthlyPerformanceReport: 'Relatório de Desempenho Mensal', latest: 'Mais recente',
      generated: 'Gerado',
      reportSections: 'Seções do relatório',
      executiveSummary: 'Resumo executivo',
      executiveSummaryDesc: 'Visão geral do seu desempenho de trading',
      tradeAnalysis: 'Análise de operações',
      tradeAnalysisDesc: 'Detalhamento completo de todas as operações com estatísticas',
      psychologyInsights: 'Insights de psicologia',
      psychologyInsightsDesc: 'Padrões emocionais e acompanhamento de disciplina',
      exportOptions: 'Opções de Exportação',
      exportOptionsDesc: 'Escolha o formato de exportação que preferir',
      pdfReport: 'Relatório PDF', pdfReportDesc: 'Relatório completo formatado',
      csvData: 'Dados CSV', csvDataDesc: 'Exportação de dados brutos',
      shareLink: 'Link para compartilhar', shareLinkDesc: 'Gerar relatório compartilhável',
      totalPnl: 'P&L Total', winRate: 'Taxa de acerto',
      totalTrades: 'Operações totais', profitFactor: 'Fator de lucro',
      averageWin: 'Ganho médio', averageLoss: 'Perda média',
      bestTrade: 'Melhor operação', worstTrade: 'Pior operação',
      detectedBroker: 'Corretora detectada', delimiter: 'Delimitador', duplicates: 'Duplicados',
      fileLabel: 'Arquivo', brokerLabel: 'Corretora', tradesLabel: 'Operações',
      ignored: 'Ignoradas', missing: 'Faltantes', unmapped: 'Não mapeadas',
      symbol: 'Símbolo', direction: 'Direção', entryCol: 'Entrada', exitCol: 'Saída',
      volume: 'Volume', dateCol: 'Data', sourceCol: 'Origem',
    },
  },
};

export const translations: Record<Language, Translations> = baseTranslations;
