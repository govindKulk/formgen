# Form Content Schema Documentation

## Overview
This document explains how your form content is structured in the database and how it integrates with your form store.

## Database Schema Changes

### Form Model Structure
```prisma
model Form {
  id                        String   @id @default(cuid())
  name                      String   // Form name for identification
  description               String?  // Optional description
  
  // Form styling and configuration
  title                     String   @default("My Form")
  primaryColor              String   @default("#3b82f6")  
  submissionMessage         String   @default("Form submitted successfully!")
  
  // Complete form structure (JSON)
  content                   Json     @default("...")
  
  // Form status and analytics
  published                 Boolean  @default(false)
  visits                    Int      @default(0)
  submissions              Int      @default(0)
  shareUrl                 String   @unique @default(cuid())
  acceptsAnonymousResponses Boolean  @default(false)
  
  // Relations
  userId                   String
  user                     User     @relation(...)
  responses                FormResponse[]
  
  createdAt                DateTime @default(now())
  updatedAt                DateTime @updatedAt
}
```

## Content JSON Structure

The `content` field stores the complete form configuration that matches your FormStore interface:

```typescript
{
  "steps": [
    {
      "id": "step-123",
      "stepTitle": "Personal Information", 
      "components": [
        {
          "id": "comp-456",
          "type": "Input",
          "required": true,
          "showLabel": true,
          "validation": {
            "minLength": 2,
            "maxLength": 50,
            "errorMessage": "Name must be 2-50 characters"
          },
          "props": {
            "label": "Full Name",
            "placeholder": "Enter your full name",
            "inputType": "text"
          }
        },
        {
          "id": "comp-789", 
          "type": "Input",
          "required": true,
          "props": {
            "label": "Email Address",
            "placeholder": "Enter your email",
            "inputType": "email"
          }
        }
      ]
    }
  ],
  "currentStepIndex": 0,
  "title": "Registration Form",
  "primaryColor": "#3b82f6",
  "submissionMessage": "Thank you for registering!",
  "formData": {
    "comp-456": "John Doe",
    "comp-789": "john@example.com"
  }
}
```

## Component Types Supported

- **Input**: Text, email, password, number, tel, url
- **Textarea**: Multi-line text input
- **Select**: Dropdown with options
- **Checkbox**: Boolean checkbox
- **Switch**: Toggle switch
- **Button**: Action buttons
- **Label**: Static text labels
- **Card**: Container components
- **Dialog**: Modal dialogs
- **Tooltip**: Help text

## Key Features

### 1. Multi-Step Forms
- Forms can have multiple steps
- Each step has its own components
- Navigation between steps with validation

### 2. Real-time Validation
- Field-level validation rules
- Custom error messages
- Required field validation
- Pattern matching (regex)
- Length constraints

### 3. Form Data Management
- Real-time form data storage
- Debounced updates to prevent performance issues
- Validation state tracking

### 4. API Integration
- RESTful API endpoints for CRUD operations
- Type-safe data handling
- Authentication with Clerk
- Error handling and validation

## API Endpoints

### Forms Management
- `POST /api/forms` - Create new form
- `GET /api/forms` - List user's forms  
- `GET /api/forms/[id]` - Get specific form
- `PUT /api/forms/[id]` - Update form
- `DELETE /api/forms/[id]` - Delete form

### Form Responses
- Form submissions stored in `FormResponse` model
- Tracks responder information
- Stores submitted form data as JSON

## Usage Examples

### Creating a Form
```typescript
const { saveForm } = useFormApi();

// Create new form from current store state
const newForm = await saveForm(undefined, "My New Form");
```

### Loading a Form
```typescript 
const { loadForm } = useFormApi();

// Load form into store
await loadForm("form-id-123");
```

### Updating a Form
```typescript
const { saveForm } = useFormApi(); 

// Save current store state to existing form
await saveForm("form-id-123");
```

## Data Flow

1. **Form Builder** → User creates form using drag-and-drop interface
2. **Store Management** → FormStore maintains current state
3. **API Layer** → Save/load operations via REST API
4. **Database** → Prisma stores form content as JSON
5. **Form Rendering** → Load stored form for editing or responses

## Benefits of This Approach

✅ **Flexible Schema**: JSON storage allows complex, nested structures
✅ **Type Safety**: TypeScript interfaces ensure data consistency  
✅ **Performance**: Efficient storage and retrieval
✅ **Scalability**: Easy to add new component types
✅ **Multi-tenancy**: User-specific form isolation
✅ **Version Control**: Complete form state versioning

This structure gives you complete flexibility to store any form configuration while maintaining type safety and performance.
