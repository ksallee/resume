import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_API_KEY } from '$env/static/private';
import { SYSTEM_PROMPT } from '$lib/theme.js';
import { buildRandomPrompt } from '$lib/moods.js';
import { resolvePreset } from '$lib/layouts.js';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
  if (!ANTHROPIC_API_KEY) {
    return json({ error: 'API key not configured' }, { status: 500 });
  }

  let userPrompt = buildRandomPrompt();

  try {
    const body = await request.json().catch(() => ({}));
    if (body.prompt && typeof body.prompt === 'string' && body.prompt.trim()) {
      userPrompt = `Generate a theme inspired by: "${body.prompt.trim().slice(0, 200)}"`;
    }
  } catch {
    // Use default prompt
  }

  try {
    const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const text = message.content[0]?.text || '';

    // Extract JSON from the response (handle potential markdown wrapping)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return json({ error: 'Invalid response from AI' }, { status: 500 });
    }

    const theme = JSON.parse(jsonMatch[0]);

    if (!theme.vars || typeof theme.vars !== 'object') {
      return json({ error: 'Invalid theme structure' }, { status: 500 });
    }

    // Resolve layout preset into actual CSS values
    const presetName = theme.vars['--layout-preset'] || 'default';
    delete theme.vars['--layout-preset'];
    const layout = resolvePreset(presetName);
    theme.vars['--layout-columns'] = layout.columns;
    if (layout.template) {
      theme.vars['--grid-template'] = layout.template;
    } else {
      delete theme.vars['--grid-template'];
    }

    return json(theme);
  } catch (err) {
    console.error('Theme generation error:', err);
    return json({ error: 'Failed to generate theme' }, { status: 500 });
  }
}
