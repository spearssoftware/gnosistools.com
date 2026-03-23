// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [
    starlight({
      title: 'Gnosis',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/spearssoftware/gnosis' },
      ],
      sidebar: [
        { label: 'Getting Started', slug: 'getting-started' },
        { label: 'Authentication', slug: 'authentication' },
        {
          label: 'Endpoints',
          items: [
            { label: 'People', slug: 'endpoints/people' },
            { label: 'Places', slug: 'endpoints/places' },
            { label: 'Events', slug: 'endpoints/events' },
            { label: 'Verses', slug: 'endpoints/verses' },
            { label: 'Strong\'s Concordance', slug: 'endpoints/strongs' },
            { label: 'Dictionary', slug: 'endpoints/dictionary' },
            { label: 'Topics', slug: 'endpoints/topics' },
            { label: 'Hebrew', slug: 'endpoints/hebrew' },
            { label: 'Lexicon', slug: 'endpoints/lexicon' },
            { label: 'Search', slug: 'endpoints/search' },
          ],
        },
        { label: 'Data Model', slug: 'data-model' },
        { label: 'Changelog', slug: 'changelog' },
      ],
      customCss: ['./src/styles/global.css'],
    }),
    react(),
  ],
});
