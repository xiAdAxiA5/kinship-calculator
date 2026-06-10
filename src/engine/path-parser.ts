import { BasicRelation } from './types';

// ---- Step 1: Compound term expansion ----
// Common Chinese kinship terms that represent multi-step paths
const COMPOUND_TERMS: Record<string, BasicRelation[]> = {
  // Grandparents
  '爷爷': ['father', 'father'],
  '奶奶': ['father', 'mother'],
  '外公': ['mother', 'father'],
  '外婆': ['mother', 'mother'],
  '祖父': ['father', 'father'],
  '祖母': ['father', 'mother'],
  '外祖父': ['mother', 'father'],
  '外祖母': ['mother', 'mother'],
  '姥爷': ['mother', 'father'],
  '姥姥': ['mother', 'mother'],

  // Paternal uncles/aunts (father's siblings)
  '伯伯': ['father', 'older_brother'],
  '伯父': ['father', 'older_brother'],
  '叔叔': ['father', 'younger_brother'],
  '叔父': ['father', 'younger_brother'],
  '姑姑': ['father', 'older_sister'],
  '姑妈': ['father', 'older_sister'],
  '姑母': ['father', 'older_sister'],
  '姑': ['father', 'older_sister'],

  // Maternal uncles/aunts (mother's siblings)
  '舅舅': ['mother', 'older_brother'],
  '舅父': ['mother', 'older_brother'],
  '舅': ['mother', 'older_brother'],
  '姨妈': ['mother', 'older_sister'],
  '姨娘': ['mother', 'older_sister'],
  '姨母': ['mother', 'older_sister'],
  '姨': ['mother', 'older_sister'],
  '阿姨': ['mother', 'older_sister'],

  // Siblings (same generation, same parents)
  '兄弟': ['older_brother'],
  '姐妹': ['older_sister'],

  // Nephews/nieces
  '侄子': ['older_brother', 'son'],
  '侄儿': ['older_brother', 'son'],
  '侄女': ['older_brother', 'daughter'],
  '外甥': ['older_sister', 'son'],
  '外甥女': ['older_sister', 'daughter'],

  // Children-in-law (for reverse calculation)
  '儿媳': ['son', 'wife'],
  '媳妇': ['son', 'wife'],
  '女婿': ['daughter', 'husband'],

  // In-law parents
  '公公': ['husband', 'father'],
  '婆婆': ['husband', 'mother'],
  '岳父': ['wife', 'father'],
  '岳母': ['wife', 'mother'],
  '老丈人': ['wife', 'father'],
  '丈母娘': ['wife', 'mother'],

  // In-law siblings
  '嫂子': ['older_brother', 'wife'],
  '弟媳': ['younger_brother', 'wife'],
  '弟妹': ['younger_brother', 'wife'],
  '姐夫': ['older_sister', 'husband'],
  '妹夫': ['younger_sister', 'husband'],

  // Spouse
  '老公': ['husband'],
  '老婆': ['wife'],
  '先生': ['husband'],
  '太太': ['wife'],

  // Step-parents
  '继父': ['mother', 'husband'],
  '后爸': ['mother', 'husband'],
  '继母': ['father', 'wife'],
  '后妈': ['father', 'wife'],

  // Ancestors
  '曾祖父': ['father', 'father', 'father'],
  '曾祖母': ['father', 'father', 'mother'],
  '太爷爷': ['father', 'father', 'father'],
  '太奶奶': ['father', 'father', 'mother'],
  '曾外祖父': ['mother', 'father', 'father'],
  '曾外祖母': ['mother', 'father', 'mother'],

  // Descendants
  '孙子': ['son', 'son'],
  '孙女': ['son', 'daughter'],
  '外孙': ['daughter', 'son'],
  '外孙女': ['daughter', 'daughter'],
  '曾孙': ['son', 'son', 'son'],
  '曾孙女': ['son', 'son', 'daughter'],

  // More paternal uncles (father's father's brother's son = 堂伯/堂叔)
  '堂伯': ['father', 'father', 'older_brother', 'son'],
  '堂叔': ['father', 'father', 'older_brother', 'son'],
  '堂姑': ['father', 'father', 'older_brother', 'daughter'],

  // Cousins
  '堂哥': ['father', 'older_brother', 'son'],
  '堂弟': ['father', 'older_brother', 'son'],
  '堂姐': ['father', 'older_brother', 'daughter'],
  '堂妹': ['father', 'older_brother', 'daughter'],
  '表哥': ['mother', 'older_brother', 'son'],
  '表弟': ['mother', 'older_brother', 'son'],
  '表姐': ['mother', 'older_brother', 'daughter'],
  '表妹': ['mother', 'older_brother', 'daughter'],
};

