/**
 * Dynamic Term Constructor
 *
 * Computes Chinese kinship terms by applying RULES, not by looking up a pre-built table.
 * Given the relationship properties (generation offset, lineage, gender, seniority, directness),
 * it dynamically constructs the correct Chinese term.
 */

import { KinshipDimensions, Gender, Seniority, Lineage } from './types';

export interface TermResult {
  term: string;
  pinyin: string;
  explanation: string;
}

/**
 * Dynamically construct a Chinese kinship term from computed dimensions.
 */
export function constructTerm(dims: KinshipDimensions): TermResult {
  const { generation, lineage, gender, seniority, directness } = dims;

  // ---- DIRECT LINE ----
  if (directness === 0) {
    return constructDirectTerm(generation, gender, lineage);
  }

  // ---- COLLATERAL ----
  if (generation >= 2) {
    return constructGrandUncle(generation, lineage, gender, seniority, directness);
  }

  if (generation === 1) {
    return constructUncleAunt(lineage, gender, seniority);
  }

  if (generation === 0) {
    return constructCousin(lineage, gender, seniority, directness);
  }

  if (generation <= -1) {
    return constructNephewNiece(generation, lineage, gender);
  }

  return { term: '未知', pinyin: 'wèi zhī', explanation: '无法确定的关系' };
}

// ===== DIRECT LINE RULES =====

function constructDirectTerm(gen: number, gender: Gender, lineage: Lineage): TermResult {
  const maternalPrefix = lineage === 'maternal' ? '外' : '';
  const husbandPrefix = lineage === 'husband_family' ? '夫家' : '';
  const wifePrefix = lineage === 'wife_family' ? '妻家' : '';

  if (gen >= 4) {
    const g = gen - 3;
    const prefix = '高'.repeat(Math.min(g, 2));
    return {
      term: `${maternalPrefix}${husbandPrefix}${wifePrefix}${prefix}祖${gender === 'male' ? '父' : '母'}`,
      pinyin: '',
      explanation: `向上第${gen}代直系${gender === 'male' ? '男性' : '女性'}长辈`,
    };
  }

  if (gen === 3) {
    return {
      term: `${maternalPrefix}曾祖${gender === 'male' ? '父' : '母'}`,
      pinyin: '',
      explanation: `爸爸的爸爸的${gender === 'male' ? '爸爸' : '妈妈'}`,
    };
  }

  if (gen === 2) {
    return {
      term: `${maternalPrefix}祖${gender === 'male' ? '父' : '母'}`,
      pinyin: '',
      explanation: `爸爸的${gender === 'male' ? '爸爸' : '妈妈'}`,
    };
  }

  if (gen === 1) {
    if (lineage === 'husband_family') {
      return { term: '公公', pinyin: 'gōng gong', explanation: '丈夫的爸爸' };
    }
    if (lineage === 'wife_family') {
      return { term: '岳父', pinyin: 'yuè fù', explanation: '妻子的爸爸' };
    }
    return {
      term: gender === 'male' ? '父亲' : '母亲',
      pinyin: gender === 'male' ? 'fù qīn' : 'mǔ qīn',
      explanation: gender === 'male' ? '爸爸' : '妈妈',
    };
  }

  if (gen === 0) {
    return { term: '本人', pinyin: 'běn rén', explanation: '自己' };
  }

  if (gen === -1) {
    return {
      term: gender === 'male' ? '儿子' : '女儿',
      pinyin: gender === 'male' ? 'ér zi' : 'nǚ ér',
      explanation: gender === 'male' ? '自己的儿子' : '自己的女儿',
    };
  }

  if (gen === -2) {
    return {
      term: `${maternalPrefix}孙${gender === 'male' ? '子' : '女'}`,
      pinyin: '',
      explanation: `${gender === 'male' ? '儿子' : '女儿'}的${gender === 'male' ? '儿子' : '女儿'}`,
    };
  }

  if (gen <= -3) {
    const depth = Math.abs(gen) - 2;
    const ceng = depth === 1 ? '曾' : '曾'.repeat(Math.min(depth, 2));
    return {
      term: `${maternalPrefix}${ceng}孙${gender === 'male' ? '子' : '女'}`,
      pinyin: '',
      explanation: `向下第${Math.abs(gen)}代直系${gender === 'male' ? '男性' : '女性'}晚辈`,
    };
  }

  return { term: '直系亲属', pinyin: '', explanation: '' };
}

// ===== UNCLE / AUNT RULES (gen=1, collateral) =====

function constructUncleAunt(lineage: Lineage, gender: Gender, seniority: Seniority): TermResult {
  if (lineage === 'paternal') {
    if (gender === 'male') {
      if (seniority === 'older') {
        return { term: '伯父', pinyin: 'bó fù', explanation: '爸爸的哥哥' };
      }
      if (seniority === 'younger') {
        return { term: '叔父', pinyin: 'shū fù', explanation: '爸爸的弟弟' };
      }
      return { term: '伯父/叔父', pinyin: 'bó fù / shū fù', explanation: '爸爸的兄弟（无法确定长幼）' };
    }
    return { term: '姑母', pinyin: 'gū mǔ', explanation: '爸爸的姐姐或妹妹' };
  }

  if (lineage === 'maternal') {
    if (gender === 'male') {
      return { term: '舅父', pinyin: 'jiù fù', explanation: '妈妈的哥哥或弟弟' };
    }
    return { term: '姨母', pinyin: 'yí mǔ', explanation: '妈妈的姐姐或妹妹' };
  }

  if (lineage === 'husband_family') {
    if (gender === 'male') {
      return { term: '公公', pinyin: 'gōng gong', explanation: '丈夫的爸爸' };
    }
    return { term: '婆婆', pinyin: 'pó po', explanation: '丈夫的妈妈' };
  }

  if (lineage === 'wife_family') {
    if (gender === 'male') {
      return { term: '岳父', pinyin: 'yuè fù', explanation: '妻子的爸爸' };
    }
    return { term: '岳母', pinyin: 'yuè mǔ', explanation: '妻子的妈妈' };
  }

  return { term: '长辈', pinyin: '', explanation: '' };
}

