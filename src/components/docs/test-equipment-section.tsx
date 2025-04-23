import React from 'react';
import { Badge } from "@/components/ui/badge";
import Equipment, { relayTestEquipment, transformerTestEquipment, breakerTestEquipment } from './equipment';

interface ModelBadgeProps {
  color: string;
  children: React.ReactNode;
}

const ModelBadge: React.FC<ModelBadgeProps> = ({ color, children }) => {
  const colorClasses = {
    blue: "bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/50",
    green: "bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-800/50",
    amber: "bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/30 dark:hover:bg-amber-800/50",
    purple: "bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-800/50",
    red: "bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/50",
    gray: "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800/50 dark:hover:bg-gray-700/50"
  };

  return (
    <Badge 
      variant="outline" 
      className={`cursor-pointer ${colorClasses[color] || colorClasses.gray}`}
    >
      {children}
    </Badge>
  );
};

export const RelayEquipmentSection: React.FC = () => {
  return (
    <>
      <h2>Equipment Selection</h2>
      <Equipment items={relayTestEquipment} />
      
      <h2>Model Selection</h2>
      <div className="flex flex-wrap gap-2 my-4">
        <ModelBadge color="blue">ABB REF615</ModelBadge>
        <ModelBadge color="green">Siemens 7SJ82</ModelBadge>
        <ModelBadge color="amber">SEL-751</ModelBadge>
        <ModelBadge color="purple">GE Multilin 750</ModelBadge>
        <ModelBadge color="red">Schneider P14D</ModelBadge>
        <ModelBadge color="gray">Micom P122</ModelBadge>
      </div>
    </>
  );
};

export const TransformerEquipmentSection: React.FC = () => {
  return (
    <>
      <h2>Equipment Selection</h2>
      <Equipment items={transformerTestEquipment} />
      
      <h2>Model Selection</h2>
      <div className="flex flex-wrap gap-2 my-4">
        <ModelBadge color="blue">ABB TPTR</ModelBadge>
        <ModelBadge color="green">Siemens PDT</ModelBadge>
        <ModelBadge color="amber">GE Prolec</ModelBadge>
        <ModelBadge color="purple">Hitachi Energy</ModelBadge>
        <ModelBadge color="red">Schneider Electric</ModelBadge>
        <ModelBadge color="gray">CG Power</ModelBadge>
      </div>
    </>
  );
};

export const BreakerEquipmentSection: React.FC = () => {
  return (
    <>
      <h2>Equipment Selection</h2>
      <Equipment items={breakerTestEquipment} />
      
      <h2>Model Selection</h2>
      <div className="flex flex-wrap gap-2 my-4">
        <ModelBadge color="blue">ABB VD4</ModelBadge>
        <ModelBadge color="green">Siemens 3AH</ModelBadge>
        <ModelBadge color="amber">Schneider Evolis</ModelBadge>
        <ModelBadge color="purple">GE Kilovac</ModelBadge>
        <ModelBadge color="red">Hitachi HVG</ModelBadge>
        <ModelBadge color="gray">Eaton VCP-W</ModelBadge>
      </div>
    </>
  );
}; 