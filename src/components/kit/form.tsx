'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, X, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { KIT_STATUS_OPTIONS } from './constant';
import { kitFormSchema, KitFormValues } from './validation';
import { KitFormProps } from './types';
import { createKit, updateKit } from './actions';

const KitForm: React.FC<KitFormProps> = ({
  kitToEdit = null,
  onSuccess,
  onClose
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(kitToEdit?.src || '');
  const [isUploading, setIsUploading] = useState(false);

  const defaultValues: Partial<KitFormValues> = {
    id: kitToEdit?.id || '',
    name: kitToEdit?.name || '',
    src: kitToEdit?.src || '',
    alt: kitToEdit?.alt || '',
    width: kitToEdit?.width || 150,
    bg: kitToEdit?.bg || '#CCCCCC',
    calibration: kitToEdit?.calibration || '',
    datasheet: kitToEdit?.datasheet || '',
    manual: kitToEdit?.manual || '',
    status: kitToEdit?.status || 'Available',
    under: kitToEdit?.under || '',
    location: kitToEdit?.location || '',
    price: kitToEdit?.price || '',
  };

  const form = useForm<KitFormValues>({
    resolver: zodResolver(kitFormSchema),
    defaultValues
  });

  // Update form when image is uploaded
  useEffect(() => {
    if (imageUrl) {
      form.setValue('src', imageUrl);
    }
  }, [imageUrl, form]);

  // Disable body scrolling when form is open
  useEffect(() => {
    // Save original overflow setting
    const originalOverflow = document.body.style.overflow;
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
    
    return () => {
      // Restore original overflow setting when component unmounts
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'nmbdnmbd');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setImageUrl(data.secure_url);
      form.setValue('alt', form.getValues('name') || file.name.split('.')[0]);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: KitFormValues) => {
    console.log('=== Client: Kit Form Submit ===');
    console.log('Form data:', JSON.stringify(data, null, 2));
    console.log('Mode:', kitToEdit ? 'Edit' : 'Create');
    
    try {
      setIsSubmitting(true);

      let result;
      
      if (kitToEdit?.id) {
        console.log('Updating existing kit:', kitToEdit.id);
        result = await updateKit(kitToEdit.id, data);
      } else {
        console.log('Creating new kit');
        result = await createKit(data);
      }

      if (!result.success) {
        console.error('Error from API:', result.message);
        toast.error(result.message || 'Operation failed');
        return;
      }
      
      toast.success(
        kitToEdit ? 'Kit updated successfully' : 'Kit created successfully'
      );
      
      if (onSuccess) {
        await onSuccess();
      }
      
      if (onClose) onClose();
    } catch (error: any) {
      console.error('Exception in kit form submission:', error);
      toast.error(error.message || 'Failed to save kit');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-auto" data-action="no-navigate">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header with close button */}
        <div className="flex justify-between items-center p-4 border-b">
          <h1 className="text-2xl font-bold">
            {kitToEdit ? 'Edit Kit' : 'Add New Kit'}
          </h1>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => {
              e.stopPropagation();
              if (onClose) onClose();
            }}
            className="h-8 w-8"
            data-action="no-navigate"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 md:px-8 py-8">
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
                        <FormLabel className="text-sm font-medium">Kit ID</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter kit ID" 
                            {...field} 
                            disabled={!!kitToEdit}
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
                        <FormLabel className="text-sm font-medium">Kit Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter kit name" 
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

              {/* Image Upload Section */}
              <section>
                <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Image</h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  {/* Image Preview */}
                  <div className="md:col-span-2 flex flex-col items-center">
                    <div 
                      className="relative w-full aspect-square rounded-md overflow-hidden border border-border mb-4 flex items-center justify-center bg-muted/30"
                      style={{ backgroundColor: form.getValues('bg') || '#CCCCCC' }}
                    >
                      {imageUrl ? (
                        <img 
                          src={imageUrl} 
                          alt={form.getValues('alt') || 'Kit image'} 
                          className="object-contain max-h-full max-w-full p-4"
                          style={{ maxWidth: `${form.getValues('width')}px` }}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <ImageIcon className="h-12 w-12 mb-2" />
                          <p>No image uploaded</p>
                        </div>
                      )}
                    </div>
                    <label className="w-full">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full"
                        disabled={isUploading}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {isUploading ? 'Uploading...' : 'Upload Image'}
                      </Button>
                      <input 
                        type="file" 
                        onChange={handleImageUpload} 
                        className="hidden" 
                        accept="image/*" 
                        disabled={isUploading}
                      />
                    </label>
                  </div>

                  <div className="md:col-span-3 space-y-6">
                    {/* Image Source - Hidden but filled automatically */}
                    <FormField
                      control={form.control}
                      name="src"
                      render={({ field }) => (
                        <FormItem className="hidden">
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Alt Text */}
                    <FormField
                      control={form.control}
                      name="alt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Alt Text</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter alternative text" 
                              {...field} 
                              className="bg-muted/30" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Image Width */}
                    <FormField
                      control={form.control}
                      name="width"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Display Width (px)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter image width" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 150)}
                              className="bg-muted/30" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Background Color */}
                    <FormField
                      control={form.control}
                      name="bg"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Background Color</FormLabel>
                          <div className="flex gap-4">
                            <div 
                              className="w-12 h-12 rounded border border-border"
                              style={{ backgroundColor: field.value }}
                            />
                            <FormControl>
                              <Input
                                type="color"
                                {...field}
                                className="h-12 w-full" 
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </section>

              {/* Status and Assignment */}
              <section>
                <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Status & Assignment</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Status */}
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
                            {KIT_STATUS_OPTIONS.map(option => (
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
                  
                  {/* Assigned To */}
                  <FormField
                    control={form.control}
                    name="under"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Assigned To</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter assignment" 
                            {...field} 
                            className="bg-muted/30" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Location */}
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Location</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter location" 
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

              {/* Documents and References */}
              <section>
                <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Documents & References</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Calibration */}
                  <FormField
                    control={form.control}
                    name="calibration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Calibration</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Calibration date/details" 
                            {...field} 
                            className="bg-muted/30" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Datasheet */}
                  <FormField
                    control={form.control}
                    name="datasheet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Datasheet URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter datasheet URL" 
                            {...field} 
                            className="bg-muted/30" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Manual */}
                  <FormField
                    control={form.control}
                    name="manual"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Manual URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter manual URL" 
                            {...field} 
                            className="bg-muted/30" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Price */}
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Price</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter price" 
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
              
              {/* Submit Button */}
              <div className="border-t pt-8 mt-8">
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    className="w-full sm:w-auto px-8 py-6 rounded-md"
                    disabled={isSubmitting}
                    size="lg"
                  >
                    <Save className="mr-2 h-5 w-5" />
                    {isSubmitting 
                      ? (kitToEdit ? "Updating Kit..." : "Creating Kit...") 
                      : (kitToEdit ? "Update Kit" : "Create Kit")
                    }
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default KitForm; 