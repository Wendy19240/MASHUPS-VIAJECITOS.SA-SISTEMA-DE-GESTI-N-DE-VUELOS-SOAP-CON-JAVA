import { StyleSheet, Platform } from 'react-native';

// Colores principales de la aplicación
const colors = {
  primary: '#35798e',
  primaryDark: '#2f6476',
  secondary: '#4e88a9',
  success: '#27ae60',
  warning: '#f39c12',
  danger: '#e74c3c',
  info: '#3498db',
  light: '#f8f9fa',
  dark: '#212529',
  gray: '#6c757d',
  grayLight: '#e9ecef',
  grayDark: '#495057',
  white: '#ffffff',
  background: '#f8f9fa',
  border: '#e0e0e0',
  borderLight: '#dee2e6',
  cardBg: '#ffffff',
  tableHeaderBg: '#35798e',
  tableRowEven: '#f8f9fa',
  modalOverlay: 'rgba(0,0,0,0.5)',
  amortModalOverlay: 'rgba(0,0,0,0.6)',
  highlightBg: '#e8f4f8',
  warningBg: '#fff3cd',
  warningBorder: '#ffeaa7',
  warningText: '#856404',
};

// Dimensiones y espaciados comunes
const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 30,
};

// Tamaños de fuente
const fontSize = {
  xs: 12,
  sm: 13,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 26,
  title: 28,
  titleLarge: 36,
};

// Sombras comunes
const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
  },
};