// ---- Step 2: Basic single-step terms ----
const SINGLE_STEP_MAP: Record<string, BasicRelation> = {
  '爸爸': 'father', '父亲': 'father', '父': 'father', '爸': 'father',
  '妈妈': 'mother', '母亲': 'mother', '母': 'mother', '妈': 'mother',
  '哥哥': 'older_brother', '兄': 'older_brother',
  '弟弟': 'younger_brother', '弟': 'younger_brother',
  '姐姐': 'older_sister', '姐': 'older_sister',
  '妹妹': 'younger_sister', '妹': 'younger_sister',
  '丈夫': 'husband',
  '妻子': 'wife',
  '儿子': 'son', '子': 'son', '儿': 'son',
  '女儿': 'daughter', '女': 'daughter',
};

/**
 * Expand a single segment: first try compound terms, then single-step terms.
 * Returns an array of BasicRelation steps.
 */
function expandSegment(segment: string): BasicRelation[] {
  // Try exact compound match
  if (COMPOUND_TERMS[segment]) {
    return [...COMPOUND_TERMS[segment]];
  }

  // Try single-step match
  if (SINGLE_STEP_MAP[segment]) {
    return [SINGLE_STEP_MAP[segment]];
  }

  // Try matching as a compound that contains a single-step prefix
  // e.g. "儿子" is in single-step, but someone might type "儿子" alone
  for (const [key, rel] of Object.entries(SINGLE_STEP_MAP)) {
    if (segment === key) return [rel];
  }

  // Last resort: character-by-character for unknown segments
  return [];
}

/**
 * Parse a Chinese kinship path string into basic relation steps.
 *
 * Examples:
 *   "爸爸的哥哥的儿子" → ['father', 'older_brother', 'son'] → "堂兄"
 *   "姑姑的儿子" → ['father', 'older_sister', 'son'] → "表兄/表弟"
 *   "舅舅的女儿" → ['mother', 'older_brother', 'daughter'] → "表姐/表妹"
 *   "奶奶的弟弟" → ['father', 'mother', 'younger_brother'] → ...
 */
export function parsePath(input: string): BasicRelation[] {
  let normalized = input.trim().replace(/\s+/g, '');
  normalized = normalized.replace(/^(我的|我)/, '');

  // Split by 的 or 之
  const segments = normalized.split(/的|之/).filter(s => s.length > 0);

  const steps: BasicRelation[] = [];

  for (const segment of segments) {
    const expanded = expandSegment(segment);
    if (expanded.length > 0) {
      steps.push(...expanded);
    }
  }

  // If nothing matched, try treating the whole thing as one compound
  if (steps.length === 0) {
    const expanded = expandSegment(normalized);
    if (expanded.length > 0) {
      steps.push(...expanded);
    }
  }

  // If still nothing, try character-by-character for compact forms
  if (steps.length === 0) {
    const chars = [...normalized];
    let i = 0;
    while (i < chars.length) {
      let matched = false;
      // Try 3-char
      if (i + 2 < chars.length) {
        const three = chars.slice(i, i + 3).join('');
        if (COMPOUND_TERMS[three]) {
          steps.push(...COMPOUND_TERMS[three]);
          i += 3;
          matched = true;
        }
      }
      // Try 2-char
      if (!matched && i + 1 < chars.length) {
        const two = chars.slice(i, i + 2).join('');
        if (COMPOUND_TERMS[two]) {
          steps.push(...COMPOUND_TERMS[two]);
          i += 2;
          matched = true;
        } else if (SINGLE_STEP_MAP[two]) {
          steps.push(SINGLE_STEP_MAP[two]);
          i += 2;
          matched = true;
        }
      }
      // Try 1-char
      if (!matched) {
        if (SINGLE_STEP_MAP[chars[i]]) {
          steps.push(SINGLE_STEP_MAP[chars[i]]);
        }
        i += 1;
      }
    }
  }

  return steps;
}

/**
 * Validate that a path string is parseable.
 */
export function validatePath(input: string): { valid: boolean; steps: BasicRelation[]; error?: string } {
  if (!input || input.trim().length === 0) {
    return { valid: false, steps: [], error: '请输入关系路径' };
  }
  const steps = parsePath(input);
  if (steps.length === 0) {
    return { valid: false, steps: [], error: '无法识别。试试输入：姑姑的儿子、舅舅的女儿、爸爸的哥哥、奶奶的弟弟...' };
  }
  return { valid: true, steps };
}
