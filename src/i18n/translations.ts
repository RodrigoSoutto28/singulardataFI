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
  };

  // TopBar
  topbar: {
    title: string;
    myAccount: string;
    profile: string;
    billing: string;
    settings: string;
    signOut: string;
  };

  // Dashboard
  dashboard: {
    mentalState: string;
    discipline: string;
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
    dailyTasks: string;
    newTask: string;
    emptyList: string;
    aiFree: string;
  };

  // Achievements
  achievements: {
    streak3Days: string;
    streak3DaysDesc: string;
    weekOfFire: string;
    reflective: string;
    consistentOperator: string;
    consistentOperatorDesc: string;
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
    emotions: {
      confident: string;
      calm: string;
      neutral: string;
      excited: string;
      anxious: string;
      fearful: string;
      greedy: string;
      frustrated: string;
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
  };
}

export const translations: Record<Language, Translations> = {
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
    },
    nav: {
      dashboard: 'Dashboard',
      journal: 'Diario',
      analytics: 'Analítica',
      psychology: 'Psicología',
      insights: 'Insights',
      settings: 'Configuración',
      logout: 'Cerrar Sesión',
    },
    topbar: {
      title: 'Analítica - Trading Journal & Analytics',
      myAccount: 'Mi Cuenta',
      profile: 'Perfil',
      billing: 'Facturación',
      settings: 'Configuración',
      signOut: 'Cerrar sesión',
    },
    dashboard: {
      mentalState: 'Tu Estado Mental',
      discipline: 'Disciplina',
      insightOfDay: 'Insight del Día',
      tiltAlert: 'Alerta de Tilt Detectada',
      tiltDescription: 'El sistema ha detectado sesiones con múltiples pérdidas consecutivas. Esto suele indicar pérdida de control emocional.',
      tiltAdvice: 'Si pierdes 2 operaciones seguidas hoy, cierra la plataforma inmediatamente.',
      ritualCompleted: 'Ritual Completado',
      comeBackTomorrow: 'Vuelve mañana para un nuevo análisis.',
      dailyStreak: 'Racha Diaria',
      weeklySummary: 'Resumen Semanal',
      bestDay: 'Mejor día',
      noTrades: 'Sin operaciones aún.',
      patienceMessage: 'La paciencia también es una posición.',
      capitalRisk: 'Capital & Riesgo',
      accountBalance: 'Balance de Cuenta',
      operativePerformance: 'Rendimiento Operativo',
      totalTrades: 'Total Trades',
      closed: 'Cerrados',
      equityCurve: 'Curva de Equidad',
      dailyTasks: 'Tareas del Día',
      newTask: 'Nueva tarea...',
      emptyList: 'Lista vacía',
      aiFree: 'AI-Free',
    },
    achievements: {
      streak3Days: 'Racha de 3 Días',
      streak3DaysDesc: '3 días seguidos de ritual.',
      weekOfFire: 'Semana de Fuego',
      reflective: 'Reflexivo',
      consistentOperator: 'Operador Constante',
      consistentOperatorDesc: 'Operaste 3+ días esta semana.',
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
      emotions: {
        confident: 'Confiado',
        calm: 'Calmado',
        neutral: 'Neutral',
        excited: 'Emocionado',
        anxious: 'Ansioso',
        fearful: 'Temeroso',
        greedy: 'Codicioso',
        frustrated: 'Frustrado',
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
    },
    nav: {
      dashboard: 'Dashboard',
      journal: 'Journal',
      analytics: 'Analytics',
      psychology: 'Psychology',
      insights: 'Insights',
      settings: 'Settings',
      logout: 'Logout',
    },
    topbar: {
      title: 'Analytics - Trading Journal & Analytics',
      myAccount: 'My Account',
      profile: 'Profile',
      billing: 'Billing',
      settings: 'Settings',
      signOut: 'Sign out',
    },
    dashboard: {
      mentalState: 'Your Mental State',
      discipline: 'Discipline',
      insightOfDay: 'Insight of the Day',
      tiltAlert: 'Tilt Alert Detected',
      tiltDescription: 'The system has detected sessions with multiple consecutive losses. This usually indicates loss of emotional control.',
      tiltAdvice: 'If you lose 2 consecutive trades today, close the platform immediately.',
      ritualCompleted: 'Ritual Completed',
      comeBackTomorrow: 'Come back tomorrow for a new analysis.',
      dailyStreak: 'Daily Streak',
      weeklySummary: 'Weekly Summary',
      bestDay: 'Best day',
      noTrades: 'No trades yet.',
      patienceMessage: 'Patience is also a position.',
      capitalRisk: 'Capital & Risk',
      accountBalance: 'Account Balance',
      operativePerformance: 'Operative Performance',
      totalTrades: 'Total Trades',
      closed: 'Closed',
      equityCurve: 'Equity Curve',
      dailyTasks: 'Daily Tasks',
      newTask: 'New task...',
      emptyList: 'Empty list',
      aiFree: 'AI-Free',
    },
    achievements: {
      streak3Days: '3-Day Streak',
      streak3DaysDesc: '3 consecutive days of ritual.',
      weekOfFire: 'Week of Fire',
      reflective: 'Reflective',
      consistentOperator: 'Consistent Operator',
      consistentOperatorDesc: 'Traded 3+ days this week.',
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
      emotions: {
        confident: 'Confident',
        calm: 'Calm',
        neutral: 'Neutral',
        excited: 'Excited',
        anxious: 'Anxious',
        fearful: 'Fearful',
        greedy: 'Greedy',
        frustrated: 'Frustrated',
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
    },
    nav: {
      dashboard: 'Painel',
      journal: 'Diário',
      analytics: 'Análises',
      psychology: 'Psicologia',
      insights: 'Insights',
      settings: 'Configurações',
      logout: 'Sair',
    },
    topbar: {
      title: 'Análises - Trading Journal & Analytics',
      myAccount: 'Minha Conta',
      profile: 'Perfil',
      billing: 'Faturamento',
      settings: 'Configurações',
      signOut: 'Sair',
    },
    dashboard: {
      mentalState: 'Seu Estado Mental',
      discipline: 'Disciplina',
      insightOfDay: 'Insight do Dia',
      tiltAlert: 'Alerta de Tilt Detectado',
      tiltDescription: 'O sistema detectou sessões com múltiplas perdas consecutivas. Isso geralmente indica perda de controle emocional.',
      tiltAdvice: 'Se você perder 2 operações seguidas hoje, feche a plataforma imediatamente.',
      ritualCompleted: 'Ritual Concluído',
      comeBackTomorrow: 'Volte amanhã para uma nova análise.',
      dailyStreak: 'Sequência Diária',
      weeklySummary: 'Resumo Semanal',
      bestDay: 'Melhor dia',
      noTrades: 'Sem operações ainda.',
      patienceMessage: 'A paciência também é uma posição.',
      capitalRisk: 'Capital & Risco',
      accountBalance: 'Saldo da Conta',
      operativePerformance: 'Desempenho Operacional',
      totalTrades: 'Total de Trades',
      closed: 'Fechados',
      equityCurve: 'Curva de Patrimônio',
      dailyTasks: 'Tarefas do Dia',
      newTask: 'Nova tarefa...',
      emptyList: 'Lista vazia',
      aiFree: 'Sem IA',
    },
    achievements: {
      streak3Days: 'Sequência de 3 Dias',
      streak3DaysDesc: '3 dias consecutivos de ritual.',
      weekOfFire: 'Semana de Fogo',
      reflective: 'Reflexivo',
      consistentOperator: 'Operador Consistente',
      consistentOperatorDesc: 'Operou 3+ dias esta semana.',
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
      emotions: {
        confident: 'Confiante',
        calm: 'Calmo',
        neutral: 'Neutro',
        excited: 'Animado',
        anxious: 'Ansioso',
        fearful: 'Temeroso',
        greedy: 'Ganancioso',
        frustrated: 'Frustrado',
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
    },
  },
};
