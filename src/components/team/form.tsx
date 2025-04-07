'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState } from "@/lib/hooks/useActionState";
import { createTeamMember, updateTeamMember } from "./actions";
import { teamFormSchema, type TeamFormValues } from "./validation";
import { TeamMember, TeamFormProps } from "./types";
import { TEAM_LOCATIONS, TEAM_SKILLS } from "./constant";

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
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { toast } from "sonner";

const TeamForm = ({
  memberToEdit = null,
  onSuccess,
  onClose
}: TeamFormProps) => {
  const [open, setOpen] = useState(true);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    memberToEdit?.eligible || []
  );

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: memberToEdit ? {
      ...memberToEdit,
      eligible: memberToEdit.eligible || []
    } : {
      id: "",
      firstName: "",
      lastName: "",
      phone: "",
      location: "In RTCC",
      iqama: "",
      eligible: []
    }
  });

  const { execute: executeCreate, isLoading: isCreating } = useActionState(createTeamMember, {
    onSuccess: () => {
      toast.success("Team member created successfully");
      form.reset();
      setOpen(false);
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    },
    onError: (error) => toast.error(error || "Failed to create team member")
  });
  
  const { execute: executeUpdate, isLoading: isUpdating } = useActionState(updateTeamMember, {
    onSuccess: () => {
      toast.success("Team member updated successfully");
      setOpen(false);
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    },
    onError: (error) => toast.error(error || "Failed to update team member")
  });

  const isSubmitting = isCreating || isUpdating;

  const onSubmit = async (values: TeamFormValues) => {
    // Include the selected skills in the form values
    const formData = {
      ...values,
      eligible: selectedSkills
    };
    
    try {
      if (memberToEdit) {
        await executeUpdate(memberToEdit.id, formData);
      } else {
        await executeCreate(formData);
      }
    } catch (error) {
      // Errors are handled by the hooks
    }
  };

  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose();
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => {
      if (prev.includes(skill)) {
        return prev.filter(s => s !== skill);
      } else {
        return [...prev, skill];
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {memberToEdit ? "Edit Team Member" : "Add New Team Member"}
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
                    <FormLabel>Member ID</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter member ID" 
                        {...field} 
                        disabled={!!memberToEdit}
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
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TEAM_LOCATIONS.map((option) => (
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
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="iqama"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Iqama Document URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter document URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <FormLabel>Skills</FormLabel>
              <div className="mt-2 flex flex-wrap gap-2">
                {TEAM_SKILLS.map((skill) => (
                  <Badge
                    key={skill}
                    variant={selectedSkills.includes(skill) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleSkill(skill)}
                  >
                    {skill}
                    {selectedSkills.includes(skill) && (
                      <X className="ml-1 h-3 w-3" />
                    )}
                  </Badge>
                ))}
              </div>
              {selectedSkills.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  No skills selected. Click on skills to add them.
                </p>
              )}
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
                {memberToEdit ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TeamForm; 