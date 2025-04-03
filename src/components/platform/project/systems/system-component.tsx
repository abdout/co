import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Category, System } from "../types";
import CategoryComponent from "./category-component";

interface SystemComponentProps {
  system: System;
  onUpdate?: (system: System) => void;
  readOnly?: boolean;
}

export default function SystemComponent({ system, onUpdate, readOnly = false }: SystemComponentProps) {
  const handleCategoryUpdate = (updatedCategory: Category, index: number) => {
    if (!onUpdate) return;

    const newCategories = [...system.categories];
    newCategories[index] = updatedCategory;
    onUpdate({ ...system, categories: newCategories });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <Tabs defaultValue={system.categories?.[0]?.name || "category-0"}>
          <TabsList className="w-full h-auto flex flex-wrap">
            {system.categories.map((category, index) => (
              <TabsTrigger key={index} value={category.name || `category-${index}`}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {system.categories.map((category, index) => (
            <TabsContent key={index} value={category.name || `category-${index}`}>
              <CategoryComponent 
                category={category}
                onUpdate={(updatedCategory) => handleCategoryUpdate(updatedCategory, index)}
                readOnly={readOnly}
              />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
} 