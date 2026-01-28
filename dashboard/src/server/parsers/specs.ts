/**
 * Specs Parser
 * Parses UI Designer spec files to extract screen definitions and wireframes
 */

import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import type { ScreenSpec } from '../../types/index.js';

interface ParsedSpec {
  role: string;
  title: string;
  content: string;
  screens?: ScreenSpec[];
}

function parseScreenSection(content: string): ScreenSpec[] {
  const screens: ScreenSpec[] = [];

  // Match screen sections: ## Screen: Name or ### Screen: Name
  const screenRegex = /#{2,3}\s*Screen:\s*(.+?)(?=#{2,3}\s*Screen:|#{2,3}\s*[^S]|$)/gis;
  let match;

  while ((match = screenRegex.exec(content)) !== null) {
    const screenName = match[1].trim().split('\n')[0];
    const screenContent = match[0];

    // Extract route
    const routeMatch = screenContent.match(/\*\*Route:\*\*\s*`?([^`\n]+)`?/i);
    const route = routeMatch ? routeMatch[1].trim() : '';

    // Extract components
    const componentsMatch = screenContent.match(/\*\*Components?:\*\*\s*(.+)/i);
    const components = componentsMatch
      ? componentsMatch[1].split(',').map(c => c.trim())
      : [];

    // Extract states
    const statesMatch = screenContent.match(/\*\*States?:\*\*\s*(.+)/i);
    const states = statesMatch
      ? statesMatch[1].split(',').map(s => s.trim())
      : ['default'];

    // Extract wireframe (ASCII art in code blocks)
    const wireframeMatch = screenContent.match(/```[\s\S]*?(┌[\s\S]*?┘)[\s\S]*?```/);
    const wireframe = wireframeMatch ? wireframeMatch[1] : undefined;

    // Extract related tickets
    const ticketMatches = screenContent.matchAll(/(\d+\.\d+)\s*-\s*(.+)/g);
    const relatedTickets: string[] = [];
    for (const ticketMatch of ticketMatches) {
      relatedTickets.push(ticketMatch[1]);
    }

    // Extract description (first paragraph after the header)
    const descMatch = screenContent.match(/#{2,3}\s*Screen:[^\n]+\n+([^#\n*`][^\n]+)/);
    const description = descMatch ? descMatch[1].trim() : '';

    screens.push({
      id: screenName.toLowerCase().replace(/\s+/g, '-'),
      name: screenName,
      route,
      components,
      states,
      wireframe,
      relatedTickets,
      description,
    });
  }

  return screens;
}

function parseComponentSection(content: string): string[] {
  const components: string[] = [];

  // Look for component definitions
  const componentRegex = /#{2,3}\s*Component:\s*(.+)|#{2,3}\s*(.+?)\s*Component/gi;
  let match;

  while ((match = componentRegex.exec(content)) !== null) {
    components.push((match[1] || match[2]).trim());
  }

  return components;
}

export async function parseUIDesignerSpec(filePath: string): Promise<ParsedSpec | null> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const { data: frontmatter, content: body } = matter(content);

    const screens = parseScreenSection(body);

    return {
      role: 'ui_designer',
      title: frontmatter.title || 'UI Designer Spec',
      content: body,
      screens,
    };
  } catch (error) {
    console.error(`Error parsing UI spec ${filePath}:`, error);
    return null;
  }
}

export async function parseSpec(filePath: string): Promise<ParsedSpec | null> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const { data: frontmatter, content: body } = matter(content);

    const filename = path.basename(filePath).toLowerCase();
    let role = 'unknown';

    if (filename.includes('product_manager') || filename.includes('01_')) {
      role = 'product_manager';
    } else if (filename.includes('backend') || filename.includes('02_')) {
      role = 'backend_lead';
    } else if (filename.includes('frontend') || filename.includes('03_')) {
      role = 'frontend_lead';
    } else if (filename.includes('db') || filename.includes('04_')) {
      role = 'db_architect';
    } else if (filename.includes('qa') || filename.includes('05_')) {
      role = 'qa_lead';
    } else if (filename.includes('devops') || filename.includes('06_')) {
      role = 'devops_lead';
    } else if (filename.includes('marketing') || filename.includes('07_')) {
      role = 'marketing_lead';
    } else if (filename.includes('finance') || filename.includes('08_')) {
      role = 'finance_lead';
    } else if (filename.includes('business') || filename.includes('09_')) {
      role = 'business_lead';
    } else if (filename.includes('ui') || filename.includes('10_')) {
      role = 'ui_designer';
    }

    const result: ParsedSpec = {
      role,
      title: frontmatter.title || path.basename(filePath, '.md'),
      content: body,
    };

    // Parse screens for UI designer spec
    if (role === 'ui_designer') {
      result.screens = parseScreenSection(body);
    }

    return result;
  } catch (error) {
    console.error(`Error parsing spec ${filePath}:`, error);
    return null;
  }
}

export async function findAllSpecs(projectDir: string): Promise<Map<string, ParsedSpec>> {
  const specs = new Map<string, ParsedSpec>();

  const specsDir = path.join(projectDir, 'specs');

  try {
    const entries = await fs.readdir(specsDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'backlog.md') {
        const specPath = path.join(specsDir, entry.name);
        const spec = await parseSpec(specPath);
        if (spec) {
          specs.set(spec.role, spec);
        }
      }
    }
  } catch (error) {
    console.error('Error reading specs directory:', error);
  }

  return specs;
}
