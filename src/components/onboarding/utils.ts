import { onboardingRoutes } from './type';

export const getNextRoute = (currentPath: string): string => {
  const routes = Object.values(onboardingRoutes);
  const currentRouteIndex = routes.findIndex(route => 
    currentPath.includes(route.split('/').pop() || '')
  );
  
  // If we're on the eligibility page, always go to review
  if (currentPath.includes('/onboarding/eligibility')) {
    return onboardingRoutes.REVIEW;
  }
  
  if (currentRouteIndex >= 0 && currentRouteIndex < routes.length - 1) {
    return routes[currentRouteIndex + 1];
  }
  
  return routes[0]; // Default to first route if not found
};

export const getPreviousRoute = (currentPath: string): string => {
  const routes = Object.values(onboardingRoutes);
  const currentRouteIndex = routes.findIndex(route => 
    currentPath.includes(route.split('/').pop() || '')
  );
  
  if (currentRouteIndex > 0) {
    return routes[currentRouteIndex - 1];
  }
  
  return routes[0]; // Default to first route if not found
}; 