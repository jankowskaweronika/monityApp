# MonityApp

## Table of Contents

- [Project Description](#project-description)
- [Tech Stack](#tech-stack)
- [Getting Started Locally](#getting-started-locally)
- [Available Scripts](#available-scripts)
- [Project Scope](#project-scope)
- [Project Status](#project-status)
- [License](#license)

## Project Description

MonityApp is designed to help users systematically track expenses, categorize and analyze financial habits, and visually interpret their spending patterns through an intuitive interface.

### Key Features

- Subscription tracking and management
- Payment monitoring and history
- Smart notifications for renewals and payments
- Subscription analytics and insights
- User-friendly interface for subscription management

## Tech Stack

### Frontend

- **Language**: TypeScript
- **Framework**: React 18+
- **State Management**: Redux
- **Routing**: React Router
- **Styling**: Tailwind CSS
- **Data Visualization**: Recharts

### Backend & Infrastructure

- **Authentication**: Supabase
- **Database**: Supabase

### Development Tools

- Jest for testing
- ESLint for code linting
- Prettier for code formatting
- Git for version control

### Testing

- **Unit Tests**: Jest
- **Component Tests**: React Testing Library
- **E2E Tests**: Cypress

### CI/CD

- **Workflow Automation**: GitHub Actions

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/monityApp.git
cd monityApp
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your configuration values.

4. Start the development server:

```bash
npm start
# or
yarn start
```

## Available Scripts

- `npm start` - Starts the Expo development server
- `npm test` - Runs the test suite
- `npm run lint` - Runs ESLint to check code quality
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Expo (one-way operation)

## Project Scope

### MVP Features

- User authentication and profile management
- Subscription tracking and management
- Payment monitoring and history
- Basic notification system
- Subscription analytics dashboard

### Future Development

- Advanced analytics and reporting
- Subscription recommendations
- Budget tracking and management
- Multi-currency support
- Export and backup functionality

## Project Status

Monity is currently in active development. The project is following an iterative development approach, with regular updates and improvements being made to enhance functionality and user experience.

### Current Status

- Core features are being implemented
- Basic infrastructure is in place
- Authentication system is operational
- Database schema is established

### Known Issues

- Some features are still in development
- Performance optimizations are ongoing
- UI/UX improvements are being implemented

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
