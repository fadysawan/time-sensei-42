// NewsSettings Component - Single Responsibility: Handle news template and instance management UI
import React, { useState } from 'react';
import { Plus, Trash2, Calendar, Clock, AlertCircle, TrendingUp, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { NewsTemplate, NewsInstance, NewsImpact } from '../../models';
import { NewsService } from '../../services';

interface NewsSettingsProps {
  newsTemplates: NewsTemplate[];
  newsInstances: NewsInstance[];
  onUpdateNewsTemplates: (templates: NewsTemplate[]) => void;
  onUpdateNewsInstances: (instances: NewsInstance[]) => void;
}

export const NewsSettings: React.FC<NewsSettingsProps> = ({
  newsTemplates,
  newsInstances,
  onUpdateNewsTemplates,
  onUpdateNewsInstances
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [instanceForm, setInstanceForm] = useState({
    name: '',
    datetime: '',
    description: ''
  });
  
  // Template management state
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [templateForm, setTemplateForm] = useState({
    name: '',
    countdownMinutes: 5,
    cooldownMinutes: 15,
    impact: 'medium' as NewsImpact,
    description: ''
  });

  // Load default templates if none exist
  const availableTemplates = newsTemplates.length > 0 
    ? newsTemplates 
    : NewsService.getDefaultNewsTemplates();

  const handleCreateInstance = () => {
    const template = availableTemplates.find(t => t.id === selectedTemplate);
    if (!template || !instanceForm.datetime) return;

    const scheduledDateTime = new Date(instanceForm.datetime);
    
    const newInstance = NewsService.createNewsInstance(template, scheduledDateTime, {
      name: instanceForm.name || template.name,
      description: instanceForm.description || template.description
    });

    const validation = NewsService.validateNewsInstance(newInstance);
    if (!validation.isValid) {
      alert('Validation Error:\n' + validation.errors.join('\n'));
      return;
    }

    onUpdateNewsInstances([...newsInstances, newInstance]);
    
    // Reset form
    setInstanceForm({
      name: '',
      datetime: '',
      description: ''
    });
    setSelectedTemplate('');
  };

  const handleDeleteInstance = (instanceId: string) => {
    onUpdateNewsInstances(newsInstances.filter(i => i.id !== instanceId));
  };

  const handleToggleInstance = (instanceId: string) => {
    onUpdateNewsInstances(
      newsInstances.map(instance => 
        instance.id === instanceId 
          ? { ...instance, isActive: !instance.isActive }
          : instance
      )
    );
  };

  const getImpactBadgeColor = (impact: NewsImpact): string => {
    switch (impact) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'medium': return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'low': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
    }
  };

  const formatDateTime = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(new Date(date));
  };

  // Template management functions
  const handleCreateTemplate = () => {
    if (!templateForm.name.trim()) {
      alert('Template name is required');
      return;
    }

    const newTemplate: NewsTemplate = {
      id: `template_${Date.now()}`,
      type: 'news',
      name: templateForm.name.trim(),
      countdownMinutes: templateForm.countdownMinutes,
      cooldownMinutes: templateForm.cooldownMinutes,
      impact: templateForm.impact,
      description: templateForm.description.trim()
    };

    onUpdateNewsTemplates([...newsTemplates, newTemplate]);
    setIsCreatingTemplate(false);
    resetTemplateForm();
  };

  const handleEditTemplate = (templateId: string) => {
    const template = availableTemplates.find(t => t.id === templateId);
    if (template) {
      setTemplateForm({
        name: template.name,
        countdownMinutes: template.countdownMinutes,
        cooldownMinutes: template.cooldownMinutes,
        impact: template.impact,
        description: template.description
      });
      setEditingTemplate(templateId);
    }
  };

  const handleUpdateTemplate = () => {
    if (!templateForm.name.trim() || !editingTemplate) return;

    // Check if we're editing an existing user template or a default template
    const existingUserTemplate = newsTemplates.find(t => t.id === editingTemplate);
    
    if (existingUserTemplate) {
      // Update existing user template
      const updatedTemplates = newsTemplates.map(template =>
        template.id === editingTemplate
          ? {
              ...template,
              name: templateForm.name.trim(),
              countdownMinutes: templateForm.countdownMinutes,
              cooldownMinutes: templateForm.cooldownMinutes,
              impact: templateForm.impact,
              description: templateForm.description.trim()
            }
          : template
      );
      onUpdateNewsTemplates(updatedTemplates);
    } else {
      // Converting default template to user template
      const updatedTemplate: NewsTemplate = {
        id: editingTemplate,
        type: 'news',
        name: templateForm.name.trim(),
        countdownMinutes: templateForm.countdownMinutes,
        cooldownMinutes: templateForm.cooldownMinutes,
        impact: templateForm.impact,
        description: templateForm.description.trim()
      };
      onUpdateNewsTemplates([...newsTemplates, updatedTemplate]);
    }

    setEditingTemplate(null);
    resetTemplateForm();
  };

  const handleDeleteTemplate = (templateId: string) => {
    // Check if template is being used by any instances
    const usedInInstances = newsInstances.some(instance => instance.templateId === templateId);
    if (usedInInstances) {
      const confirmed = confirm('This template is used by existing news instances. Delete anyway?');
      if (!confirmed) return;
    }

    // Check if it's a default template or user template
    const isDefaultTemplate = !newsTemplates.some(t => t.id === templateId);
    
    if (isDefaultTemplate) {
      // For default templates, we add them to a "hidden" list (or we could add a disabled flag)
      // For now, we'll just show an alert that default templates can't be deleted
      alert('Default templates cannot be permanently deleted. To hide this template, you can customize it instead.');
      return;
    }

    // Delete user-created template
    onUpdateNewsTemplates(newsTemplates.filter(t => t.id !== templateId));
    
    // Clean up instances using this template
    if (usedInInstances) {
      onUpdateNewsInstances(newsInstances.filter(instance => instance.templateId !== templateId));
    }
  };

  const resetTemplateForm = () => {
    setTemplateForm({
      name: '',
      countdownMinutes: 5,
      cooldownMinutes: 15,
      impact: 'medium',
      description: ''
    });
  };

  const cancelTemplateEdit = () => {
    setIsCreatingTemplate(false);
    setEditingTemplate(null);
    resetTemplateForm();
  };

  // Generate current datetime in local format for datetime-local input
  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <Tabs defaultValue="events" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="events" className="flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span>News Events</span>
          <Badge variant="secondary" className="ml-2">{newsInstances.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="templates" className="flex items-center space-x-2">
          <Settings className="h-4 w-4" />
          <span>Templates</span>
          <Badge variant="secondary" className="ml-2">{availableTemplates.length}</Badge>
        </TabsTrigger>
      </TabsList>

      {/* News Events Tab - Priority */}
      <TabsContent value="events" className="space-y-6 mt-6">
        {/* Create New News Instance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5 text-blue-400" />
              <span>Schedule News Event</span>
            </CardTitle>
            <CardDescription>
              Create a specific occurrence of a news event for a given date and time
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* News Template Selection */}
            <div className="space-y-2">
              <Label>News Type</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select news type..." />
                </SelectTrigger>
                <SelectContent>
                  {availableTemplates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center space-x-2">
                        <Badge className={getImpactBadgeColor(template.impact)}>
                          {template.impact}
                        </Badge>
                        <span>{template.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedTemplate && (
              <>
                {/* Template Info */}
                <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                  <div className="text-sm space-y-1">
                    <div className="font-medium text-blue-400">Template Settings:</div>
                    <div className="text-muted-foreground">
                      Countdown: {availableTemplates.find(t => t.id === selectedTemplate)?.countdownMinutes} min • 
                      Cooldown: {availableTemplates.find(t => t.id === selectedTemplate)?.cooldownMinutes} min
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {availableTemplates.find(t => t.id === selectedTemplate)?.description}
                    </div>
                  </div>
                </div>

                {/* Instance Details */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Custom Name (Optional)</Label>
                    <Input
                      placeholder="Override template name..."
                      value={instanceForm.name}
                      onChange={(e) => setInstanceForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Scheduled Time</Label>
                    <Input
                      type="datetime-local"
                      value={instanceForm.datetime}
                      onChange={(e) => setInstanceForm(prev => ({ ...prev, datetime: e.target.value }))}
                      min={getCurrentDateTime()}
                    />
                    <div className="text-xs text-muted-foreground">
                      Impact level is locked to template setting: {availableTemplates.find(t => t.id === selectedTemplate)?.impact}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description (Optional)</Label>
                    <Textarea
                      placeholder="Additional details about this news event..."
                      value={instanceForm.description}
                      onChange={(e) => setInstanceForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={2}
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleCreateInstance}
                  disabled={!selectedTemplate || !instanceForm.datetime}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create News Event
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Scheduled News Instances */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-green-400" />
              <span>Scheduled News Events</span>
              <Badge variant="secondary">{newsInstances.length}</Badge>
            </CardTitle>
            <CardDescription>
              Manage your scheduled news events and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {newsInstances.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                <p>No news events scheduled</p>
                <p className="text-sm">Create your first news event above</p>
              </div>
            ) : (
              <div className="space-y-3">
                {newsInstances
                  .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())
                  .map(instance => {
                    const template = availableTemplates.find(t => t.id === instance.templateId);
                    const isPast = new Date(instance.scheduledTime) < new Date();
                    
                    return (
                      <div 
                        key={instance.id}
                        className={`p-3 rounded-lg border transition-all ${
                          instance.isActive 
                            ? 'border-border/50 bg-background' 
                            : 'border-border/30 bg-muted/30 opacity-60'
                        } ${isPast ? 'border-red-500/30 bg-red-500/5' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <div className="flex items-center space-x-2">
                              <Badge className={getImpactBadgeColor(instance.impact)}>
                                {instance.impact}
                              </Badge>
                              {isPast && (
                                <Badge variant="secondary" className="bg-red-500/20 text-red-400">
                                  Past
                                </Badge>
                              )}
                            </div>
                            
                            <div className="min-w-0 flex-1">
                              <div className="font-medium text-sm truncate">
                                {instance.name}
                              </div>
                              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>{formatDateTime(instance.scheduledTime)}</span>
                                {template && (
                                  <>
                                    <span>•</span>
                                    <span>{template.countdownMinutes}m countdown</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleInstance(instance.id)}
                              className={instance.isActive ? 'text-green-400' : 'text-muted-foreground'}
                            >
                              {instance.isActive ? 'Active' : 'Disabled'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteInstance(instance.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        {instance.description && (
                          <div className="mt-2 text-xs text-muted-foreground border-t border-border/30 pt-2">
                            {instance.description}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Templates Management Tab */}
      <TabsContent value="templates" className="space-y-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-purple-400" />
                <span>News Templates</span>
                <Badge variant="secondary">{availableTemplates.length}</Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCreatingTemplate(true)}
                disabled={isCreatingTemplate || editingTemplate !== null}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </CardTitle>
            <CardDescription>
              Manage reusable news event types. Default templates can be customized to create your own versions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Template Creation/Edit Form */}
            {(isCreatingTemplate || editingTemplate) && (
              <div className="mb-6 p-4 border border-blue-500/20 bg-blue-500/5 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-blue-400">
                    {editingTemplate 
                      ? (newsTemplates.some(t => t.id === editingTemplate) 
                          ? 'Edit Template' 
                          : 'Customize Default Template')
                      : 'Create New Template'}
                  </h4>
                  <Button variant="ghost" size="sm" onClick={cancelTemplateEdit}>
                    ×
                  </Button>
                </div>
                
                {editingTemplate && !newsTemplates.some(t => t.id === editingTemplate) && (
                  <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-sm text-amber-400">
                    <strong>Customizing Default Template:</strong> This will create your own copy that you can edit. The original default template will remain available.
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Template Name</Label>
                    <Input
                      placeholder="e.g., NFP, CPI, Fed Meeting..."
                      value={templateForm.name}
                      onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Default Impact</Label>
                      <Select 
                        value={templateForm.impact} 
                        onValueChange={(value: NewsImpact) => setTemplateForm(prev => ({ ...prev, impact: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">
                            <Badge className={getImpactBadgeColor('low')}>Low</Badge>
                          </SelectItem>
                          <SelectItem value="medium">
                            <Badge className={getImpactBadgeColor('medium')}>Medium</Badge>
                          </SelectItem>
                          <SelectItem value="high">
                            <Badge className={getImpactBadgeColor('high')}>High</Badge>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Countdown Minutes</Label>
                      <Input
                        type="number"
                        min="1"
                        max="60"
                        value={templateForm.countdownMinutes}
                        onChange={(e) => setTemplateForm(prev => ({ ...prev, countdownMinutes: parseInt(e.target.value) || 5 }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Cooldown Minutes</Label>
                      <Input
                        type="number"
                        min="1"
                        max="30"
                        value={templateForm.cooldownMinutes}
                        onChange={(e) => setTemplateForm(prev => ({ ...prev, cooldownMinutes: parseInt(e.target.value) || 15 }))}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Default description for this type of news event..."
                      value={templateForm.description}
                      onChange={(e) => setTemplateForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={2}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={cancelTemplateEdit}>
                      Cancel
                    </Button>
                    <Button onClick={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}>
                      {editingTemplate ? 'Update Template' : 'Create Template'}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Template List */}
            <div className="space-y-3">
              {availableTemplates.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <TrendingUp className="h-6 w-6 mx-auto mb-2 opacity-50" />
                  <p>No templates available</p>
                  <p className="text-sm">Create your first template to get started</p>
                </div>
              ) : (
                availableTemplates.map(template => {
                  const usageCount = newsInstances.filter(i => i.templateId === template.id).length;
                  const isDefaultTemplate = !newsTemplates.some(t => t.id === template.id);
                  
                  return (
                    <div key={template.id} className="p-3 border border-border/50 rounded-lg bg-background">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <div className="flex items-center space-x-2">
                            <Badge className={getImpactBadgeColor(template.impact)}>
                              {template.impact}
                            </Badge>
                            {isDefaultTemplate && (
                              <Badge variant="outline" className="text-xs">
                                Default
                              </Badge>
                            )}
                          </div>
                          
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-sm">{template.name}</div>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <span>{template.countdownMinutes}m countdown</span>
                              <span>•</span>
                              <span>{template.cooldownMinutes}m cooldown</span>
                              <span>•</span>
                              <span>{usageCount} instance{usageCount !== 1 ? 's' : ''}</span>
                            </div>
                            {template.description && (
                              <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                {template.description}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditTemplate(template.id)}
                            disabled={isCreatingTemplate || editingTemplate !== null}
                          >
                            {isDefaultTemplate ? 'Customize' : 'Edit'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteTemplate(template.id)}
                            className="text-red-400 hover:text-red-300"
                            disabled={isCreatingTemplate || editingTemplate !== null}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};