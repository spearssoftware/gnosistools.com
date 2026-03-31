# gnosistools.com

Marketing site, API docs, and interactive Bible Explorer for the [Gnosis](https://github.com/spearssoftware/gnosis) biblical knowledge graph.

Live at [gnosistools.com](https://gnosistools.com).

## Stack

- [Astro](https://astro.build) + [Starlight](https://starlight.astro.build) for docs
- React islands for interactive components (family tree, timeline, search)
- [D3](https://d3js.org) for tree visualization
- Cloudflare Pages with Functions for API proxying
- Hosted at [Cloudflare Pages](https://pages.cloudflare.com)

## Development

```
npm install
npm run dev
```

API proxy functions (`/api/*`) require Cloudflare Workers runtime. For full functionality:

```
npm run build
npx wrangler pages dev dist
```

Create a `.dev.vars` file with your API key:

```
GNOSIS_API_KEY=gn_your_key_here
```

## Structure

```
src/
  pages/           Landing, Developers, Signup (Astro)
  components/      React islands (BibleExplorer, FamilyTree, Timeline, SearchBox)
  content/docs/    API documentation (Markdown, rendered by Starlight)
  layouts/         Page layouts
  styles/          Global CSS variables
functions/api/     Cloudflare Pages Functions (API proxies)
```
