import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export const useResponsive = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const isExtraLargeDesktop = useMediaQuery(theme.breakpoints.up('xl'));

  const currentBreakpoint = () => {
    if (isMobile) return 'xs';
    if (isTablet) return 'sm';
    if (isDesktop) return 'md';
    if (isLargeDesktop) return 'lg';
    return 'xl';
  };

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isExtraLargeDesktop,
    breakpoint: currentBreakpoint(),
    up: (breakpoint) => useMediaQuery(theme.breakpoints.up(breakpoint)),
    down: (breakpoint) => useMediaQuery(theme.breakpoints.down(breakpoint)),
    between: (start, end) => useMediaQuery(theme.breakpoints.between(start, end)),
    only: (breakpoint) => useMediaQuery(theme.breakpoints.only(breakpoint)),
  };
};