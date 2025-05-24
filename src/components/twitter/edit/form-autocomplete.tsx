'use client'
import { AutoLocation } from "./auto-location"

export function HierarchicalExample() {
  return (
    <AutoLocation 
      mode="full"
      className="mt-40"
      timing={{ 
        transitionDelay: 250,
        dropdownDelay: 600
      }}
      onComplete={(selections) => {
        console.log("Full 5-level location selection complete:", selections);
        // Will include country, state, locality, admin_unit, neighborhood
      }}
    />
  );
}

export function AutocompleteExample() {
  return (
    <AutoLocation 
      mode="simplified"
      className="mt-40"
      onComplete={(selections) => {
        console.log("Simplified 4-level location selection complete:", selections);
        // Will include country, locality, admin_unit, neighborhood (skips state level)
      }}
    />
  );
}