const styles = StyleSheet.create({
  // ============= CONTENEDORES PRINCIPALES =============
  safeArea: { 
    flex: 1, 
    backgroundColor: colors.background,
  },
  
  container: { 
    flex: 1,
  },
  
  // ============= ENCABEZADOS =============
  header: {
    fontSize: fontSize.title,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  
  headerLarge: {
    fontSize: fontSize.titleLarge,
    marginVertical: spacing.xxxl,
  },
  
  // ============= ESTADOS DE CARGA =============
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
  },
  
  loadingText: {
    fontSize: fontSize.lg,
    color: colors.gray,
    textAlign: 'center',
  },
  
  loadingModal: {
    alignItems: 'center',
    padding: spacing.xxxl + 10,
    gap: spacing.lg,
  },
  
  loadingModalText: {
    fontSize: fontSize.lg,
    color: colors.gray,
  },
  
  // ============= LISTAS Y GRIDS =============
  listContainer: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  
  listContainerLarge: {
    padding: spacing.xxl,
    gap: spacing.lg,
  },
  
  row: {
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  
  // ============= TARJETAS =============
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.md,
  },
  
  cardLarge: {
    padding: spacing.xl,
    borderRadius: 16,
  },
  
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.primary,
    flex: 1,
  },
  
  cardTitleLarge: {
    fontSize: fontSize.xl,
  },
  
  badge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 10,
    minWidth: 30,
    alignItems: 'center',
  },
  
  badgeText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: fontSize.xs,
  },
  
  cardContent: {
    gap: spacing.sm,
  },
  
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  label: { 
    fontSize: fontSize.md,
    color: '#555',
    flex: 1,
  },
  
  labelLarge: {
    fontSize: fontSize.lg,
  },
  
  value: { 
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.dark,
    textAlign: 'right',
    flex: 1,
  },
  
  valueLarge: {
    fontSize: fontSize.lg,
  },
  
  priceValue: { 
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.success,
    textAlign: 'right',
    flex: 1,
  },
  
  priceValueLarge: {
    fontSize: fontSize.xl,
  },
  
  // ============= TABLA PRINCIPAL =============
  tableWrapper: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  
  tableContainer: {
    width: '100%',
    maxWidth: 900,
    borderRadius: 12,
    backgroundColor: colors.cardBg,
    position: 'relative',
    ...shadows.md,
  },
  
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.tableHeaderBg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  
  tableHeaderFixed: {
    flexDirection: 'row',
    backgroundColor: colors.tableHeaderBg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.primaryDark,
    ...(Platform.OS === 'web' && {
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }),
  },
  
  tableBodyContainer: {
    flexGrow: 1,
  },
  
  tableScrollContainer: {
    overflow: 'hidden',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: colors.white,
    ...(Platform.OS === 'web' && {
      overflow: 'auto',
      overflowY: 'scroll',
      overflowX: 'hidden',
      // Estilos personalizados para scrollbar en web
      '&::-webkit-scrollbar': {
        width: 14,
        display: 'block !important',
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: '#f1f1f1',
        borderRadius: 0,
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: colors.secondary,
        borderRadius: 7,
        border: '2px solid #f1f1f1',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        backgroundColor: colors.primary,
      },
    }),
  },
  
  tableColHeader: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: fontSize.lg,
    textAlign: 'center',
  },
  
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight,
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      '&:hover': {
        backgroundColor: colors.highlightBg,
      },
    }),
  },
  
  tableRowEven: {
    backgroundColor: colors.tableRowEven,
  },
  
  tableRowLast: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  
  tableCol: {
    fontSize: fontSize.md,
    color: colors.dark,
    textAlign: 'center',
  },
  
  tableColNum: {
    flex: 0.8,
    minWidth: 40,
  },
  
  tableColFactura: {
    flex: 2.5,
    minWidth: 120,
    fontWeight: '600',
  },
  
  tableColFecha: {
    flex: 3,
    minWidth: 140,
  },
  
  tableColTotal: {
    flex: 1.7,
    minWidth: 80,
    fontWeight: 'bold',
    color: colors.success,
  },
  
  // ============= MODAL PRINCIPAL =============
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.modalOverlay,
  },
  
  modalContent: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    maxWidth: 1000,
    margin: spacing.xl,
    overflow: 'hidden', // Importante para el scroll
  },
  
  modalScrollContent: {
    padding: spacing.xl,
    paddingBottom: 0,
    flexGrow: 1, // Permite que el contenido crezca
  },
  
  modalHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight,
  },
  
  modalTitle: { 
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
  },
  
  modalTitleLarge: {
    fontSize: fontSize.title,
  },
  
  modalSubtitle: {
    fontSize: fontSize.md,
    color: colors.gray,
    marginTop: 5,
    textAlign: 'center',
  },
  
  modalSubtitleLarge: {
    fontSize: fontSize.lg,
  },
  
  modalDate: {
    fontSize: fontSize.lg,
    color: colors.grayDark,
    marginTop: spacing.sm,
    textAlign: 'center',
    fontWeight: '600',
  },
  
  modalDateLarge: {
    fontSize: fontSize.xl,
  },
  
  // ============= SECCIONES =============
  section: {
    marginBottom: spacing.xxl,
  },
  
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    color: colors.primary,
  },
  
  sectionTitleLarge: {
    fontSize: fontSize.xxl,
    marginBottom: spacing.lg,
  },
  
  clientInfo: {
    backgroundColor: colors.light,
    padding: spacing.lg,
    borderRadius: 8,
    gap: spacing.sm,
  },
  
  clientInfoLarge: {
    padding: spacing.xl,
    borderRadius: 10,
    gap: 10,
  },
  
  sectionItem: {
    fontSize: fontSize.md,
    color: '#333',
    lineHeight: 20,
  },
  
  sectionItemLarge: {
    fontSize: fontSize.lg,
    lineHeight: 24,
  },
  
  bold: {
    fontWeight: 'bold',
    color: colors.grayDark,
  },
  
  // ============= TABLA DE BOLETOS MEJORADA =============
  boletosTableContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    maxHeight: 450, // Altura máxima para activar scroll
    position: 'relative',
    ...shadows.sm,
  },
  
  boletosTable: {
    minWidth: 900,
  },
  
  boletosTableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: spacing.sm,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  
  boletosTableColHeader: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: fontSize.md,
    textAlign: 'center',
    paddingHorizontal: spacing.xs,
  },
  
  boletosTableRow: {
    flexDirection: 'row',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    alignItems: 'center',
  },
  
  boletosTableRowEven: {
    backgroundColor: colors.tableRowEven,
  },
  
  boletosTableCol: {
    fontSize: fontSize.sm,
    color: colors.dark,
    textAlign: 'center',
    paddingHorizontal: spacing.xs,
  },
  
  // Columnas de tabla de boletos con anchos mejorados
  boletosColNum: {
    width: 40,
    fontWeight: 'bold',
    color: colors.primary,
  },
  
  boletosColBoleto: {
    width: 140,
    fontWeight: '600',
  },
  
  boletosColRuta: {
    width: 200,
    textAlign: 'left',
  },
  
  boletosColFecha: {
    width: 110,
  },
  
  boletosColAsiento: {
    width: 80,
    fontWeight: '600',
    color: colors.secondary,
  },
  
  boletosColPasajero: {
    width: 160,
    textAlign: 'left',
  },
  
  boletosColCedula: {
    width: 110,
  },
  
  boletosColPrecio: {
    width: 100,
    fontWeight: 'bold',
    color: colors.success,
  },
  
  horizontalScrollContent: {
    alignItems: 'center',
    paddingVertical: 2, // Añadir padding para scrollbar
  },
  
  // Indicador de scroll
  scrollIndicator: {
    textAlign: 'center',
    fontSize: fontSize.sm,
    color: colors.primary,
    marginTop: spacing.sm,
    backgroundColor: colors.highlightBg,
    padding: spacing.sm,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.primary,
    fontWeight: '500',
  },
  
  // Badge indicador de scroll
  scrollBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.info,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    opacity: 0.9,
    ...shadows.md,
  },
  
  scrollBadgeText: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: 'bold',
  },
  
  // ============= TARJETAS DE BOLETOS MÓVIL MEJORADAS =============
  boletosCardContainer: {
    gap: spacing.lg,
  },
  
  boletoCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: 'hidden',
    ...shadows.sm,
  },
  
  boletoCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  
  boletoCardTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.white,
  },
  
  boletoCardNumber: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.white,
    opacity: 0.9,
  },
  
  boletoCardContent: {
    padding: spacing.lg,
  },
  
  boletoCardSection: {
    marginBottom: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight,
  },
  
  boletoCardSectionTitle: {
    fontSize: fontSize.md,
    fontWeight: 'bold',
    color: colors.primaryDark,
    marginBottom: spacing.sm,
  },
  
  boletoCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  
  boletoCardLabel: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.grayDark,
    flex: 1,
  },
  
  boletoCardValue: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.dark,
    flex: 2,
    textAlign: 'right',
  },
  
  boletoCardPriceSection: {
    backgroundColor: colors.highlightBg,
    marginHorizontal: -spacing.lg,
    marginBottom: -spacing.lg,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.grayLight,
  },
  
  boletoCardPrice: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.success,
    textAlign: 'right',
  },
  
  asientoHighlight: {
    backgroundColor: colors.highlightBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    fontWeight: 'bold',
  },
  
  // ============= SECCIÓN DE TOTALES =============
  totalSection: {
    backgroundColor: colors.light,
    padding: spacing.lg,
    borderRadius: 12,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  
  totalRowFinal: {
    marginTop: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 2,
    borderTopColor: colors.primary,
  },
  
  totalLabel: {
    fontSize: fontSize.lg,
    color: colors.grayDark,
  },
  
  totalLabelLarge: {
    fontSize: fontSize.xl,
  },
  
  totalLabelFinal: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  
  totalLabelFinalLarge: {
    fontSize: fontSize.xl,
  },
  
  totalValue: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.success,
  },
  
  totalValueLarge: {
    fontSize: fontSize.xl,
  },
  
  totalValueFinal: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
  },
  
  totalValueFinalLarge: {
    fontSize: fontSize.xxl,
  },
  
  // ============= BOTONES =============
  closeBtn: {
    backgroundColor: colors.secondary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderRadius: 8,
    margin: spacing.xl,
    alignItems: 'center',
    alignSelf: 'center',
    minWidth: 120,
    ...shadows.sm,
  },
  
  closeBtnLarge: {
    paddingVertical: spacing.lg,
    paddingHorizontal: 32,
    borderRadius: 10,
    minWidth: 140,
  },
  
  closeText: { 
    color: colors.white,
    fontWeight: 'bold',
    fontSize: fontSize.lg,
  },
  
  closeTextLarge: {
    fontSize: fontSize.xl,
  },
  
  menuButtonContainer: {
    paddingTop: 10,
    paddingBottom: spacing.xxxl,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  
  volverBtn: {
    backgroundColor: colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: spacing.xl,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    maxWidth: 220,
    ...shadows.sm,
  },
  
  volverText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: fontSize.lg,
  },
  
  verAmortBtn: {
    marginTop: 10,
    padding: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    ...shadows.sm,
  },
  
  verAmortText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 15,
  },
  
  // ============= MODAL DE AMORTIZACIÓN =============
  amortModalOverlay: {
    flex: 1,
    backgroundColor: colors.amortModalOverlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  
  amortModalContent: {
    backgroundColor: colors.white,
    borderRadius: 16,
    ...shadows.lg,
    maxHeight: '90%',
  },
  
  amortModalTitle: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.primaryDark,
    textAlign: 'center',
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  
  amortModalTitleLarge: {
    fontSize: fontSize.xxxl,
    paddingTop: 28,
    paddingBottom: spacing.xl,
  },
  
  amortTotalesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.highlightBg,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: 10,
  },
  
  amortTotalItem: {
    alignItems: 'center',
  },
  
  amortTotalLabel: {
    fontSize: fontSize.md,
    color: colors.gray,
    marginBottom: spacing.xs,
  },
  
  amortTotalValue: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.primaryDark,
  },
  
  amortScrollContainer: {
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  
  amortTable: {
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
    minWidth: 500,
  },
  
  amortTableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  
  amortTableColHeader: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: fontSize.md,
    textAlign: 'center',
  },
  
  amortTableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.white,
  },
  
  amortTableRowEven: {
    backgroundColor: colors.tableRowEven,
  },
  
  amortTableCol: {
    fontSize: fontSize.md,
    color: colors.dark,
    textAlign: 'center',
  },
  
  amortColCuota: {
    width: 60,
    fontWeight: 'bold',
    color: colors.primary,
  },
  
  amortColValor: {
    width: 110,
  },
  
  amortColInteres: {
    width: 100,
  },
  
  amortColCapital: {
    width: 100,
  },
  
  amortColSaldo: {
    width: 110,
  },
  
  amortColBold: {
    fontWeight: '600',
  },
  
  // ============= CARDS DE AMORTIZACIÓN MÓVIL =============
  amortCardsScrollView: {
    maxHeight: 400,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.light, // Fondo para distinguir área scrolleable
    borderRadius: 8,
    padding: spacing.sm,
  },
  
  amortCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.sm,
  },
  
  amortCardLast: {
    borderColor: colors.success,
    borderWidth: 2,
  },
  
  amortCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.light,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight,
  },
  
  amortCardTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.primary,
  },
  
  amortCardValor: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.success,
  },
  
  amortCardBody: {
    padding: spacing.lg,
  },
  
  amortCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  
  amortCardItem: {
    flex: 1,
    alignItems: 'center',
  },
  
  amortCardLabel: {
    fontSize: fontSize.sm,
    color: colors.gray,
    marginBottom: spacing.xs,
  },
  
  amortCardValue: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.dark,
  },
  
  amortCardSaldo: {
    backgroundColor: colors.light,
    marginTop: spacing.sm,
    marginHorizontal: -spacing.lg,
    marginBottom: -spacing.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.grayLight,
  },
  
  amortCardSaldoLabel: {
    fontSize: fontSize.sm,
    color: colors.gray,
    marginBottom: spacing.xs,
  },
  
  amortCardSaldoValue: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.grayDark,
  },
  
  amortCardSaldoPagado: {
    color: colors.success,
  },
  
  amortResumen: {
    backgroundColor: colors.warningBg,
    marginHorizontal: spacing.xl,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.warningBorder,
  },
  
  amortResumenText: {
    fontSize: fontSize.md,
    color: colors.warningText,
    textAlign: 'center',
    fontWeight: '600',
  },
  
  amortCloseBtn: {
    backgroundColor: colors.secondary,
    paddingVertical: spacing.md,
    paddingHorizontal: 32,
    borderRadius: 8,
    margin: spacing.xl,
    alignSelf: 'center',
    minWidth: 120,
    ...shadows.sm,
  },
  
  amortCloseBtnLarge: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    minWidth: 140,
  },
  
  amortCloseText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: fontSize.lg,
    textAlign: 'center',
  },
  
  amortCloseTextLarge: {
    fontSize: fontSize.xl,
  },
  // ============= SCROLLBAR STYLES (Web) =============
  webScrollContainer: {
    // Estilos para hacer las scrollbars más visibles en web
    ...(Platform.OS === 'web' && {
      overflow: 'auto',
      WebkitOverflowScrolling: 'touch',
      scrollbarWidth: 'auto', // Firefox - mostrar scrollbar normal
      scrollbarColor: `${colors.primary} ${colors.grayLight}`, // Firefox
    }),
  },
  
  // Contenedor con overflow visible
  scrollWrapper: {
    flex: 1,
    overflow: 'auto',
    position: 'relative',
    ...(Platform.OS === 'web' && {
      // Forzar la visualización de scrollbars en web
      '&::-webkit-scrollbar': {
        display: 'block',
        width: '14px',
        height: '14px',
      },
      '&::-webkit-scrollbar-track': {
        background: colors.grayLight,
        borderRadius: '10px',
        border: `1px solid ${colors.border}`,
      },
      '&::-webkit-scrollbar-thumb': {
        background: colors.primary,
        borderRadius: '10px',
        border: `2px solid ${colors.grayLight}`,
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: colors.primaryDark,
      },
    }),
  },
  
  // Estilo específico para tablas con scroll
  scrollableTable: {
    ...(Platform.OS === 'web' && {
      display: 'block',
      overflowX: 'auto',
      overflowY: 'auto',
      maxHeight: '400px',
      border: `1px solid ${colors.border}`,
      borderRadius: '8px',
      // Scrollbar siempre visible
      '&::-webkit-scrollbar': {
        width: '12px',
        height: '12px',
        display: 'block !important',
      },
      '&::-webkit-scrollbar-track': {
        background: '#f1f1f1',
        borderRadius: '6px',
      },
      '&::-webkit-scrollbar-thumb': {
        background: colors.secondary,
        borderRadius: '6px',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: colors.primary,
      },
    }),
  },

  // ============= FORZAR SCROLLBARS VISIBLES =============
  forceScrollbar: {
    ...(Platform.OS === 'web' && {
      overflow: 'scroll !important', // Forzar scrollbars siempre visibles
      overscrollBehavior: 'contain',
      // Para Firefox
      scrollbarWidth: 'auto',
      scrollbarColor: `${colors.secondary} ${colors.grayLight}`,
    }),
  },
  
  // Contenedor para elementos scrolleables con indicador visual
  scrollableContent: {
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 8,
    padding: 2,
    backgroundColor: colors.white,
    ...(Platform.OS === 'web' && {
      resize: 'vertical',
      overflow: 'auto',
    }),
  },

  // Tabla principal con scroll mejorado
  mainTableScroll: {
    ...(Platform.OS === 'web' && {
      '&::-webkit-scrollbar': {
        width: 15,
        display: 'block !important',
        visibility: 'visible !important',
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: '#f5f5f5',
        borderRadius: 0,
        borderLeft: `1px solid ${colors.borderLight}`,
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: colors.secondary,
        borderRadius: 7,
        border: '2px solid transparent',
        backgroundClip: 'padding-box',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        backgroundColor: colors.primary,
      },
      // Para Firefox
      scrollbarWidth: 'auto',
      scrollbarColor: `${colors.secondary} #f5f5f5`,
    }),
  },

  // Estilo específico para hacer scrollbars siempre visibles en tabla principal
  tableMainScrollbar: {
    ...(Platform.OS === 'web' && {
      '&::-webkit-scrollbar': {
        width: '16px !important',
        height: '16px !important',
        backgroundColor: '#f1f1f1',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#888',
        borderRadius: '8px',
        border: '3px solid #f1f1f1',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        backgroundColor: '#555',
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: '#f1f1f1',
        borderRadius: '8px',
      },
      scrollbarWidth: 'thick', // Firefox
      scrollbarColor: '#888 #f1f1f1', // Firefox
    }),
  },

});

export default styles;