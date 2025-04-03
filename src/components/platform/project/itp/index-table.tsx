'use client';
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SystemType } from "@/components/platform/project/constant";

interface IndexTableProps {
  systems: SystemType[];
}

export default function IndexTable({ systems }: IndexTableProps) {
  return (
    <div className="border border-black max-w-[700px] mx-auto mb-8">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-black">
            <TableHead className="w-[100px] border-r border-black text-center">Sr. No.</TableHead>
            <TableHead className="border-r border-black py-2">Item</TableHead>
            <TableHead className="w-[100px] border-black py-2 text-center">Page</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {systems.map((system, index) => (
            <TableRow key={system} className="border-b border-black last:border-b-0">
              <TableCell className="font-medium border-r border-black text-center">{index + 1}</TableCell>
              <TableCell className="border-r border-black py-2">{system}</TableCell>
              <TableCell className="border-black py-2 text-center">{index + 1}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 