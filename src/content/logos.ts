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
  /** Visual weight: the top tier gets the largest marks. */
  tier: 1 | 2 | 3;
  logos: Logo[];
}

const lobe = (id: string, name: string, file = id): Logo => ({ id, name, source: 'lobehub', file });
const simple = (id: string, name: string, file = id): Logo => ({ id, name, source: 'simpleicons', file });

/**
 * Three tiers, in order of recognition: the frontier labs, the tools built on
 * them, then the infrastructure underneath. Keep each tier to names a client
 * would know; small or specialist libraries belong in a case study, not here.
 */
export const logoWall = {
  heading: 'Models and tools I work with',
  note: 'Logos are trademarks of their owners, shown to indicate the models and tools I use, not partnerships.',
  pause: 'Pause logos',
  play: 'Play logos',
  rows: [
    {
      label: 'Frontier AI labs',
      tier: 1,
      logos: [
        lobe('anthropic', 'Anthropic'),
        lobe('openai', 'OpenAI'),
        lobe('deepmind', 'Google DeepMind'),
        lobe('gemini', 'Gemini'),
        lobe('meta', 'Meta'),
        lobe('mistral', 'Mistral AI'),
        lobe('xai', 'xAI'),
        lobe('deepseek', 'DeepSeek'),
        lobe('cohere', 'Cohere'),
        lobe('perplexity', 'Perplexity'),
        lobe('huggingface', 'Hugging Face'),
      ],
    },
    {
      label: 'Tools',
      tier: 2,
      logos: [
        simple('claude', 'Claude'),
        simple('github', 'GitHub'),
        simple('notion', 'Notion'),
        simple('zapier', 'Zapier'),
        simple('make', 'Make'),
        simple('airtable', 'Airtable'),
        simple('replit', 'Replit'),
        simple('python', 'Python'),
        simple('typescript', 'TypeScript'),
        simple('react', 'React'),
        simple('nextdotjs', 'Next.js'),
      ],
    },
    {
      label: 'Infrastructure',
      tier: 3,
      logos: [
        lobe('nvidia', 'NVIDIA'),
        lobe('aws', 'AWS'),
        lobe('microsoft', 'Microsoft'),
        simple('supabase', 'Supabase'),
        simple('postgresql', 'PostgreSQL'),
        simple('docker', 'Docker'),
        simple('netlify', 'Netlify'),
        simple('stripe', 'Stripe'),
      ],
    },
  ] satisfies LogoRow[],
};

export const allLogos: Logo[] = logoWall.rows.flatMap((r) => r.logos);
