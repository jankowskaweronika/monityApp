# REST API Plan - MonityApp

## 1. Resources

### 1.1 Authentication

- Managed by Supabase Auth
- Endpoints: `/auth/*`

### 1.2 Categories

- Table: `categories`
- Endpoints: `/categories/*`

### 1.3 Expenses

- Table: `expenses`
- Endpoints: `/expenses/*`

### 1.4 Analytics

- Derived from `expenses` and `categories`
- Endpoints: `/analytics/*`

### 1.5 Reporting Periods

- Table: `reporting_periods`
- Endpoints: `/reporting-periods/*`

## 2. Endpoints

### 2.1 Category Endpoints

#### List Categories

- Method: `GET`
- Path: `/categories`
- Query Parameters:
  - `include_default` (boolean, optional)
  - `page` (integer, optional)
  - `limit` (integer, optional)
- Response:

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "description": "string",
      "color": "string",
      "is_default": boolean,
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ],
  "meta": {
    "total": "integer",
    "page": "integer",
    "limit": "integer"
  }
}
```

- Success: 200 OK
- Errors: 401 Unauthorized, 403 Forbidden

#### Create Category

- Method: `POST`
- Path: `/categories`
- Request Body:

```json
{
  "name": "string",
  "description": "string",
  "color": "string",
  "is_default": boolean
}
```

- Response: 201 Created
- Errors: 400 Bad Request, 401 Unauthorized, 403 Forbidden

#### Get Category

- Method: `GET`
- Path: `/categories/{id}`
- Response: 200 OK
- Errors: 401 Unauthorized, 403 Forbidden, 404 Not Found

#### Update Category

- Method: `PUT`
- Path: `/categories/{id}`
- Request Body:

```json
{
  "name": "string",
  "description": "string",
  "color": "string",
  "is_default": boolean
}
```

- Response: 200 OK
- Errors: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found

#### Delete Category

- Method: `DELETE`
- Path: `/categories/{id}`
- Response: 204 No Content
- Errors: 401 Unauthorized, 403 Forbidden, 404 Not Found

### 2.3 Expense Endpoints

#### List Expenses

- Method: `GET`
- Path: `/expenses`
- Query Parameters:
  - `start_date` (date, optional)
  - `end_date` (date, optional)
  - `category_id` (uuid, optional)
  - `page` (integer, optional)
  - `limit` (integer, optional)
  - `sort_by` (string, optional)
  - `sort_order` (string, optional)
- Response:

```json
{
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "category_id": "uuid",
      "amount": "decimal",
      "description": "string",
      "date": "date",
      "created_at": "timestamp",
      "updated_at": "timestamp",
      "category": {
        "id": "uuid",
        "name": "string",
        "color": "string"
      }
    }
  ],
  "meta": {
    "total": "integer",
    "page": "integer",
    "limit": "integer"
  }
}
```

- Success: 200 OK
- Errors: 401 Unauthorized, 403 Forbidden

#### Create Expense

- Method: `POST`
- Path: `/expenses`
- Request Body:

```json
{
  "category_id": "uuid",
  "amount": "decimal",
  "description": "string",
  "date": "date"
}
```

- Response: 201 Created
- Errors: 400 Bad Request, 401 Unauthorized, 403 Forbidden

#### Get Expense

- Method: `GET`
- Path: `/expenses/{id}`
- Response: 200 OK
- Errors: 401 Unauthorized, 403 Forbidden, 404 Not Found

#### Update Expense

- Method: `PUT`
- Path: `/expenses/{id}`
- Request Body:

```json
{
  "category_id": "uuid",
  "amount": "decimal",
  "description": "string",
  "date": "date"
}
```

- Response: 200 OK
- Errors: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found

#### Delete Expense

- Method: `DELETE`
- Path: `/expenses/{id}`
- Response: 204 No Content
- Errors: 401 Unauthorized, 403 Forbidden, 404 Not Found

### 2.4 Analytics Endpoints

#### Get Expense Summary

- Method: `GET`
- Path: `/analytics/summary`
- Query Parameters:
  - `period` (string, required)
  - `start_date` (date, optional)
  - `end_date` (date, optional)
- Response:

```json
{
  "total_amount": "decimal",
  "category_breakdown": [
    {
      "category_id": "uuid",
      "category_name": "string",
      "category_color": "string",
      "amount": "decimal",
      "percentage": "decimal"
    }
  ],
  "period": {
    "id": "string",
    "name": "string",
    "start_date": "date",
    "end_date": "date"
  }
}
```

- Success: 200 OK
- Errors: 400 Bad Request, 401 Unauthorized, 403 Forbidden

#### Get Category Trends

- Method: `GET`
- Path: `/analytics/trends`
- Query Parameters:
  - `category_id` (uuid, required)
  - `period` (string, required)
  - `start_date` (date, optional)
  - `end_date` (date, optional)
- Response:

```json
{
  "category": {
    "id": "uuid",
    "name": "string",
    "color": "string"
  },
  "trends": [
    {
      "period": "string",
      "amount": "decimal",
      "date": "date"
    }
  ]
}
```

- Success: 200 OK
- Errors: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found

### 2.5 Reporting Periods Endpoints

#### List Reporting Periods

- Method: `GET`
- Path: `/reporting-periods`
- Response:

```json
{
  "data": [
    {
      "id": "string",
      "name_pl": "string",
      "name_en": "string",
      "format_pl": "string",
      "format_en": "string",
      "interval_value": "interval",
      "display_order": "integer"
    }
  ]
}
```

- Success: 200 OK
- Errors: 401 Unauthorized, 403 Forbidden

## 3. Authentication and Authorization

### 3.1 Authorization

- Row Level Security (RLS) policies are implemented for all tables
- Users can only access their own data
- Default categories are readable by all authenticated users
- Category management is restricted to admin users

## 4. Validation and Business Logic

### 4.1 Validation Rules

#### Expenses

- amount: Required, decimal(10,2), positive
- date: Required, valid date
- category_id: Required, valid UUID, must exist
- description: Optional, max 500 characters
- user_id: Automatically set from JWT token

#### Categories

- name: Required, max 100 characters
- description: Optional, max 500 characters
- color: Required, valid hex color code
- is_default: Required, boolean

#### Reporting Periods

- id: Required, unique
- name_pl, name_en: Required, max 50 characters
- format_pl, format_en: Required, valid date format
- interval_value: Required, valid interval
- display_order: Required, integer

### 4.2 Business Logic Implementation

#### Expense Management

- Expenses are always associated with the authenticated user
- Category validation ensures category exists and is accessible
- Date validation ensures date is not in the future
- Amount validation ensures positive decimal value

#### Category Management

- Default categories cannot be deleted
- Custom categories can be created by any authenticated user
- Category colors must be unique within user's categories
- Category names must be unique within user's categories

#### Analytics

- Period calculations are handled server-side
- Category breakdown includes percentage calculations
- Trend analysis supports multiple period types
- Data aggregation is optimized for performance

### 4.3 Error Handling

- Standard HTTP status codes are used
- Detailed error messages are provided in response body
- Validation errors include field-specific messages
- Rate limiting is implemented for all endpoints
- 429 Too Many Requests for rate limit exceeded
- 500 Internal Server Error for unexpected errors
