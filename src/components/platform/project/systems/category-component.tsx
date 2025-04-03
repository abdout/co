import React from "react";
import { Activity, Category } from "../types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface CategoryComponentProps {
  category: Category;
  onUpdate?: (category: Category) => void;
  readOnly?: boolean;
}

export default function CategoryComponent({ category, onUpdate, readOnly = false }: CategoryComponentProps) {
  const handleActivityStatusChange = (activityIndex: number, status: string) => {
    if (!onUpdate) return;
    
    const newActivities = [...category.activities];
    newActivities[activityIndex] = {
      ...newActivities[activityIndex],
      status
    };
    
    onUpdate({
      ...category,
      activities: newActivities
    });
  };
  
  const handleActivityRemarksChange = (activityIndex: number, remarks: string) => {
    if (!onUpdate) return;
    
    const newActivities = [...category.activities];
    newActivities[activityIndex] = {
      ...newActivities[activityIndex],
      remarks
    };
    
    onUpdate({
      ...category,
      activities: newActivities
    });
  };
  
  const getStatusBadgeStyle = (status?: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500 hover:bg-green-600";
      case "in-progress":
        return "bg-blue-500 hover:bg-blue-600";
      case "failed":
        return "bg-red-500 hover:bg-red-600";
      case "pending":
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-medium">{category.name} Activities</h3>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Activity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Remarks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {category.activities.map((activity, index) => (
            <TableRow key={index}>
              <TableCell>{activity.name}</TableCell>
              <TableCell>
                {readOnly ? (
                  <Badge className={getStatusBadgeStyle(activity.status)}>
                    {activity.status || "Pending"}
                  </Badge>
                ) : (
                  <Select
                    value={activity.status || "pending"}
                    onValueChange={(value) => handleActivityStatusChange(index, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </TableCell>
              <TableCell>
                {readOnly ? (
                  <p>{activity.remarks}</p>
                ) : (
                  <Textarea
                    value={activity.remarks || ""}
                    onChange={(e) => handleActivityRemarksChange(index, e.target.value)}
                    placeholder="Add remarks..."
                    className="min-h-[80px]"
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 