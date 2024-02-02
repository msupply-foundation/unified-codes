export { AlertIcon } from './Alert';
export { AngleCircleRightIcon } from './AngleCircleRight';
export { ArrowLeftIcon } from './ArrowLeft';
export { ArrowRightIcon } from './ArrowRight';
export { BarChartIcon } from './BarChart';
export { BarcodeIcon } from './Barcode';
export { BookIcon } from './Book';
export { CartIcon } from './Cart';
export { CableIcon } from './Cable';
export { CheckboxCheckedIcon } from './CheckboxChecked';
export { CheckboxEmptyIcon } from './CheckboxEmpty';
export { CheckboxIndeterminateIcon } from './CheckboxIndeterminate';
export { CheckIcon } from './Check';
export { ChevronDownIcon } from './ChevronDown';
export { ChevronsDownIcon } from './ChevronsDown';
export { CircleIcon } from './Circle';
export { ClockIcon } from './Clock';
export { CloseIcon } from './Close';
export { ColumnsIcon } from './Columns';
export { CopyIcon } from './Copy';
export { CustomersIcon } from './Customers';
export { DashboardIcon } from './Dashboard';
export { DeleteIcon } from './Delete';
export { DownloadIcon } from './Download';
export { ExcelFileIcon } from './Excel';
export { UploadIcon } from './Upload';
export { UploadFileIcon } from './UploadFile';
export { EditIcon } from './Edit';
export { FilterIcon } from './Filter';
export { HomeIcon } from './Home';
export { InfoIcon } from './Info';
export { InvoiceIcon } from './Invoice';
export { KeyIcon } from './Key';
export { ListIcon } from './ListIcon';
export { MenuDotsIcon } from './MenuDots';
export { MessagesIcon } from './Messages';
export { MessageSquareIcon } from './MessageSquare';
export { MSupplyGuy, AnimatedMSupplyGuy } from './MSupplyGuy';
export { PlusCircleIcon } from './PlusCircle';
export { PowerIcon } from './Power';
export { LogoutIcon } from './Logout';
export { PrinterIcon } from './Printer';
export { RadioIcon } from './Radio';
export { ReportsIcon } from './Reports';
export { RewindIcon } from './Rewind';
export { SaveIcon } from './Save';
export { SettingsIcon } from './Settings';
export { SortAscIcon } from './SortAsc';
export { SortDescIcon } from './SortDesc';
export { StockIcon } from './Stock';
export { SuppliersIcon } from './Suppliers';
export { ManufacturerIcon } from './Manufacturer';
export { OrganisationIcon } from './Organisation';
export { ToolsIcon } from './Tools';
export { TranslateIcon } from './Translate';
export { TelegramIcon } from './Telegram';
export { TruckIcon } from './Truck';
export { UnhappyMan } from './UnhappyMan';
export { UserIcon } from './User';
export { UsersIcon } from './Users';
export { VisibilityIcon } from './VisiblityIcon';
export { VisibilityOffIcon } from './VisiblityOffIcon';
export { MedicineIcon } from './MedicineIcon';
export { SidebarIcon } from './Sidebar';
export { SearchIcon } from './Search';
export { PersonSearchIcon } from './PersonSearch';
export { ZapIcon } from './Zap';
export { NavigateLinkIcon } from './NavigateLink';
export { RunIcon } from './Run';
export { UCLogo } from './UCLogo';

type Color =
  | 'inherit'
  | 'action'
  | 'disabled'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning';

export interface SvgIconProps {
  color: Color;
  fontSize?: 'small' | 'medium' | 'large' | 'inherit';
}
