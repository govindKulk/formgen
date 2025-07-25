
import FormCanvas from '@/components/form-canvas'
import FormCreateSidebar from '@/components/form-create-sidebar'
import { Sidebar, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'

function CreateFormPage() {
    return (
        <SidebarProvider>
            {/* Form components sidebar */}
            <div
            className='flex gap-4 w-full'
            >
                <FormCreateSidebar/>
                <FormCanvas/>
                <FormCreateSidebar />
            </div>

        </SidebarProvider>
    )
}

export default CreateFormPage