"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFormApi } from '@/hooks/use-form-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Copy,
  Eye,
  Calendar,
  Users,
  BarChart3
} from 'lucide-react';
import { format } from 'date-fns';

interface Form {
  id: string;
  title: string;
  description: string;
  published: boolean;
  visits: number;
  submissions: number;
  shareUrl: string;
  createdAt: string;
  updatedAt: string;
}

export default function FormsPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newFormTitle, setNewFormTitle] = useState('');
  const [filterPublished, setFilterPublished] = useState<'all' | 'published' | 'draft'>('all');
  
  const router = useRouter();
  
  const { getForms, saveForm, deleteForm, togglePublish, isLoading, isSaving } = useFormApi({
    onSuccess: (message) => {
      console.log('Success:', message);
      loadForms(); // Refresh the forms list
    },
    onError: (error) => {
      console.error('Error:', error);
    }
  });

  const loadForms = async () => {
    try {
      const formsData = await getForms();
      setForms(formsData);
    } catch (error) {
      console.error('Failed to load forms:', error);
    }
  };

  useEffect(() => {
    loadForms();
  }, []);

  const handleCreateForm = async () => {
    if (!newFormTitle.trim()) return;
    
    try {
      const newForm = await saveForm(undefined, newFormTitle);
      setIsCreateModalOpen(false);
      setNewFormTitle('');
      // Navigate to the new form
      router.push(`/forms/${newForm.id}`);
    } catch (error) {
      console.error('Failed to create form:', error);
    }
  };

  const handleDeleteForm = async (formId: string) => {
    if (confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      try {
        await deleteForm(formId);
      } catch (error) {
        console.error('Failed to delete form:', error);
      }
    }
  };

  const handleTogglePublish = async (formId: string, currentStatus: boolean) => {
    try {
      await togglePublish(formId, !currentStatus);
    } catch (error) {
      console.error('Failed to toggle publish status:', error);
    }
  };

  const copyShareUrl = async (shareUrl: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/s/${shareUrl}`);
      console.log('Share URL copied to clipboard');
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         form.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterPublished === 'all' ||
                         (filterPublished === 'published' && form.published) ||
                         (filterPublished === 'draft' && !form.published);
    
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="flex gap-4 mb-6">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="h-64">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Forms</h1>
          <p className="text-muted-foreground">
            Create, manage, and analyze your forms
          </p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Form
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Form</DialogTitle>
              <DialogDescription>
                Give your form a name to get started. You can always change this later.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Input
                placeholder="Enter form title..."
                value={newFormTitle}
                onChange={(e) => setNewFormTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateForm()}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateForm} 
                disabled={!newFormTitle.trim() || isSaving}
              >
                {isSaving ? 'Creating...' : 'Create Form'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search forms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Filter: {filterPublished === 'all' ? 'All' : filterPublished === 'published' ? 'Published' : 'Drafts'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilterPublished('all')}>
              All Forms
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterPublished('published')}>
              Published
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterPublished('draft')}>
              Drafts
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Forms Grid */}
      {filteredForms.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 mb-4 text-muted-foreground">
            <BarChart3 className="w-full h-full" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No forms found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? 'Try adjusting your search or filter criteria.' : 'Get started by creating your first form.'}
          </p>
          {!searchQuery && (
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Form
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredForms.map((form) => (
            <Card key={form.id} className="hover:shadow-md transition-shadow cursor-pointer group"
            onClick={() => router.push('/forms/' + form.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-1">{form.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">
                      {form.description || 'No description'}
                    </CardDescription>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/forms/${form.id}`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      {form.published && (
                        <DropdownMenuItem onClick={() => copyShareUrl(form.shareUrl)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Link
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleTogglePublish(form.id, form.published)}>
                        {form.published ? (
                          <>
                            <Eye className="mr-2 h-4 w-4" />
                            Unpublish
                          </>
                        ) : (
                          <>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Publish
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteForm(form.id)
                        }}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="pb-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {form.visits}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {form.submissions}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(form.updatedAt), 'MMM d')}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="pt-0 flex justify-between items-center">
                <Badge variant={form.published ? "default" : "secondary"}>
                  {form.published ? "Published" : "Draft"}
                </Badge>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => router.push(`/forms/${form.id}`)}
                >
                  Edit
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
