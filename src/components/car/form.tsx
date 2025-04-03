'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState } from "react-dom";
import { createCar, updateCar } from "./actions";
import { carFormSchema, type CarFormValues } from "./validation";
import { Car, CarFormProps } from "./types";
import { CAR_STATUS_OPTIONS } from "./constant";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CarForm = ({
  carToEdit = null,
  onSuccess,
  onClose
}: CarFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(true);

  const form = useForm<CarFormValues>({
    resolver: zodResolver(carFormSchema),
    defaultValues: carToEdit || {
      id: "",
      name: "",
      src: "",
      alt: "",
      sim: "",
      petrol: 0,
      oil: "",
      history: "",
      status: "Ready",
      under: "",
      km: 0,
      width: 0,
      licence: "",
      penalty: ""
    }
  });

  const { execute: executeCreate } = useActionState(createCar, {
    onSuccess: async (data) => {
      toast.success("Car created successfully");
      form.reset();
      setOpen(false);
      if (onSuccess) await onSuccess();
      if (onClose) onClose();
    },
    onError: (error) => {
      toast.error(error || "Failed to create car");
    },
    onComplete: () => {
      setIsSubmitting(false);
    }
  });

  const { execute: executeUpdate } = useActionState(updateCar, {
    onSuccess: async (data) => {
      toast.success("Car updated successfully");
      form.reset();
      setOpen(false);
      if (onSuccess) await onSuccess();
      if (onClose) onClose();
    },
    onError: (error) => {
      toast.error(error || "Failed to update car");
    },
    onComplete: () => {
      setIsSubmitting(false);
    }
  });

  const onSubmit = async (values: CarFormValues) => {
    setIsSubmitting(true);
    
    if (carToEdit) {
      await executeUpdate(carToEdit.id, values);
    } else {
      await executeCreate(values);
    }
  };

  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {carToEdit ? "Edit Car" : "Add New Car"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Car ID</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter car ID" 
                        {...field} 
                        disabled={!!carToEdit}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Car Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter car name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="src"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image Source</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter image path" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="alt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alt Text</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter alt text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CAR_STATUS_OPTIONS.map((option) => (
                          <SelectItem 
                            key={option.value} 
                            value={option.value}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="under"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned To</FormLabel>
                    <FormControl>
                      <Input placeholder="Assigned to" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sim"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SIM Card</FormLabel>
                    <FormControl>
                      <Input placeholder="SIM card details" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="petrol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Petrol Level</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Petrol level" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="oil"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Oil Status</FormLabel>
                    <FormControl>
                      <Input placeholder="Oil status" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="km"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kilometers</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Kilometers" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="history"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>History</FormLabel>
                  <FormControl>
                    <Input placeholder="Car history" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="licence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License</FormLabel>
                    <FormControl>
                      <Input placeholder="License details" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="penalty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Penalty</FormLabel>
                    <FormControl>
                      <Input placeholder="Penalty details" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {carToEdit ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CarForm; 