"use client";

import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";

import {
    Input,
    Button,
    Card,
    Checkbox,
    Dialog,
    Label,
    Select,
    Switch,
    Table,
    Tabs,
    Textarea,
    Tooltip 
} from "@/components/ui/form-fields";

import Image from 'next/image';
import Logo from "@/public/Logo.svg"; // Assuming you have a Logo SVG
import Link from 'next/link';

// NOTE: I'm only including a few components for this example to keep it concise.
// The principle applies to all your components.
const components = [
    { label: "Input", Component: Input },
    { label: "Textarea", Component: Textarea },
    { label: "Button", Component: Button },
    { label: "Checkbox", Component: Checkbox },
    { label: "Select", Component: Select },
    { label: "Switch", Component: Switch },
    { label: "Label", Component: Label },
    { label: "Dialog", Component: Dialog },
    { label: "Tooltip", Component: Tooltip }
];

function FormCreateSidebar() {
  const handleDragStart = (e: React.DragEvent, componentType: string) => {
    // This sets the data that will be available when the item is dropped
    e.dataTransfer.setData("componentType", componentType);
  };

  return (
   <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <Link href="/">
          {/* Using Image component for SVG */}
          <Image src={Logo} alt="Logo" className="w-24 h-auto" />
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarGroup>
            <SidebarGroupLabel className='text-lg font-semibold mb-2'>
                Form Elements
            </SidebarGroupLabel>
            
            <div className="grid grid-cols-1 gap-4">
                {components.map((item) => (
                    <div
                        key={item.label}
                        // onDragStart={(e) => handleDragStart(e, item.label)}
                        className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800  "
                    >
                        <Label className="font-medium text-gray-700 dark:text-gray-300">{item.label}</Label>
                        <div className="mt-2   bg-white dark:bg-gray-900 ">
                            {/* Add props to make components visible */}
                            {item.label === "Input" && <Input draggable placeholder="Example Input"  />}
                            {item.label === "Textarea" && <Textarea draggable placeholder="Example Textarea"  />}
                            {item.label === "Button" && <Button draggable >Example Button</Button>}
                            {item.label === "Checkbox" && (
                                <div className="flex items-center space-x-2" draggable >
                                    <Checkbox id={`cb-${item.label}`} />
                                    <Label htmlFor={`cb-${item.label}`}>Checkbox</Label>
                                </div>
                            )}
                            {item.label === "Select" && (
                                <Select >
                                    <option>Select Option</option>
                                </Select>
                            )}
                            {item.label === "Switch" && (
                                <div className="flex items-center space-x-2" draggable >
                                    <Switch id={`sw-${item.label}`} />
                                    <Label htmlFor={`sw-${item.label}`}>Switch</Label>
                                </div>
                            )}
                            {item.label === "Label" && <Label draggable >Example Label</Label>}
                            {item.label === "Card" && (
                                <Card className="p-2" draggable >
                                    <div>Card Content</div>
                                </Card>
                            )}
                            {item.label === "Dialog" && <div className="text-sm text-gray-500" draggable >Dialog Component</div>}
                           
                            
                            {item.label === "Tooltip" && <div className="text-sm text-gray-500" draggable >Tooltip Component</div>}
                        </div>
                    </div>
                ))}
            </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

export default FormCreateSidebar;