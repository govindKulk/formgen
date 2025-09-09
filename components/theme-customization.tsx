"use client";

import React, { useState } from 'react';
import { FormTheme, useFormStore } from '@/store/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Upload, X, Eye, Pencil } from 'lucide-react';
import { updateFormTheme } from '@/lib/form-actions';
import toast from 'react-hot-toast';
import { debounce } from '@/lib/helper';

interface ThemeCustomizationProps {
  formId: string;
}

export function ThemeCustomization({ formId }: ThemeCustomizationProps) {
  const {
    theme,
    setTheme
  } = useFormStore();

  const [isUpdating, setIsUpdating] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Create a debounced update function that persists across re-renders
  const debouncedUpdateTheme = React.useMemo(
    () => debounce(async (updates: Partial<FormTheme>) => {
      setIsUpdating(true);
      try {
        const result = await updateFormTheme(formId, updates);
        if (result.success) {
          toast.success('Theme updated successfully');
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error('Failed to update theme');
        console.error('Theme update error:', error);
      } finally {
        setIsUpdating(false);
      }
    }, 1000),
    [formId] // Only recreate if formId changes
  );

  const handlePrimaryColorChange = (color: string) => {
    setTheme({ primaryColor: color });
    debouncedUpdateTheme({ primaryColor: color });
  }

  const handleBackgroundColorChange = (color: string) => {
    setTheme({ backgroundColor: color });
    debouncedUpdateTheme({ backgroundColor: color });
  }

  const handleBrandLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    try {
      // Convert to base64 for simple storage (in production, use proper file upload service)
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setTheme({ brandLogo: result });
        debouncedUpdateTheme({ brandLogo: result });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Failed to upload logo');
      console.error('Logo upload error:', error);
    }
  };

  const handleRemoveLogo = () => {
    setTheme({ brandLogo: undefined });
    debouncedUpdateTheme({ brandLogo: undefined });
  };

  const handleTogglePoweredBy = (show: boolean) => {

    alert("changing show powered by" + `${show}`);
    setTheme({ showPoweredBy: show });
    debouncedUpdateTheme({ showPoweredBy: show });
  };

  const handleTextColorChange = (color: string) => {
    setTheme({ textColor: color });
    debouncedUpdateTheme({ textColor: color });
  };

  // Preset color themes
  const colorPresets = [
    { name: 'Blue', primary: '#3b82f6', background: '#ffffff', textColor: '#1f2937' },
    { name: 'Green', primary: '#10b981', background: '#ffffff', textColor: '#1f2937' },
    { name: 'Purple', primary: '#8b5cf6', background: '#ffffff', textColor: '#1f2937' },
    { name: 'Orange', primary: '#f97316', background: '#ffffff', textColor: '#1f2937' },
    { name: 'Pink', primary: '#ec4899', background: '#ffffff', textColor: '#1f2937' },
    { name: 'Dark', primary: '#3b82f6', background: '#1f2937', textColor: '#ffffff' },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div
            className='space-y-1'
          >
            <CardTitle className="flex items-center gap-2 justify-between">
              <span
                className='w-full flex items-center gap-2'
              >
                <Palette className="h-5 w-5" />
                Theme
              </span>

              <Button
                variant="outline"
                size="sm"
                className='flex items-center justify-center'
                onClick={() => setPreviewMode(!previewMode)}
              >
                {!previewMode ? <Eye className="h-4 w-4 " /> : <Pencil className="h-4 w-4 " />}

              </Button>
            </CardTitle>
            <CardDescription
              className='text-xs'
            >
              Customize the appearance of your form
            </CardDescription>
          </div>

        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {!previewMode ? (
          <>
            {/* Color Presets */}
            <div className=''>
              <Label className="text-sm font-medium mb-3 block">Quick Themes</Label>
              <div className="grid grid-cols-3 gap-2">
                {colorPresets.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    size="sm"
                    className="h-12 flex flex-col gap-1 p-2 bg-slate-100 cursor-pointer hover:bg-slate-50 transition-all hover:shadow-lg duration-200"
                    onClick={() => {
                      setTheme({
                        primaryColor: preset.primary,
                        backgroundColor: preset.background,
                        textColor: preset.textColor,
                      })
                      debouncedUpdateTheme({
                        primaryColor: preset.primary,
                        backgroundColor: preset.background,
                        textColor: preset.textColor,
                      });
                    }}
                    disabled={isUpdating}
                  >
                    <span className="flex gap-1">
                      <span
                        className="w-2 sm:w-4  h-2 sm:h-4  rounded-full border shadow-xl "
                        style={{ backgroundColor: preset.primary }}
                      />
                      <span
                        className="w-2 sm:w-4  h-2 sm:h-4  rounded-full border shadow-xl "
                        style={{ backgroundColor: preset.background }}
                      />
                      <span
                        className="w-2 sm:w-4  h-2 sm:h-4  rounded-full border shadow-xl "
                        style={{ backgroundColor: preset.textColor }}
                      />
                    </span>
                    <span className="text-xs font-bold">{preset.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Custom Colors */}
            <div className="flex flex-col divide-y-2">
              <div className='flex items-center gap-2 justify-between '>
                <Label htmlFor="primary-color" className="text-sm font-medium mb-2 block">
                  Primary Color
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="primary-color"
                    type="color"
                    value={theme.primaryColor}
                    onChange={(e) => handlePrimaryColorChange(e.target.value)}
                    className="w-16 h-10 p-1 cursor-pointer"
                    disabled={isUpdating}
                  />
                  
                </div>
              </div>

              <div className='flex items-center gap-2 justify-between '>
                <Label htmlFor="background-color" className="text-sm font-medium mb-2 block">
                  Background Color
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="background-color"
                    type="color"
                    value={theme.backgroundColor}
                    onChange={(e) => handleBackgroundColorChange(e.target.value)}
                    className="w-16 h-10 p-1 cursor-pointer"
                    disabled={isUpdating}
                  />
                  
                </div>
              </div>

              <div className='flex items-center gap-2 justify-between '>
                <Label htmlFor="text-color" className="text-sm font-medium mb-2 block">
                  Text Color
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="text-color"
                    type="color"
                    value={theme.textColor}
                    onChange={(e) => handleTextColorChange(e.target.value)}
                    className="w-16 h-10 p-1 cursor-pointer"
                    disabled={isUpdating}
                  />
                 
                </div>
              </div>
            </div>

            <Separator />

            {/* Brand Logo */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Brand Logo</Label>
              <div className="space-y-3">
                {theme.brandLogo ? (
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <img
                      src={theme.brandLogo}
                      alt="Brand logo"
                      className="w-12 h-12 object-contain border rounded"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Logo uploaded</p>
                      <p className="text-xs text-muted-foreground">
                        This will appear at the top of your form
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveLogo}
                      disabled={isUpdating}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Upload your brand logo</p>
                    <p className="text-xs text-gray-500 mb-3">
                      PNG, JPG up to 2MB
                    </p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleBrandLogoUpload}
                      className="hidden"
                      id="logo-upload"
                      disabled={isUpdating}
                    />
                    <Label htmlFor="logo-upload" className="cursor-pointer">
                      <Button variant="outline" size="sm" asChild>
                        <span>Choose File</span>
                      </Button>
                    </Label>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Powered By FormGen */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Show "Powered by FormGen"</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Display FormGen branding at the bottom of your form
                </p>
              </div>
              <Switch
                checked={theme.showPoweredBy}
                onCheckedChange={handleTogglePoweredBy}
                disabled={isUpdating}
              />
            </div>
          </>
        ) : (
          /* Preview Mode */
          <div className="space-y-4 w-full">
            <Label className="text-sm font-medium">Theme Preview</Label>
            <div
              className="border rounded-lg p-6 min-h-[300px]"
              style={{ backgroundColor: theme.backgroundColor }}
            >
              {/* Brand Logo */}
              {theme.brandLogo && (
                <div className="mb-6 text-center">
                  <img
                    src={theme.brandLogo}
                    alt="Brand logo"
                    className="h-12 mx-auto object-contain"
                  />
                </div>
              )}

              {/* Form Preview */}
              <div className="max-w-md mx-auto space-y-4">
                <h2 className="text-xl font-semibold" style={{ color: theme.primaryColor }}>
                  Sample Form Title
                </h2>

                <div className="space-y-3">
                  <div>
                    <label 
                      className="block text-sm font-medium mb-1"
                      style={{ color: theme.textColor }}
                    >
                      Sample Input Field
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your response..."
                      className="w-full p-2 border rounded-md"
                      style={{ 
                        borderColor: theme.primaryColor + '40',
                        color: theme.textColor
                      }}
                    />
                  </div>

                  <div>
                    <p className="text-sm" style={{ color: theme.textColor }}>
                      This is sample text to show the text color in action.
                    </p>
                  </div>

                  <button
                    className="w-full py-2 px-4 rounded-md text-white font-medium"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    Submit
                  </button>
                </div>
              </div>

              {/* Powered By */}
              {theme.showPoweredBy && (
                <div className="mt-8 text-center">
                  <p className="text-xs text-gray-500">
                    Powered by <span className="font-semibold">FormGen</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
