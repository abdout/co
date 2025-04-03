import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { System } from "../types";
import SystemComponent from "./system-component";
import { convertLegacyActivities, convertToLegacyFormat } from "./convert-activities";

interface SystemsProps {
  systems: System[];
  onUpdate?: (systems: System[]) => void;
  readOnly?: boolean;
}

export function Systems({ systems, onUpdate, readOnly = false }: SystemsProps) {
  const handleSystemUpdate = (updatedSystem: System, index: number) => {
    if (!onUpdate) return;
    
    const newSystems = [...systems];
    newSystems[index] = updatedSystem;
    onUpdate(newSystems);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Systems & Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={systems?.[0]?.name || "system-0"}>
          <TabsList className="w-full h-auto flex flex-wrap">
            {systems.map((system, index) => (
              <TabsTrigger key={index} value={system.name || `system-${index}`}>
                {system.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {systems.map((system, index) => (
            <TabsContent key={index} value={system.name || `system-${index}`}>
              <SystemComponent 
                system={system}
                onUpdate={(updatedSystem) => handleSystemUpdate(updatedSystem, index)}
                readOnly={readOnly}
              />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

export { convertLegacyActivities, convertToLegacyFormat }; 