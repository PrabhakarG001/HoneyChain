import { Platform } from 'react-native';

export const shadows = {
  sm: Platform.select({
    web: { boxShadow: '0px 2px 4px rgba(31, 26, 23, 0.04)' },
    default: {
      shadowColor: '#1F1A17',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.03,
      shadowRadius: 4,
      elevation: 1,
    }
  }),
  md: Platform.select({
    web: { boxShadow: '0px 4px 12px rgba(31, 26, 23, 0.08)' },
    default: {
      shadowColor: '#1F1A17',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 12,
      elevation: 3,
    }
  }),
  lg: Platform.select({
    web: { boxShadow: '0px 12px 24px rgba(31, 26, 23, 0.12)' },
    default: {
      shadowColor: '#1F1A17',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.08,
      shadowRadius: 24,
      elevation: 6,
    }
  })
};
