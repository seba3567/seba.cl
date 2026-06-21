# seba3567.cl

Página principal de **Sebastián Muñoz** (`@seba3567`) — portafolio de proyectos con **AntiCallCL** como destacado, construida sobre el skeleton `frontend.skeleton` (Svelte 5 + Tailwind v4 + shadcn-svelte + Phosphor + Bun).

> El skeleton base vive en [`seba3567/frontend.skeleton`](https://github.com/seba3567/frontend.skeleton) y **no se toca** desde este repo. Aquí se reusa como punto de partida y se extiende.

## Stack

| Capa            | Tech                                                                    |
| --------------- | ----------------------------------------------------------------------- |
| Framework       | SvelteKit 2 (Svelte 5 Runes)                                            |
| Estilos         | Tailwind CSS v4 (`@theme` + `@utility`)                                 |
| UI              | shadcn-svelte (zinc)                                                    |
| Iconos          | Phosphor Svelte                                                         |
| Tipografías     | Geist Sans / Geist Mono                                                 |
| Runtime         | Bun 1.3.x                                                               |
| Build           | Vite 8 + adapter-auto                                                   |
| Lint/Format     | BiomeJS                                                                 |
| Datos           | GitHub REST API (server-side, cache 1h)                                 |
| AI skills       | `autoskills` (Svelte 5, Tailwind v4, shadcn, TS, Vite, Bun + combos)    |
| Diseño          | Glassmorphism sobre fondo oscuro `neutral-950`                          |

## Estructura

```
src/
  app.html                 # entry HTML, meta tags
  app.d.ts
  routes/
    +layout.svelte         # layout global (header, blobs, footer)
    +layout.css            # tema shadcn + utilidades glass
    +page.svelte           # home: hero + AntiCallCL + stats + grid
    +page.server.ts        # load(): fetch GitHub API
  lib/
    server/
      github.ts            # cliente GitHub API con tipos
    data/
      featured.ts          # proyectos destacados (curados)
    components/
      BackgroundBlobs.svelte
      SiteHeader.svelte
      SiteFooter.svelte
      GlassCard.svelte
      AntiCallCLFeatured.svelte
      FeaturedProjects.svelte
      StatsBar.svelte
      ProjectFilter.svelte
      ProjectGrid.svelte
      ProjectCard.svelte
      SectionHeading.svelte
```

## Comandos

```sh
bun install               # instalar deps
bun run dev               # dev server
bun run build             # build producción
bun run preview           # preview del build
bun run check             # typecheck (svelte-check + tsgo)
bun run lint              # biome check
bun run format            # biome format
bun run skills            # re-detectar skills de IA
bun run skills:check      # ver qué skills detectaría
```

## AI skills (autoskills)

`autoskills` se ejecuta en CI/local y deja skills versionadas en `.agents/skills/`. El lock reproducible está en `skills-lock.json`.

Skills actualmente instaladas:

- `svelte5-best-practices` · `svelte-code-writer` (Svelte 5 + Runes)
- `tailwind-css-patterns` · `tailwind-v4-shadcn` (Tailwind v4)
- `shadcn` (shadcn-svelte)
- `typescript-advanced-types`
- `vite`
- `bun`
- `frontend-design` · `accessibility` · `seo` (combo frontend)

Para añadir un agente específico (Claude Code, Cursor, etc.) corre:

```sh
bun x autoskills -a claude-code   # también genera CLAUDE.md
```

## Deploy

`adapter-auto` detecta el target en build time. Funciona con Vercel, Netlify, Cloudflare Pages, etc. Para el target específico de `seba3567.cl` basta con sobreescribir el adapter en `svelte.config.js` (no incluido por defecto para mantener el repo portable).

## Variables

Sin variables de entorno requeridas. La API de GitHub se llama sin token (rate limit 60/h). Si se necesita más capacidad, agregar `GITHUB_TOKEN` y leerlo en `$lib/server/github.ts`.
