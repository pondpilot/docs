# PondPilot Documentation

Documentation site for the PondPilot ecosystem, built with [Starlight](https://starlight.astro.build/).

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Structure

```
src/
├── content/
│   ├── docs/           # Documentation pages
│   │   ├── pondpilot/  # PondPilot app docs
│   │   ├── flowscope/  # FlowScope docs
│   │   ├── widget/     # Widget docs
│   │   ├── cors-proxy/ # CORS Proxy docs
│   │   └── proxy/      # PondPilot Proxy docs
│   └── blog/           # Blog posts
├── assets/             # Images and assets
├── components/         # React/Astro components
└── styles/             # Custom CSS
```

## Deployment

The site is deployed to Cloudflare Pages at [docs.pondpilot.io](https://docs.pondpilot.io).

Build settings:
- Build command: `npm run build`
- Output directory: `dist`

## Contributing

1. Fork the repository
2. Create a branch for your changes
3. Make your changes
4. Submit a pull request

PR previews are automatically deployed for review.
