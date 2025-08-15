"use client";

import React, { useState } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Settings, Eye, EyeOff, Users, UserCheck, Copy, CopyCheck } from 'lucide-react';
import { useFormStore } from '@/store/form';
import toast from 'react-hot-toast';

interface FormSettingsDropdownProps {
  formId: string;
  onTogglePublish: () => Promise<void>;
  onToggleAnonymous: (allow: boolean) => Promise<void>;
  onToggleDuplicates: (allow: boolean) => Promise<void>;
  isLoading?: boolean;
}

export function FormSettingsDropdown({ 
  formId, 
  onTogglePublish, 
  onToggleAnonymous, 
  onToggleDuplicates,
  isLoading = false 
}: FormSettingsDropdownProps) {
  const { 
    isPublished, 
    allowAnonymous, 
    allowDuplicates,
    setIsPublished,
    setAllowAnonymous,
    setAllowDuplicates
  } = useFormStore();

  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleTogglePublish = async () => {
    if (isUpdating) return;
    
    setIsUpdating('publish');
    try {
      await onTogglePublish();
      setIsPublished(!isPublished);

    } catch (error) {

      console.error('Failed to toggle publish:', error);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleToggleAnonymous = async () => {
    if (isUpdating) return;
    
    setIsUpdating('anonymous');
    try {
      const newValue = !allowAnonymous;
      await onToggleAnonymous(newValue);
      setAllowAnonymous(newValue);
      toast.success(
        newValue ? 'Anonymous responses enabled' : 'Verified responses only enabled'
      );
    } catch (error) {
      toast.error('Failed to update response settings');
      console.error('Failed to toggle anonymous:', error);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleToggleDuplicates = async () => {
    if (isUpdating) return;
    
    setIsUpdating('duplicates');
    try {
      const newValue = !allowDuplicates;
      await onToggleDuplicates(newValue);
      setAllowDuplicates(newValue);
      toast.success(
        newValue ? 'Duplicate responses allowed' : 'Unique responses only enabled'
      );
    } catch (error) {
      toast.error('Failed to update duplicate settings');
      console.error('Failed to toggle duplicates:', error);
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Form Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Publish/Unpublish */}
        <DropdownMenuCheckboxItem
          checked={isPublished}
          onCheckedChange={handleTogglePublish}
          disabled={isUpdating === 'publish'}
          className="flex items-center gap-2"
        >
          {isPublished ? (
            <>
              <Eye className="h-4 w-4" />
              Published
            </>
          ) : (
            <>
              <EyeOff className="h-4 w-4" />
              Draft
            </>
          )}
          {isUpdating === 'publish' && (
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current ml-auto" />
          )}
        </DropdownMenuCheckboxItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          Response Settings
        </DropdownMenuLabel>

        {/* Anonymous vs Verified Responses */}
        <DropdownMenuCheckboxItem
          checked={allowAnonymous}
          onCheckedChange={handleToggleAnonymous}
          disabled={isUpdating === 'anonymous'}
          className="flex items-center gap-2"
        >
          {allowAnonymous ? (
            <>
              <Users className="h-4 w-4" />
              Anonymous Responses
            </>
          ) : (
            <>
              <UserCheck className="h-4 w-4" />
              Verified Responses Only
            </>
          )}
          {isUpdating === 'anonymous' && (
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current ml-auto" />
          )}
        </DropdownMenuCheckboxItem>

        {/* Duplicate vs Unique Responses */}
        <DropdownMenuCheckboxItem
          checked={allowDuplicates}
          onCheckedChange={handleToggleDuplicates}
          disabled={isUpdating === 'duplicates'}
          className="flex items-center gap-2"
        >
          {allowDuplicates ? (
            <>
              <Copy className="h-4 w-4" />
              Allow Duplicate Responses
            </>
          ) : (
            <>
              <CopyCheck className="h-4 w-4" />
              Unique Responses Only
            </>
          )}
          {isUpdating === 'duplicates' && (
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current ml-auto" />
          )}
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
