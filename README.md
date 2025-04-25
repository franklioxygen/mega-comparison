# MegaComparison

A visual tool for comparing digital camera pixel resolutions.

## Features

- Select from various megapixel options (10MP, 20MP, 30MP, 40MP, 60MP, 100MP)
- Visualize relative sizes of different resolutions
- Interactive UI with responsive design
- Precise pixel dimension calculations based on industry standard 3:2 aspect ratio

## Getting Started

### Prerequisites

- Node.js 14+ and npm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
cd mega-comparison
npm install
```

### Development

To start the development server:

```bash
npm run dev
```

This will start the application at `http://localhost:5173`.

### Building for Production

To build the application for production:

```bash
npm run build
```

This will generate optimized files in the `dist` directory.

## How It Works

The application:
1. Calculates the relative dimensions of each megapixel resolution based on a 3:2 aspect ratio
2. Displays blocks representing each selected resolution
3. Arranges blocks in order (smaller to larger) for easy comparison
4. Aligns all blocks at their centers

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS 