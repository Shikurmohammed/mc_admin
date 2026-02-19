import { HeaderAction } from "./HeaderAction";
import { PageAction } from "./PageAction";

export interface  PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: boolean;
  actions?: PageAction[]; // This allows objects instead of 'never'
  onRefresh?: () => void;
  onAdd?: () => void;
  onDownload?: () => void;
  onFilter?: () => void;
  tags?: string[];
  collaborators?: { name: string; avatar?: string }[];
}