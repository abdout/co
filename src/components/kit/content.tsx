'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { getKits } from './actions';
import { Kit } from './types';
import KitForm from './form';
import DeleteKit from './delete';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { toast } from 'sonner';
import { Edit, Plus } from 'lucide-react';

const KitContent = () => {
  const [kits, setKits] = useState<Kit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [kitToEdit, setKitToEdit] = useState<Kit | null>(null);
  
  // Fetch kits function
  const fetchKits = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getKits();
      
      if (Array.isArray(data)) {
        setKits(data);
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to fetch kits');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Run only once on component mount
  useEffect(() => {
    fetchKits();
  }, [fetchKits]);

  const handleCreateSuccess = useCallback(async () => {
    setShowCreateForm(false);
    await fetchKits();
  }, [fetchKits]);

  const handleEditSuccess = useCallback(async () => {
    setKitToEdit(null);
    await fetchKits();
  }, [fetchKits]);

  const handleDeleteSuccess = useCallback(async () => {
    await fetchKits();
  }, [fetchKits]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Kits</CardTitle>
            <CardDescription>
              Manage testing and measurement kits
            </CardDescription>
          </div>
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-1 rounded-full"
          >
            <Plus className="h-4 w-4" />
            Add Kit
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <p>Loading...</p>
            </div>
          ) : kits.length === 0 ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-muted-foreground">No kits found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kits.map((kit) => (
                    <TableRow key={kit.id}>
                      <TableCell className="font-mono text-xs">{kit.id.substring(0, 8)}</TableCell>
                      <TableCell className="font-medium">{kit.name}</TableCell>
                      <TableCell>
                        {kit.status ? (
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            kit.status === 'Available' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {kit.status}
                          </span>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell>{kit.under || 'N/A'}</TableCell>
                      <TableCell>{kit.location || 'N/A'}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setKitToEdit(kit)}
                          className="rounded-full h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <DeleteKit 
                          id={kit.id} 
                          name={kit.name}
                          onSuccess={handleDeleteSuccess}
                          onDelete={() => {}}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {showCreateForm && (
        <KitForm 
          onSuccess={handleCreateSuccess}
          onClose={() => setShowCreateForm(false)}
        />
      )}

      {kitToEdit && (
        <KitForm 
          kitToEdit={kitToEdit}
          onSuccess={handleEditSuccess}
          onClose={() => setKitToEdit(null)}
        />
      )}
    </div>
  );
};

export default KitContent; 