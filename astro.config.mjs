// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://docs.pondpilot.io',
  integrations: [
    starlight({
      title: 'PondPilot Docs',
      logo: {
        src: './src/assets/polly.svg',
        replacesTitle: false,
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/pondpilot' },
      ],
      editLink: {
        baseUrl: 'https://github.com/pondpilot/docs/edit/main/',
      },
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Overview', slug: 'index' },
          ],
        },
        {
          label: 'PondPilot',
          collapsed: false,
          items: [
            { label: 'Introduction', link: 'pondpilot/' },
            { label: 'Getting Started', link: 'pondpilot/getting-started/' },
            {
              label: 'Data Connections',
              autogenerate: { directory: 'pondpilot/data-connections' },
            },
            {
              label: 'Exploration',
              autogenerate: { directory: 'pondpilot/exploration' },
            },
            {
              label: 'Advanced Features',
              autogenerate: { directory: 'pondpilot/advanced' },
            },
            { label: 'Configuration', link: 'pondpilot/configuration/' },
            { label: 'Performance', link: 'pondpilot/performance/' },
            { label: 'Deployment', link: 'pondpilot/deployment/' },
          ],
        },
        {
          label: 'Proxy',
          collapsed: true,
          autogenerate: { directory: 'proxy' },
        },
        {
          label: 'FlowScope',
          collapsed: true,
          autogenerate: { directory: 'flowscope' },
        },
        {
          label: 'Widget',
          collapsed: true,
          autogenerate: { directory: 'widget' },
        },
        {
          label: 'CORS Proxy',
          collapsed: true,
          autogenerate: { directory: 'cors-proxy' },
        },
      ],
      customCss: ['./src/styles/custom.css'],
    }),
    react(),
  ],
});
