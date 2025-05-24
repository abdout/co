import { editRoutes } from './type';

export const getNextRoute = (currentPath: string): string => {
  const routes = Object.values(editRoutes);
  const currentRouteIndex = routes.findIndex(route => 
    currentPath.includes(route.split('/').pop() || '')
  );
  
  if (currentRouteIndex >= 0 && currentRouteIndex < routes.length - 1) {
    return routes[currentRouteIndex + 1];
  }
  
  return routes[0]; // Default to first route if not found
};

export const getPreviousRoute = (currentPath: string): string => {
  const routes = Object.values(editRoutes);
  const currentRouteIndex = routes.findIndex(route => 
    currentPath.includes(route.split('/').pop() || '')
  );
  
  if (currentRouteIndex > 0) {
    return routes[currentRouteIndex - 1];
  }
  
  return routes[0]; // Default to first route if not found
}; 