// ===== COUSIN / SIBLING RULES (gen=0, collateral) =====

function constructCousin(lineage: Lineage, gender: Gender, seniority: Seniority, directness: number): TermResult {
  const genderSuffix = gender === 'male'
    ? (seniority === 'older' ? '兄' : '弟')
    : (seniority === 'older' ? '姐' : '妹');

  const neutralSuffix = gender === 'male' ? '兄弟' : '姐妹';

  // Siblings (directness=1): same parents
  if (directness === 1) {
    if (seniority === 'neutral') {
      return {
        term: neutralSuffix,
        pinyin: '',
        explanation: `同父同母的${gender === 'male' ? '兄弟' : '姐妹'}（无法确定长幼）`,
      };
    }
    const terms: Record<string, string> = {
      'older_male': '哥哥', 'younger_male': '弟弟',
      'older_female': '姐姐', 'younger_female': '妹妹',
      'male_older': '哥哥', 'male_younger': '弟弟',
      'female_older': '姐姐', 'female_younger': '妹妹',
    };
    const key = `${gender}_${seniority}`;
    return {
      term: terms[key] || `${genderSuffix}`,
      pinyin: '',
      explanation: `同父同母的${terms[key] || ''}`,
    };
  }

  // 堂 vs 表: the key rule
  // 堂 = paternal lineage, no female crossing → same surname
  // 表 = maternal lineage OR crossed through female → different surname
  const prefix = lineage === 'paternal' ? '堂' : '表';

  // Third+ collateral (再从兄弟)
  if (directness >= 3) {
    const depthPrefix = directness === 3 ? '再从' : `${directness - 1}代`;
    if (seniority === 'neutral') {
      return {
        term: `${depthPrefix}${prefix}${neutralSuffix}`,
        pinyin: '',
        explanation: `同${directness}代祖宗的${prefix === '堂' ? '父系' : '母系'}${neutralSuffix}`,
      };
    }
    return {
      term: `${depthPrefix}${prefix}${genderSuffix}`,
      pinyin: '',
      explanation: `同${directness}代祖宗的${prefix === '堂' ? '父系' : '母系'}${genderSuffix}`,
    };
  }

  // Second collateral (堂/表兄弟姐妹)
  if (seniority === 'neutral') {
    return {
      term: `${prefix}${neutralSuffix}`,
      pinyin: '',
      explanation: `${prefix === '堂' ? '爸爸的兄弟' : '妈妈的兄弟或爸爸的姐妹'}的${gender === 'male' ? '儿子' : '女儿'}`,
    };
  }

  return {
    term: `${prefix}${genderSuffix}`,
    pinyin: '',
    explanation: `${prefix === '堂' ? '爸爸的兄弟' : '妈妈的兄弟或爸爸的姐妹'}的${gender === 'male' ? '儿子' : '女儿'}（比自己${seniority === 'older' ? '年长' : '年幼'}）`,
  };
}

// ===== NEPHEW / NIECE RULES (gen < 0, collateral) =====

function constructNephewNiece(gen: number, lineage: Lineage, gender: Gender): TermResult {
  const maleTerm = lineage === 'paternal' ? '侄' : '外甥';
  const femaleTerm = lineage === 'paternal' ? '侄女' : '外甥女';

  if (gen === -1) {
    return {
      term: gender === 'male' ? `${maleTerm}子` : femaleTerm,
      pinyin: '',
      explanation: `${lineage === 'paternal' ? '兄弟' : '姐妹'}的${gender === 'male' ? '儿子' : '女儿'}`,
    };
  }

  // Grand-nephew etc
  const depth = Math.abs(gen) - 1;
  const depthStr = depth === 1 ? '' : depth === 2 ? '曾' : `${depth}代`;
  return {
    term: `${depthStr}${maleTerm}${gender === 'male' ? '孙' : '孙女'}`,
    pinyin: '',
    explanation: `${lineage === 'paternal' ? '侄' : '外甥'}的${depthStr}后代`,
  };
}

// ===== GRAND-UNCLE RULES (gen >= 2, collateral) =====

function constructGrandUncle(gen: number, lineage: Lineage, gender: Gender, seniority: Seniority, directness: number): TermResult {
  const genPrefix = gen === 2 ? '祖' : gen === 3 ? '曾祖' : `${gen - 1}代祖`;

  if (lineage === 'paternal') {
    if (gender === 'male') {
      const s = seniority === 'older' ? '伯' : seniority === 'younger' ? '叔' : '';
      return {
        term: `${s}${genPrefix}父`,
        pinyin: '',
        explanation: `祖父的${seniority === 'older' ? '哥哥' : seniority === 'younger' ? '弟弟' : '兄弟'}（${gen}代长辈）`,
      };
    }
    return {
      term: `姑${genPrefix}母`,
      pinyin: '',
      explanation: `祖父的姐妹（${gen}代长辈）`,
    };
  }

  if (lineage === 'maternal') {
    if (gender === 'male') {
      return {
        term: `舅${genPrefix}父`,
        pinyin: '',
        explanation: `外祖父的兄弟（${gen}代长辈）`,
      };
    }
    return {
      term: `姨${genPrefix}母`,
      pinyin: '',
      explanation: `外祖母的姐妹（${gen}代长辈）`,
    };
  }

  return { term: '长辈', pinyin: '', explanation: '' };
}
