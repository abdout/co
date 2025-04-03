'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createProject } from '@/actions/projects';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';

export default function ProjectCreateForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customer: '',
    location: '',
    consultant: '',
    client: '',
    voltages: ['LV'],
    lvOptions: {
      lvSwgr: { label: '' },
      lvTrafo: { label: '' },
      lvCable: '',
      lvRmu: ''
    },
    mvOptions: {
      mvSwgr: { label: '' },
      mvTrafo: { label: '' },
      mvCable: '',
      mvRmu: ''
    },
    hvOptions: {
      hvSwgr: { label: '' },
      hvTrafo: { label: '' },
      hvCable: '',
      hvRmu: ''
    },
    evOptions: {
      evSwgr: { label: '' },
      evTrafo: { label: '' },
      evCable: '',
      evRmu: ''
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVoltageChange = (voltage: string, checked: boolean) => {
    setFormData(prev => {
      const updatedVoltages = checked 
        ? [...prev.voltages, voltage]
        : prev.voltages.filter(v => v !== voltage);
      
      return {
        ...prev,
        voltages: updatedVoltages
      };
    });
  };

  const handleOptionChange = (category: string, option: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [option]: { label: value }
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Add additional required fields for the model
      const projectData = {
        ...formData,
        title: formData.customer,
        desc: `Project for ${formData.customer}`,
        club: "",
        status: "Active",
        readme: "",
        roadmap: "",
        task: "",
        contributor: "",
        material: "",
        chat: ""
      };

      const result = await createProject(projectData);
      
      if (result.success) {
        setSuccess('Project created successfully!');
        // Reset form
        setFormData({
          customer: '',
          location: '',
          consultant: '',
          client: '',
          voltages: ['LV'],
          lvOptions: {
            lvSwgr: { label: '' },
            lvTrafo: { label: '' },
            lvCable: '',
            lvRmu: ''
          },
          mvOptions: {
            mvSwgr: { label: '' },
            mvTrafo: { label: '' },
            mvCable: '',
            mvRmu: ''
          },
          hvOptions: {
            hvSwgr: { label: '' },
            hvTrafo: { label: '' },
            hvCable: '',
            hvRmu: ''
          },
          evOptions: {
            evSwgr: { label: '' },
            evTrafo: { label: '' },
            evCable: '',
            evRmu: ''
          }
        });
      } else {
        setError(result.message || 'Failed to create project');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Project</CardTitle>
        <CardDescription>Enter details to create a new project</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="customer">Project Name</Label>
              <Input
                id="customer"
                name="customer"
                value={formData.customer}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="consultant">Consultant</Label>
              <Input
                id="consultant"
                name="consultant"
                value={formData.consultant}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="client">Client</Label>
              <Input
                id="client"
                name="client"
                value={formData.client}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Voltage Options</Label>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="lv" 
                    checked={formData.voltages.includes('LV')}
                    onCheckedChange={(checked) => handleVoltageChange('LV', checked as boolean)} 
                  />
                  <Label htmlFor="lv">LV</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="mv" 
                    checked={formData.voltages.includes('MV')}
                    onCheckedChange={(checked) => handleVoltageChange('MV', checked as boolean)} 
                  />
                  <Label htmlFor="mv">MV</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="hv" 
                    checked={formData.voltages.includes('HV')}
                    onCheckedChange={(checked) => handleVoltageChange('HV', checked as boolean)} 
                  />
                  <Label htmlFor="hv">HV</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="ev" 
                    checked={formData.voltages.includes('EV')}
                    onCheckedChange={(checked) => handleVoltageChange('EV', checked as boolean)} 
                  />
                  <Label htmlFor="ev">EV</Label>
                </div>
              </div>
            </div>
            
            {/* LV Options */}
            {formData.voltages.includes('LV') && (
              <div className="grid gap-2 border p-4 rounded-md">
                <Label>LV Options</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lvSwgr">LV Switchgear</Label>
                    <Input
                      id="lvSwgr"
                      name="lvSwgr"
                      value={formData.lvOptions.lvSwgr.label}
                      onChange={(e) => handleOptionChange('lvOptions', 'lvSwgr', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lvTrafo">LV Transformer</Label>
                    <Input
                      id="lvTrafo"
                      name="lvTrafo"
                      value={formData.lvOptions.lvTrafo.label}
                      onChange={(e) => handleOptionChange('lvOptions', 'lvTrafo', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* MV Options */}
            {formData.voltages.includes('MV') && (
              <div className="grid gap-2 border p-4 rounded-md">
                <Label>MV Options</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mvSwgr">MV Switchgear</Label>
                    <Input
                      id="mvSwgr"
                      name="mvSwgr"
                      value={formData.mvOptions.mvSwgr.label}
                      onChange={(e) => handleOptionChange('mvOptions', 'mvSwgr', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="mvTrafo">MV Transformer</Label>
                    <Input
                      id="mvTrafo"
                      name="mvTrafo"
                      value={formData.mvOptions.mvTrafo.label}
                      onChange={(e) => handleOptionChange('mvOptions', 'mvTrafo', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 p-3 rounded-md text-red-500">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 p-3 rounded-md text-green-500">
                {success}
              </div>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="mt-4 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Project'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 