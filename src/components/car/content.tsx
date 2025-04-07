'use client';

import { useEffect, useState } from 'react';
import { useActionState } from '@/lib/hooks/useActionState';
import { getCars } from './actions';
import { Car } from './types';
import CarForm from './form';
import DeleteCar from './delete';

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

const CarContent = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [carToEdit, setCarToEdit] = useState<Car | null>(null);

  const { execute: fetchCars } = useActionState(getCars, {
    onSuccess: (data) => {
      setCars(data);
    },
    onError: (error) => {
      toast.error(error || 'Failed to fetch cars');
    },
    onComplete: () => {
      setIsLoading(false);
    }
  });

  useEffect(() => {
    fetchCars();
  }, []);

  const handleCreateSuccess = async () => {
    setShowCreateForm(false);
    setIsLoading(true);
    await fetchCars();
  };

  const handleEditSuccess = async () => {
    setCarToEdit(null);
    setIsLoading(true);
    await fetchCars();
  };

  const handleDeleteSuccess = async () => {
    setIsLoading(true);
    await fetchCars();
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Cars</CardTitle>
            <CardDescription>
              Manage company cars
            </CardDescription>
          </div>
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Car
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <p>Loading...</p>
            </div>
          ) : cars.length === 0 ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-muted-foreground">No cars found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cars.map((car) => (
                  <TableRow key={car.id}>
                    <TableCell>{car.id}</TableCell>
                    <TableCell>{car.name}</TableCell>
                    <TableCell>{car.status || 'N/A'}</TableCell>
                    <TableCell>{car.under || 'N/A'}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setCarToEdit(car)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <DeleteCar 
                        id={car.id} 
                        name={car.name}
                        onSuccess={handleDeleteSuccess}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {showCreateForm && (
        <CarForm 
          onSuccess={handleCreateSuccess}
          onClose={() => setShowCreateForm(false)}
        />
      )}

      {carToEdit && (
        <CarForm 
          carToEdit={carToEdit}
          onSuccess={handleEditSuccess}
          onClose={() => setCarToEdit(null)}
        />
      )}
    </div>
  );
};

export default CarContent; 