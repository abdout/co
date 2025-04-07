'use client';

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCar, updateCar } from "./actions";
import { carFormSchema, type CarFormValues } from "./validation";
import { Car, CarFormProps } from "./types";
import { CAR_STATUS_OPTIONS } from "./constant";
import { Save, X, Upload, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { toast } from "sonner";

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
import { Textarea } from "@/components/ui/textarea";

const CarForm = ({
  carToEdit = null,
  onSuccess,
  onClose
}: CarFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [additionalImages, setAdditionalImages] = useState<string[]>(carToEdit?.images || []);

  const defaultValues: Partial<CarFormValues> = {
    id: carToEdit?.id || '',
    name: carToEdit?.name || '',
    images: carToEdit?.images || [],
    status: carToEdit?.status || 'Ready',
    under: carToEdit?.under || '',
    sim: carToEdit?.sim || '',
    petrol: carToEdit?.petrol !== null ? carToEdit?.petrol : 0,
    oil: carToEdit?.oil || '',
    km: carToEdit?.km !== null ? carToEdit?.km : 0,
    licence: carToEdit?.licence || '',
    penalty: carToEdit?.penalty || '',
    history: carToEdit?.history || ''
  };

  const form = useForm<CarFormValues>({
    resolver: zodResolver(carFormSchema),
    defaultValues
  });

  // Update form when additional images are updated
  useEffect(() => {
    form.setValue('images', additionalImages);
  }, [additionalImages, form]);

  const onSubmit = async (data: CarFormValues) => {
    try {
      setIsSubmitting(true);

      let result;
      
      if (carToEdit?.id) {
        result = await updateCar(carToEdit.id, data);
      } else {
        result = await createCar(data);
      }

      if (!result.success) {
        toast.error(result.message || 'Operation failed');
        return;
      }
      
      toast.success(
        carToEdit ? 'Car updated successfully' : 'Car created successfully'
      );
      
      if (onSuccess) {
        await onSuccess();
      }
      
      if (onClose) onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save car');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addImageUrl = (url: string) => {
    if (url && !additionalImages.includes(url)) {
      setAdditionalImages([...additionalImages, url]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = additionalImages.filter((_, i) => i !== index);
    setAdditionalImages(newImages);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto pt-10 pb-10">
      <div className="bg-background border rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
            {carToEdit ? "Edit Car" : "Add New Car"}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        
        <Form {...form}>
            <form onSubmit={(e) => {
              e.stopPropagation();
              form.handleSubmit(onSubmit)(e);
            }} className="space-y-10" data-action="no-navigate">
              {/* Basic Information Section */}
              <section>
                <h2 className="text-xl font-semibold mb-6 pb-2 border-b">General Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* ID Field */}
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                        <FormLabel className="text-sm font-medium">Car ID</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter car ID" 
                        {...field} 
                        disabled={!!carToEdit}
                            className="bg-muted/30" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
                  {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                        <FormLabel className="text-sm font-medium">Car Name</FormLabel>
                    <FormControl>
                          <Input 
                            placeholder="Enter car name" 
                            {...field} 
                            className="bg-muted/30" 
                          />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
              </section>
              
              {/* Images Section */}
              <section>
                <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Images</h2>
                
                {/* Additional Images */}
                <div className="mt-6">
                  <FormLabel className="text-sm font-medium mb-2 block">Additional Images</FormLabel>
                  
                  {/* Image URL Input */}
                  <div className="flex mb-4">
                    <Input
                      type="text"
                      placeholder="Image URL"
                      className="bg-muted/30"
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          addImageUrl(e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="ml-2"
                      onClick={() => {
                        const input = document.querySelector('input[type="text"][placeholder="Image URL"]') as HTMLInputElement;
                        if (input && input.value) {
                          addImageUrl(input.value);
                          input.value = '';
                        }
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  
                  {/* Display Additional Images */}
                  {additionalImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      {additionalImages.map((url, index) => (
                        <div key={index} className="relative group border rounded-md overflow-hidden h-40">
                          <img
                            src={url}
                            alt={`Car image ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
              
              {/* Car Details Section */}
              <section>
                <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Car Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* SIM Field */}
              <FormField
                control={form.control}
                    name="sim"
                render={({ field }) => (
                  <FormItem>
                        <FormLabel className="text-sm font-medium">SIM Card</FormLabel>
                    <FormControl>
                          <Input 
                            placeholder="Enter SIM card details" 
                            {...field} 
                            className="bg-muted/30" 
                          />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            
                  {/* License Field */}
              <FormField
                control={form.control}
                    name="licence"
                render={({ field }) => (
                  <FormItem>
                        <FormLabel className="text-sm font-medium">License</FormLabel>
                    <FormControl>
                          <Input 
                            placeholder="Enter license details" 
                            {...field} 
                            className="bg-muted/30" 
                          />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
                  {/* Petrol Field */}
              <FormField
                control={form.control}
                name="petrol"
                render={({ field }) => (
                  <FormItem>
                        <FormLabel className="text-sm font-medium">Fuel Level (liters)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                            placeholder="Enter fuel level" 
                        {...field}
                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                            className="bg-muted/30" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            
                  {/* Oil Field */}
              <FormField
                control={form.control}
                name="oil"
                render={({ field }) => (
                  <FormItem>
                        <FormLabel className="text-sm font-medium">Oil Status</FormLabel>
                    <FormControl>
                          <Input 
                            placeholder="Enter oil status" 
                            {...field} 
                            className="bg-muted/30" 
                          />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
                  {/* Kilometers Field */}
              <FormField
                control={form.control}
                name="km"
                render={({ field }) => (
                  <FormItem>
                        <FormLabel className="text-sm font-medium">Kilometers</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                            placeholder="Enter kilometers" 
                            {...field}
                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                            className="bg-muted/30" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Penalty Field */}
                  <FormField
                    control={form.control}
                    name="penalty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Penalty Status</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter penalty status" 
                        {...field}
                            className="bg-muted/30" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
                {/* History Field (full width) */}
                <div className="mt-6">
            <FormField
              control={form.control}
              name="history"
              render={({ field }) => (
                <FormItem>
                        <FormLabel className="text-sm font-medium">History</FormLabel>
                  <FormControl>
                          <Textarea 
                            placeholder="Enter car history" 
                            {...field} 
                            className="bg-muted/30 min-h-[100px]" 
                          />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
                </div>
              </section>
              
              {/* Status Section */}
              <section>
                <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Status Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Status Field */}
              <FormField
                control={form.control}
                    name="status"
                render={({ field }) => (
                  <FormItem>
                        <FormLabel className="text-sm font-medium">Status</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                    <FormControl>
                            <SelectTrigger className="bg-muted/30">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                    </FormControl>
                          <SelectContent>
                            {CAR_STATUS_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
                  {/* Under Field */}
              <FormField
                control={form.control}
                    name="under"
                render={({ field }) => (
                  <FormItem>
                        <FormLabel className="text-sm font-medium">Assigned To</FormLabel>
                    <FormControl>
                          <Input 
                            placeholder="Enter assignment details" 
                            {...field} 
                            className="bg-muted/30" 
                          />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
              </section>
            
              {/* Form Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onClose) onClose();
                  }}
                  disabled={isSubmitting}
                  data-action="no-navigate"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                  data-action="no-navigate"
                >
                  {isSubmitting ? 'Saving...' : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Car
                    </>
                  )}
              </Button>
              </div>
          </form>
        </Form>
        </div>
      </div>
    </div>
  );
};

export default CarForm; 