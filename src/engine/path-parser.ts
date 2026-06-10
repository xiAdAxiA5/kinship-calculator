import { BasicRelation } from './types';

const RELATION_MAP: Record<string, BasicRelation> = {
  '爸爸': 'father', '父亲': 'father', '父': 'father', '爸': 'father',
  '妈妈': 'mother', '母亲': 'mother', '母': 'mother', '妈': 'mother',
  '哥哥': 'older_brother', '兄': 'older_brother',
  '弟弟': 'younger_brother', '弟': 'younger_brother',
  '姐姐': 'older_sister', '姐': 'older_sister',
  '妹妹': 'younger_sister', '妹': 'younger_sister',
  '丈夫': 'husband', '老公': 'husband', '先生': 'husband',
  '妻子': 'wife', '老婆': 'wife', '太太': 'wife',
  '儿子': 'son', '子': 'son', '儿': 'son',
  '女儿': 'daughter', '女': 'daughter',
};

/**
 * Parse a Chinese kinship path string into basic relation steps.
 * Example: "爸爸的哥哥的儿子" → ['father', 'older_brother', 'son']
 */
export function parsePath(input: string): BasicRelation[] {
  let normalized = input.trim().replace(/\s+/g, '');
  normalized = normalized.replace(/^(我的|我)/, '');

  // Split by 的 or 之
  const parts = normalized.split(/的|之/).filter(s => s.length > 0);

  // If no separators, try character-by-character for compact forms like "父兄子"
  if (parts.length <= 1) {
    const chars = [...normalized];
    const steps: BasicRelation[] = [];
    let i = 0;
    while (i < chars.length) {
      const twoChar = chars.slice(i, i + 2).join('');
      if (RELATION_MAP[twoChar]) {
        steps.push(RELATION_MAP[twoChar]);
        i += 2;
      } else if (RELATION_MAP[chars[i]]) {
        steps.push(RELATION_MAP[chars[i]]);
        i += 1;
      } else {
        i += 1;
      }
    }
    return steps;
  }

  const steps: BasicRelation[] = [];
  for (const part of parts) {
    const relation = RELATION_MAP[part];
    if (relation) {
      steps.push(relation);
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
    return { valid: false, steps: [], error: '无法识别关系，请用"爸爸/妈妈/哥哥/弟弟/姐姐/妹妹/儿子/女儿/丈夫/妻子"并用"的"连接' };
  }
  return { valid: true, steps };
}
