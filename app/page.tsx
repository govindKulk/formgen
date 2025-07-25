"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar } from "@/components/ui/calendar";

export default function Home() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [switchChecked, setSwitchChecked] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [radioValue, setRadioValue] = useState("option1");

  const ComponentShowcase = ({ 
    title, 
    description, 
    props, 
    usage, 
    children 
  }: {
    title: string;
    description: string;
    props: string[];
    usage: string;
    children: React.ReactNode;
  }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 p-6 border rounded-lg">
      <div className="flex justify-center items-center p-4 bg-gray-50 rounded-lg">
        {children}
      </div>
      <div className="space-y-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-gray-600">{description}</p>
        <div>
          <h4 className="font-semibold mb-2">Props:</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            {props.map((prop, index) => (
              <li key={index} className="text-gray-600">{prop}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Usage:</h4>
          <code className="text-sm font-mono bg-gray-100 p-2 rounded block ">{usage}</code>
        </div>
      </div>
    </div>
  );

  return (
    <TooltipProvider>
      <main className="font-sans max-w-7xl mx-auto p-8 space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Shadcn/UI Components Showcase</h1>
          <p className="text-xl text-gray-600">A comprehensive display of all available UI components</p>
        </div>

        {/* Button Component */}
        <ComponentShowcase
          title="Button"
          description="Displays a button or a component that looks like a button."
          props={[
            "variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'",
            "size: 'default' | 'sm' | 'lg' | 'icon'",
            "asChild: boolean"
          ]}
          usage='<Button variant="default" size="default">Click me</Button>'
        >
          <div className="flex gap-4 flex-wrap">
            <Button variant="default">Default</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        </ComponentShowcase>

        {/* Input Component */}
        <ComponentShowcase
          title="Input"
          description="Displays a form input field or a component that looks like an input field."
          props={[
            "type: string",
            "placeholder: string",
            "disabled: boolean",
            "className: string"
          ]}
          usage='<Input type="email" placeholder="Email" />'
        >
          <div className="space-y-4 w-full max-w-sm">
            <Input type="text" placeholder="Text input" />
            <Input type="email" placeholder="Email input" />
            <Input type="password" placeholder="Password input" />
            <Input type="text" placeholder="Disabled input" disabled />
          </div>
        </ComponentShowcase>

        {/* Label Component */}
        <ComponentShowcase
          title="Label"
          description="Renders an accessible label associated with controls."
          props={[
            "htmlFor: string",
            "className: string"
          ]}
          usage='<Label htmlFor="email">Email</Label>'
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" />
          </div>
        </ComponentShowcase>

        {/* Textarea Component */}
        <ComponentShowcase
          title="Textarea"
          description="Displays a form textarea or a component that looks like a textarea."
          props={[
            "placeholder: string",
            "disabled: boolean",
            "rows: number",
            "className: string"
          ]}
          usage='<Textarea placeholder="Type your message here." />'
        >
          <div className="w-full max-w-sm">
            <Textarea placeholder="Type your message here." />
          </div>
        </ComponentShowcase>

        {/* Checkbox Component */}
        <ComponentShowcase
          title="Checkbox"
          description="A control that allows the user to toggle between checked and not checked."
          props={[
            "checked: boolean",
            "onCheckedChange: (checked: boolean) => void",
            "disabled: boolean",
            "id: string"
          ]}
          usage='<Checkbox id="terms" checked={checked} onCheckedChange={setChecked} />'
        >
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="terms" 
              checked={checkboxChecked} 
              onCheckedChange={(checked) => setCheckboxChecked(checked === true)} 
            />
            <Label htmlFor="terms">Accept terms and conditions</Label>
          </div>
        </ComponentShowcase>

        {/* Radio Group Component */}
        <ComponentShowcase
          title="Radio Group"
          description="A set of checkable buttons—known as radio buttons—where no more than one of the buttons can be checked at a time."
          props={[
            "value: string",
            "onValueChange: (value: string) => void",
            "disabled: boolean",
            "orientation: 'horizontal' | 'vertical'"
          ]}
          usage='<RadioGroup value={value} onValueChange={setValue}>'
        >
          <RadioGroup value={radioValue} onValueChange={setRadioValue}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option1" id="option1" />
              <Label htmlFor="option1">Option 1</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option2" id="option2" />
              <Label htmlFor="option2">Option 2</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option3" id="option3" />
              <Label htmlFor="option3">Option 3</Label>
            </div>
          </RadioGroup>
        </ComponentShowcase>

        {/* Switch Component */}
        <ComponentShowcase
          title="Switch"
          description="A control that allows the user to toggle between checked and not checked."
          props={[
            "checked: boolean",
            "onCheckedChange: (checked: boolean) => void",
            "disabled: boolean",
            "id: string"
          ]}
          usage='<Switch checked={checked} onCheckedChange={setChecked} />'
        >
          <div className="flex items-center space-x-2">
            <Switch 
              id="airplane-mode" 
              checked={switchChecked} 
              onCheckedChange={setSwitchChecked} 
            />
            <Label htmlFor="airplane-mode">Airplane Mode</Label>
          </div>
        </ComponentShowcase>

        {/* Select Component */}
        <ComponentShowcase
          title="Select"
          description="Displays a list of options for the user to pick from—triggered by a button."
          props={[
            "value: string",
            "onValueChange: (value: string) => void",
            "disabled: boolean",
            "placeholder: string"
          ]}
          usage='<Select><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>...</SelectContent></Select>'
        >
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </SelectContent>
          </Select>
        </ComponentShowcase>

        {/* Card Component */}
        <ComponentShowcase
          title="Card"
          description="Displays a card with header, content, and footer."
          props={[
            "className: string",
            "CardHeader: component",
            "CardTitle: component",
            "CardDescription: component",
            "CardContent: component"
          ]}
          usage='
          <Card>
            <CardHeader>
              <CardTitle>Title</CardTitle>
            </CardHeader>
            <CardContent>Content</CardContent>
          </Card>'
        >
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Create project</CardTitle>
              <CardDescription>Deploy your new project in one-click.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card content goes here. This is a sample card component.</p>
            </CardContent>
          </Card>
        </ComponentShowcase>

        {/* Tabs Component */}
        <ComponentShowcase
          title="Tabs"
          description="A set of layered sections of content—known as tab panels—that are displayed one at a time."
          props={[
            "value: string",
            "onValueChange: (value: string) => void",
            "orientation: 'horizontal' | 'vertical'",
            "activationMode: 'automatic' | 'manual'"
          ]}
          usage='<Tabs value={value}><TabsList><TabsTrigger>Tab</TabsTrigger></TabsList><TabsContent>Content</TabsContent></Tabs>'
        >
          <Tabs defaultValue="account" className="w-[400px]">
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <p>Make changes to your account here.</p>
            </TabsContent>
            <TabsContent value="password">
              <p>Change your password here.</p>
            </TabsContent>
          </Tabs>
        </ComponentShowcase>

        {/* Accordion Component */}
        <ComponentShowcase
          title="Accordion"
          description="A vertically stacked set of interactive headings that each reveal a section of content."
          props={[
            "type: 'single' | 'multiple'",
            "collapsible: boolean",
            "value: string | string[]",
            "onValueChange: function"
          ]}
          usage='<Accordion type="single"><AccordionItem><AccordionTrigger>Title</AccordionTrigger><AccordionContent>Content</AccordionContent></AccordionItem></Accordion>'
        >
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it styled?</AccordionTrigger>
              <AccordionContent>
                Yes. It comes with default styles that matches the other components' aesthetic.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ComponentShowcase>

        {/* Avatar Component */}
        <ComponentShowcase
          title="Avatar"
          description="An image element with a fallback for representing the user."
          props={[
            "src: string",
            "alt: string",
            "fallback: string",
            "className: string"
          ]}
          usage='<Avatar><AvatarImage src="/avatars/01.png" /><AvatarFallback>CN</AvatarFallback></Avatar>'
        >
          <div className="flex space-x-4">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </ComponentShowcase>

        {/* Dialog Component */}
        <ComponentShowcase
          title="Dialog"
          description="A window overlaid on either the primary window or another dialog window, rendering the content underneath inert."
          props={[
            "open: boolean",
            "onOpenChange: (open: boolean) => void",
            "modal: boolean"
          ]}
          usage='<Dialog><DialogTrigger>Open</DialogTrigger><DialogContent><DialogHeader><DialogTitle>Title</DialogTitle></DialogHeader></DialogContent></Dialog>'
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Edit Profile</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name" defaultValue="Pedro Duarte" className="col-span-3" />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </ComponentShowcase>

        {/* Dropdown Menu Component */}
        <ComponentShowcase
          title="Dropdown Menu"
          description="Displays a menu to the user — such as a set of actions or functions — triggered by a button."
          props={[
            "open: boolean",
            "onOpenChange: (open: boolean) => void",
            "modal: boolean"
          ]}
          usage='<DropdownMenu><DropdownMenuTrigger>Open</DropdownMenuTrigger><DropdownMenuContent>...</DropdownMenuContent></DropdownMenu>'
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Open Menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ComponentShowcase>

        {/* Popover Component */}
        <ComponentShowcase
          title="Popover"
          description="Displays rich content in a portal, triggered by a button."
          props={[
            "open: boolean",
            "onOpenChange: (open: boolean) => void",
            "modal: boolean"
          ]}
          usage='<Popover><PopoverTrigger>Open</PopoverTrigger><PopoverContent>Content</PopoverContent></Popover>'
        >
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Open popover</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Dimensions</h4>
                  <p className="text-sm text-muted-foreground">
                    Set the dimensions for the layer.
                  </p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </ComponentShowcase>

        {/* Separator Component */}
        <ComponentShowcase
          title="Separator"
          description="Visually or semantically separates content."
          props={[
            "orientation: 'horizontal' | 'vertical'",
            "decorative: boolean",
            "className: string"
          ]}
          usage='<Separator orientation="horizontal" />'
        >
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
              <p className="text-sm text-muted-foreground">An open-source UI component library.</p>
            </div>
            <Separator />
            <div>
              <h4 className="text-sm font-medium leading-none">Shadcn/UI</h4>
              <p className="text-sm text-muted-foreground">Beautifully designed components built with Radix UI and Tailwind CSS.</p>
            </div>
          </div>
        </ComponentShowcase>

        {/* Table Component */}
        <ComponentShowcase
          title="Table"
          description="A responsive table component."
          props={[
            "className: string",
            "TableHeader: component",
            "TableBody: component",
            "TableRow: component",
            "TableHead: component",
            "TableCell: component"
          ]}
          usage='<Table><TableHeader><TableRow><TableHead>Name</TableHead></TableRow></TableHeader><TableBody>...</TableBody></Table>'
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">INV001</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Credit Card</TableCell>
                <TableCell className="text-right">$250.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">INV002</TableCell>
                <TableCell>Pending</TableCell>
                <TableCell>PayPal</TableCell>
                <TableCell className="text-right">$150.00</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </ComponentShowcase>

        {/* Tooltip Component */}
        <ComponentShowcase
          title="Tooltip"
          description="A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it."
          props={[
            "open: boolean",
            "onOpenChange: (open: boolean) => void",
            "delayDuration: number",
            "skipDelayDuration: number"
          ]}
          usage='<Tooltip><TooltipTrigger>Hover</TooltipTrigger><TooltipContent>Content</TooltipContent></Tooltip>'
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Hover me</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add to library</p>
            </TooltipContent>
          </Tooltip>
        </ComponentShowcase>

        {/* Calendar Component */}
        <ComponentShowcase
          title="Calendar"
          description="A date field component that allows users to enter and edit date."
          props={[
            "mode: 'single' | 'multiple' | 'range'",
            "selected: Date | Date[] | DateRange",
            "onSelect: function",
            "disabled: function",
            "className: string"
          ]}
          usage='<Calendar mode="single" selected={date} onSelect={setDate} />'
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </ComponentShowcase>

      </main>
    </TooltipProvider>
  );
}
