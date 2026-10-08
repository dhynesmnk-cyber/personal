/**
 * The logo wall in the footer. Add or remove a logo here and the sprite at
 * /logos.svg and every page update on the next build.
 *
 * Marks come from two open icon sets, used unaltered and in one colour:
 *   lobehub      @lobehub/icons-static-svg (MIT), for AI labs and models
 *   simpleicons  simple-icons (CC0), for tools and platforms
 * `file` is the icon's file name in that set, without .svg.
 *
 * Logos are trademarks of their owners. Keep this list to models and tools
 * actually used, so the wall stays honest.
 */

export type LogoSource = 'lobehub' | 'simpleicons';

export interface Logo {
  id: string;
  name: string;
  source: LogoSource;
  file: string;
}

export interface LogoRow {
  label: string;
  logos: Logo[];
}

const lab = (id: string, name: string, file = id): Logo => ({ id, name, source: 'lobehub', file });
const tool = (id: string, name: string, file = id): Logo => ({ id, name, source: 'simpleicons', file });

export const logoWall = {
  heading: 'Models and tools we work with',
  note: 'Logos are trademarks of their owners, shown to indicate the models and tools we use, not partnerships.',
  pause: 'Pause logos',
  play: 'Play logos',
  rows: [
    {
      label: 'Frontier AI labs and models',
      logos: [
        lab('anthropic', 'Anthropic'),
        lab('openai', 'OpenAI'),
        lab('deepmind', 'Google DeepMind'),
        lab('gemini', 'Gemini'),
        lab('meta', 'Meta'),
        lab('mistral', 'Mistral AI'),
        lab('xai', 'xAI'),
        lab('deepseek', 'DeepSeek'),
        lab('qwen', 'Qwen'),
        lab('cohere', 'Cohere'),
        lab('microsoft', 'Microsoft'),
        lab('aws', 'AWS'),
        lab('nvidia', 'NVIDIA'),
        lab('perplexity', 'Perplexity'),
        lab('huggingface', 'Hugging Face'),
      ],
    },
    {
      label: 'AI, automation and data',
      logos: [
        tool('claude', 'Claude'),
        tool('zapier', 'Zapier'),
        tool('make', 'Make'),
        tool('notion', 'Notion'),
        tool('airtable', 'Airtable'),
        tool('replit', 'Replit'),
        tool('supabase', 'Supabase'),
        tool('postgresql', 'PostgreSQL'),
        tool('sqlite', 'SQLite'),
        tool('drizzle', 'Drizzle'),
        tool('upstash', 'Upstash'),
        tool('stripe', 'Stripe'),
        tool('leaflet', 'Leaflet'),
        tool('openstreetmap', 'OpenStreetMap'),
      ],
    },
    {
      label: 'Engineering and delivery',
      logos: [
        tool('typescript', 'TypeScript'),
        tool('python', 'Python'),
        tool('nodedotjs', 'Node.js'),
        tool('deno', 'Deno'),
        tool('nextdotjs', 'Next.js'),
        tool('astro', 'Astro'),
        tool('react', 'React'),
        tool('tailwindcss', 'Tailwind CSS'),
        tool('vite', 'Vite'),
        tool('vitest', 'Vitest'),
        tool('eslint', 'ESLint'),
        tool('git', 'Git'),
        tool('github', 'GitHub'),
        tool('githubactions', 'GitHub Actions'),
        tool('docker', 'Docker'),
        tool('netlify', 'Netlify'),
      ],
    },
  ] satisfies LogoRow[],
};

export const allLogos: Logo[] = logoWall.rows.flatMap((r) => r.logos);
