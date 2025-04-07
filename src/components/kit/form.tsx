'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, X, Upload, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { DatePickerWithRange } from '@/components/atom/date-picker-range';
import { Badge } from '@/components/ui/badge';

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
  const [mainImageUrl, setMainImageUrl] = useState<string>(kitToEdit?.picture || '');
  const [additionalImages, setAdditionalImages] = useState<string[]>(kitToEdit?.images || []);
  const [isUploading, setIsUploading] = useState(false);
  const [accessoryInput, setAccessoryInput] = useState('');
  const [accessories, setAccessories] = useState<string[]>(kitToEdit?.accessories || []);

  const defaultValues: Partial<KitFormValues> = {
    id: kitToEdit?.id || '',
    name: kitToEdit?.name || '',
    picture: kitToEdit?.picture || '',
    images: kitToEdit?.images || [],
    accessories: kitToEdit?.accessories || [],
    calibration: kitToEdit?.calibration || '',
    calibrationIssue: kitToEdit?.calibrationIssue || '',
    calibrationDue: kitToEdit?.calibrationDue || '',
    software: kitToEdit?.software || '',
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

  // Update form when main image is uploaded
  useEffect(() => {
    if (mainImageUrl) {
      form.setValue('picture', mainImageUrl);
    }
  }, [mainImageUrl, form]);

  // Update form when additional images are updated
  useEffect(() => {
    form.setValue('images', additionalImages);
  }, [additionalImages, form]);

  // Update form when accessories are updated
  useEffect(() => {
    form.setValue('accessories', accessories);
  }, [accessories, form]);

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

  const uploadToCloudinary = async (file: File) => {
    try {
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
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      const imageUrl = await uploadToCloudinary(files[0]);
      setMainImageUrl(imageUrl);
      toast.success('Main image uploaded successfully');
    } catch (error) {
      console.error('Error uploading main image:', error);
      toast.error('Failed to upload main image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAdditionalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      const uploadPromises = Array.from(files).map(file => uploadToCloudinary(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      setAdditionalImages(prev => [...prev, ...uploadedUrls]);
      toast.success(`${uploadedUrls.length} additional image(s) uploaded successfully`);
    } catch (error) {
      console.error('Error uploading additional images:', error);
      toast.error('Failed to upload additional images. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
  };

  const addAccessory = () => {
    if (accessoryInput.trim()) {
      setAccessories(prev => [...prev, accessoryInput.trim()]);
      setAccessoryInput('');
    }
  };

  const removeAccessory = (index: number) => {
    setAccessories(prev => prev.filter((_, i) => i !== index));
  };

  const handleAccessoryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addAccessory();
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

              {/* Main Image Upload Section */}
              <section>
                <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Main Image</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Image Preview */}
                  <div className="flex flex-col items-center">
                    <div 
                      className="relative w-full aspect-square rounded-md overflow-hidden border border-border mb-4 flex items-center justify-center bg-muted/30"
                    >
                      {mainImageUrl ? (
                        <img 
                          src={mainImageUrl} 
                          alt={form.getValues('name') || 'Kit image'}
                          className="object-contain max-h-full max-w-full p-4"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <ImageIcon className="h-16 w-16 mb-2" />
                          <p>No image uploaded</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upload Controls */}
                  <div className="flex flex-col justify-center">
                    <FormField
                      control={form.control}
                      name="picture"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Main Kit Image</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                            <Input 
                                type="text" 
                                placeholder="Image URL" 
                              {...field} 
                                className="bg-muted/30 mb-2" 
                                onChange={(e) => {
                                  field.onChange(e);
                                  setMainImageUrl(e.target.value);
                                }}
                              />
                            </div>
                          </FormControl>
                          <div className="mt-2">
                            <Input
                              type="file"
                              id="main-image-upload"
                              className="hidden"
                              accept="image/*"
                              onChange={handleMainImageUpload}
                              disabled={isUploading}
                            />
                            <label 
                              htmlFor="main-image-upload" 
                              className="bg-primary hover:bg-primary/90 text-primary-foreground inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none px-4 py-2 cursor-pointer"
                            >
                              {isUploading ? (
                                <span>Uploading...</span>
                              ) : (
                                <>
                                  <Upload className="h-4 w-4 mr-2" />
                                  <span>Upload Image</span>
                                </>
                              )}
                            </label>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </section>

              {/* Additional Images Section */}
              <section>
                <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Additional Images</h2>
                <div className="space-y-4">
                  {/* Display existing images */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {additionalImages.map((imgUrl, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={imgUrl} 
                          alt={`Additional kit image ${index + 1}`}
                          className="aspect-square object-cover rounded-md border border-border"
                        />
                        <button
                          type="button"
                          onClick={() => removeAdditionalImage(index)}
                          className="absolute top-2 right-2 bg-background/80 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Upload additional images */}
                  <div className="mt-4">
                    <Input
                      type="file"
                      id="additional-images-upload"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleAdditionalImageUpload}
                      disabled={isUploading}
                    />
                    <label 
                      htmlFor="additional-images-upload" 
                      className="bg-primary hover:bg-primary/90 text-primary-foreground inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none px-4 py-2 cursor-pointer"
                    >
                      {isUploading ? (
                        <span>Uploading...</span>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          <span>Add More Images</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </section>

              {/* Accessories Section */}
              <section>
                <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Accessories</h2>
                <div className="space-y-4">
                  {/* Add accessory input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter accessory name"
                      value={accessoryInput}
                      onChange={(e) => setAccessoryInput(e.target.value)}
                      onKeyDown={handleAccessoryKeyDown}
                      className="flex-1 bg-muted/30"
                    />
                    <Button
                      type="button"
                      onClick={addAccessory}
                      disabled={!accessoryInput.trim()}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>

                  {/* Display accessories */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {accessories.length === 0 ? (
                      <p className="text-muted-foreground text-sm">No accessories added yet.</p>
                    ) : (
                      accessories.map((accessory, index) => (
                        <Badge key={index} variant="secondary" className="pl-3 pr-2 py-1.5 flex items-center gap-1">
                          {accessory}
                          <button
                            type="button"
                            onClick={() => removeAccessory(index)}
                            className="ml-1 text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))
                    )}
                  </div>

                  {/* Hidden field for form handling */}
                  <FormField
                    control={form.control}
                    name="accessories"
                    render={({ field }) => (
                      <FormItem className="hidden">
                          <FormControl>
                          <Input {...field} />
                          </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              {/* Calibration Section */}
              <section>
                <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Calibration Information</h2>
                <div className="grid grid-cols-1 gap-6">
                  {/* Calibration Field */}
                  <FormField
                    control={form.control}
                    name="calibration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Calibration Status</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter calibration status" 
                            {...field} 
                            className="bg-muted/30" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Calibration Issue and Due Date Range */}
                  <div>
                    <FormLabel className="text-sm font-medium mb-2 block">Calibration Issue Period</FormLabel>
                    <DatePickerWithRange 
                      className="w-full" 
                      onDateChange={(range) => {
                        if (range?.from) {
                          form.setValue('calibrationIssue', range.from.toISOString());
                        }
                        if (range?.to) {
                          form.setValue('calibrationDue', range.to.toISOString());
                        }
                      }}
                      initialDateRange={{
                        from: form.getValues('calibrationIssue') ? new Date(form.getValues('calibrationIssue') as string) : undefined,
                        to: form.getValues('calibrationDue') ? new Date(form.getValues('calibrationDue') as string) : undefined
                      }}
                    />
                  </div>

                  {/* Software Field */}
                  <FormField
                    control={form.control}
                    name="software"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Software</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter software used with this kit" 
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

              {/* Documentation Section */}
              <section>
                <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Documentation</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Datasheet Field */}
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
                  
                  {/* Manual Field */}
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
                            {KIT_STATUS_OPTIONS.map((option) => (
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
                        <FormLabel className="text-sm font-medium">Checked By</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter name of person who checked the kit" 
                            {...field} 
                            className="bg-muted/30" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Location Field */}
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Location</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter kit location" 
                            {...field} 
                            className="bg-muted/30" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Price Field */}
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Price</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter kit price" 
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
                      Save Kit
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

export default KitForm; 