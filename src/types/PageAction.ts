export interface PageAction {
  label: string;
  onClick: () => void;
  variant?: 'text' | 'outlined' | 'contained';
  icon?: React.ReactNode;
}