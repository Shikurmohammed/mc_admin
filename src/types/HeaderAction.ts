export interface HeaderAction {
  label: string;
  onClick: () => void;
  variant?: 'text' | 'outlined' | 'contained'; // Match MUI Button variants
  color?: 'primary' | 'secondary' | 'inherit';
}