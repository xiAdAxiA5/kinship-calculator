import { KinshipTerm } from './types';

// Build dimension keys for matching
function key(g: number, l: string, gend: string, s: string, d: number): string {
  return `${g}|${l}|${gend}|${s}|${d}`;
}

const TERM_MAP = new Map<string, KinshipTerm>();

function add(term: KinshipTerm): void {
  const k = key(
    term.dimensions.generation,
    term.dimensions.lineage,
    term.dimensions.gender,
    term.dimensions.seniority,
    term.dimensions.directness,
  );
  if (!TERM_MAP.has(k)) {
    TERM_MAP.set(k, term);
  }
}

// ============ DIRECT LINE (直系) ============
add({ term: '高祖父', pinyin: 'gāo zǔ fù', dimensions: { generation: 4, lineage: 'paternal', gender: 'male', seniority: 'neutral', directness: 0 }, paths: [['father', 'father', 'father', 'father']], explanationZh: '爸爸的爸爸的爸爸的爸爸', explanationEn: "Great-great-grandfather (paternal)", tags: ['direct', 'paternal', 'senior'] });
add({ term: '高祖母', pinyin: 'gāo zǔ mǔ', dimensions: { generation: 4, lineage: 'paternal', gender: 'female', seniority: 'neutral', directness: 0 }, paths: [['father', 'father', 'father', 'mother']], explanationZh: '爸爸的爸爸的爸爸的妈妈', explanationEn: "Great-great-grandmother (paternal)", tags: ['direct', 'paternal', 'senior'] });

add({ term: '曾祖父', pinyin: 'zēng zǔ fù', dimensions: { generation: 3, lineage: 'paternal', gender: 'male', seniority: 'neutral', directness: 0 }, paths: [['father', 'father', 'father']], explanationZh: '爸爸的爸爸的爸爸', explanationEn: "Great-grandfather (paternal)", tags: ['direct', 'paternal', 'senior'] });
add({ term: '曾祖母', pinyin: 'zēng zǔ mǔ', dimensions: { generation: 3, lineage: 'paternal', gender: 'female', seniority: 'neutral', directness: 0 }, paths: [['father', 'father', 'mother']], explanationZh: '爸爸的爸爸的妈妈', explanationEn: "Great-grandmother (paternal)", tags: ['direct', 'paternal', 'senior'] });
add({ term: '曾外祖父', pinyin: 'zēng wài zǔ fù', dimensions: { generation: 3, lineage: 'maternal', gender: 'male', seniority: 'neutral', directness: 0 }, paths: [['mother', 'father', 'father']], explanationZh: '妈妈的爸爸的爸爸', explanationEn: "Maternal great-grandfather", tags: ['direct', 'maternal', 'senior'] });
add({ term: '曾外祖母', pinyin: 'zēng wài zǔ mǔ', dimensions: { generation: 3, lineage: 'maternal', gender: 'female', seniority: 'neutral', directness: 0 }, paths: [['mother', 'father', 'mother']], explanationZh: '妈妈的爸爸的妈妈', explanationEn: "Maternal great-grandmother", tags: ['direct', 'maternal', 'senior'] });

add({ term: '祖父', pinyin: 'zǔ fù', dimensions: { generation: 2, lineage: 'paternal', gender: 'male', seniority: 'neutral', directness: 0 }, paths: [['father', 'father']], explanationZh: '爸爸的爸爸', explanationEn: "Father's father, paternal grandfather", tags: ['direct', 'paternal', 'senior'] });
add({ term: '祖母', pinyin: 'zǔ mǔ', dimensions: { generation: 2, lineage: 'paternal', gender: 'female', seniority: 'neutral', directness: 0 }, paths: [['father', 'mother']], explanationZh: '爸爸的妈妈', explanationEn: "Father's mother, paternal grandmother", tags: ['direct', 'paternal', 'senior'] });
add({ term: '外祖父', pinyin: 'wài zǔ fù', dimensions: { generation: 2, lineage: 'maternal', gender: 'male', seniority: 'neutral', directness: 0 }, paths: [['mother', 'father']], explanationZh: '妈妈的爸爸', explanationEn: "Mother's father, maternal grandfather", tags: ['direct', 'maternal', 'senior'] });
add({ term: '外祖母', pinyin: 'wài zǔ mǔ', dimensions: { generation: 2, lineage: 'maternal', gender: 'female', seniority: 'neutral', directness: 0 }, paths: [['mother', 'mother']], explanationZh: '妈妈的妈妈', explanationEn: "Mother's mother, maternal grandmother", tags: ['direct', 'maternal', 'senior'] });

add({ term: '父亲', pinyin: 'fù qīn', dimensions: { generation: 1, lineage: 'paternal', gender: 'male', seniority: 'neutral', directness: 0 }, paths: [['father']], explanationZh: '爸爸', explanationEn: 'Father', tags: ['direct', 'paternal'] });
add({ term: '母亲', pinyin: 'mǔ qīn', dimensions: { generation: 1, lineage: 'maternal', gender: 'female', seniority: 'neutral', directness: 0 }, paths: [['mother']], explanationZh: '妈妈', explanationEn: 'Mother', tags: ['direct', 'maternal'] });

add({ term: '本人', pinyin: 'běn rén', dimensions: { generation: 0, lineage: 'paternal', gender: 'neutral', seniority: 'neutral', directness: 0 }, paths: [[]], explanationZh: '自己', explanationEn: 'Self', tags: ['direct'] });

add({ term: '儿子', pinyin: 'ér zi', dimensions: { generation: -1, lineage: 'paternal', gender: 'male', seniority: 'neutral', directness: 0 }, paths: [['son']], explanationZh: '自己的儿子', explanationEn: 'Son', tags: ['direct', 'junior'] });
add({ term: '女儿', pinyin: 'nǚ ér', dimensions: { generation: -1, lineage: 'paternal', gender: 'female', seniority: 'neutral', directness: 0 }, paths: [['daughter']], explanationZh: '自己的女儿', explanationEn: 'Daughter', tags: ['direct', 'junior'] });

add({ term: '孙子', pinyin: 'sūn zi', dimensions: { generation: -2, lineage: 'paternal', gender: 'male', seniority: 'neutral', directness: 0 }, paths: [['son', 'son']], explanationZh: '儿子的儿子', explanationEn: "Son's son, grandson (paternal)", tags: ['direct', 'paternal', 'junior'] });
add({ term: '孙女', pinyin: 'sūn nǚ', dimensions: { generation: -2, lineage: 'paternal', gender: 'female', seniority: 'neutral', directness: 0 }, paths: [['son', 'daughter']], explanationZh: '儿子的女儿', explanationEn: "Son's daughter, granddaughter (paternal)", tags: ['direct', 'paternal', 'junior'] });
add({ term: '外孙', pinyin: 'wài sūn', dimensions: { generation: -2, lineage: 'maternal', gender: 'male', seniority: 'neutral', directness: 0 }, paths: [['daughter', 'son']], explanationZh: '女儿的儿子', explanationEn: "Daughter's son, grandson (maternal)", tags: ['direct', 'maternal', 'junior'] });
add({ term: '外孙女', pinyin: 'wài sūn nǚ', dimensions: { generation: -2, lineage: 'maternal', gender: 'female', seniority: 'neutral', directness: 0 }, paths: [['daughter', 'daughter']], explanationZh: '女儿的女儿', explanationEn: "Daughter's daughter, granddaughter (maternal)", tags: ['direct', 'maternal', 'junior'] });

add({ term: '曾孙', pinyin: 'zēng sūn', dimensions: { generation: -3, lineage: 'paternal', gender: 'male', seniority: 'neutral', directness: 0 }, paths: [['son', 'son', 'son']], explanationZh: '儿子的儿子的儿子', explanationEn: "Great-grandson (paternal)", tags: ['direct', 'paternal', 'junior'] });
add({ term: '曾孙女', pinyin: 'zēng sūn nǚ', dimensions: { generation: -3, lineage: 'paternal', gender: 'female', seniority: 'neutral', directness: 0 }, paths: [['son', 'son', 'daughter']], explanationZh: '儿子的儿子的女儿', explanationEn: "Great-granddaughter (paternal)", tags: ['direct', 'paternal', 'junior'] });

// ============ FIRST COLLATERAL: SIBLINGS (兄弟姐妹) ============
add({ term: '哥哥', pinyin: 'gē ge', dimensions: { generation: 0, lineage: 'paternal', gender: 'male', seniority: 'older', directness: 1 }, paths: [['older_brother']], explanationZh: '比自己年长的同辈男性', explanationEn: 'Older brother', tags: ['collateral', 'paternal', 'same_gen'] });
add({ term: '弟弟', pinyin: 'dì di', dimensions: { generation: 0, lineage: 'paternal', gender: 'male', seniority: 'younger', directness: 1 }, paths: [['younger_brother']], explanationZh: '比自己年幼的同辈男性', explanationEn: 'Younger brother', tags: ['collateral', 'paternal', 'same_gen'] });
add({ term: '姐姐', pinyin: 'jiě jie', dimensions: { generation: 0, lineage: 'paternal', gender: 'female', seniority: 'older', directness: 1 }, paths: [['older_sister']], explanationZh: '比自己年长的同辈女性', explanationEn: 'Older sister', tags: ['collateral', 'paternal', 'same_gen'] });
add({ term: '妹妹', pinyin: 'mèi mei', dimensions: { generation: 0, lineage: 'paternal', gender: 'female', seniority: 'younger', directness: 1 }, paths: [['younger_sister']], explanationZh: '比自己年幼的同辈女性', explanationEn: 'Younger sister', tags: ['collateral', 'paternal', 'same_gen'] });

// ============ PATERNAL UNCLE/AUNT (伯叔姑) ============
add({ term: '伯父', pinyin: 'bó fù', dimensions: { generation: 1, lineage: 'paternal', gender: 'male', seniority: 'older', directness: 1 }, paths: [['father', 'older_brother']], explanationZh: '爸爸的哥哥', explanationEn: "Father's older brother", tags: ['collateral', 'paternal', 'senior'] });
add({ term: '叔父', pinyin: 'shū fù', dimensions: { generation: 1, lineage: 'paternal', gender: 'male', seniority: 'younger', directness: 1 }, paths: [['father', 'younger_brother']], explanationZh: '爸爸的弟弟', explanationEn: "Father's younger brother", tags: ['collateral', 'paternal', 'senior'] });
add({ term: '姑母', pinyin: 'gū mǔ', dimensions: { generation: 1, lineage: 'paternal', gender: 'female', seniority: 'neutral', directness: 1 }, paths: [['father', 'older_sister'], ['father', 'younger_sister']], explanationZh: '爸爸的姐姐或妹妹', explanationEn: "Father's sister", tags: ['collateral', 'paternal', 'senior'] });

// ============ MATERNAL UNCLE/AUNT (舅姨) ============
add({ term: '舅父', pinyin: 'jiù fù', dimensions: { generation: 1, lineage: 'maternal', gender: 'male', seniority: 'neutral', directness: 1 }, paths: [['mother', 'older_brother'], ['mother', 'younger_brother']], explanationZh: '妈妈的哥哥或弟弟', explanationEn: "Mother's brother", tags: ['collateral', 'maternal', 'senior'] });
add({ term: '姨母', pinyin: 'yí mǔ', dimensions: { generation: 1, lineage: 'maternal', gender: 'female', seniority: 'neutral', directness: 1 }, paths: [['mother', 'older_sister'], ['mother', 'younger_sister']], explanationZh: '妈妈的姐姐或妹妹', explanationEn: "Mother's sister", tags: ['collateral', 'maternal', 'senior'] });

// ============ SECOND COLLATERAL: PATERNAL COUSINS (堂兄弟姐妹) ============
add({ term: '堂兄', pinyin: 'táng xiōng', dimensions: { generation: 0, lineage: 'paternal', gender: 'male', seniority: 'older', directness: 2 }, paths: [['father', 'older_brother', 'son']], explanationZh: '爸爸的哥哥的儿子（比自己年长）', explanationEn: "Father's brother's son (older than self)", tags: ['collateral', 'paternal', 'same_gen'] });
add({ term: '堂弟', pinyin: 'táng dì', dimensions: { generation: 0, lineage: 'paternal', gender: 'male', seniority: 'younger', directness: 2 }, paths: [['father', 'older_brother', 'son']], explanationZh: '爸爸的哥哥的儿子（比自己年幼）', explanationEn: "Father's brother's son (younger than self)", tags: ['collateral', 'paternal', 'same_gen'] });
add({ term: '堂姐', pinyin: 'táng jiě', dimensions: { generation: 0, lineage: 'paternal', gender: 'female', seniority: 'older', directness: 2 }, paths: [['father', 'older_brother', 'daughter']], explanationZh: '爸爸的哥哥的女儿（比自己年长）', explanationEn: "Father's brother's daughter (older than self)", tags: ['collateral', 'paternal', 'same_gen'] });
add({ term: '堂妹', pinyin: 'táng mèi', dimensions: { generation: 0, lineage: 'paternal', gender: 'female', seniority: 'younger', directness: 2 }, paths: [['father', 'older_brother', 'daughter']], explanationZh: '爸爸的哥哥的女儿（比自己年幼）', explanationEn: "Father's brother's daughter (younger than self)", tags: ['collateral', 'paternal', 'same_gen'] });

// ============ SECOND COLLATERAL: MATERNAL COUSINS (表兄弟姐妹) ============
add({ term: '表兄', pinyin: 'biǎo xiōng', dimensions: { generation: 0, lineage: 'maternal', gender: 'male', seniority: 'older', directness: 2 }, paths: [['mother', 'older_brother', 'son']], explanationZh: '妈妈的哥哥或弟弟的儿子（比自己年长）', explanationEn: "Mother's brother's son (older than self)", tags: ['collateral', 'maternal', 'same_gen'] });
add({ term: '表弟', pinyin: 'biǎo dì', dimensions: { generation: 0, lineage: 'maternal', gender: 'male', seniority: 'younger', directness: 2 }, paths: [['mother', 'older_brother', 'son']], explanationZh: '妈妈的哥哥或弟弟的儿子（比自己年幼）', explanationEn: "Mother's brother's son (younger than self)", tags: ['collateral', 'maternal', 'same_gen'] });
add({ term: '表姐', pinyin: 'biǎo jiě', dimensions: { generation: 0, lineage: 'maternal', gender: 'female', seniority: 'older', directness: 2 }, paths: [['mother', 'older_brother', 'daughter']], explanationZh: '妈妈的哥哥或弟弟的女儿（比自己年长）', explanationEn: "Mother's brother's daughter (older than self)", tags: ['collateral', 'maternal', 'same_gen'] });
add({ term: '表妹', pinyin: 'biǎo mèi', dimensions: { generation: 0, lineage: 'maternal', gender: 'female', seniority: 'younger', directness: 2 }, paths: [['mother', 'older_brother', 'daughter']], explanationZh: '妈妈的哥哥或弟弟的女儿（比自己年幼）', explanationEn: "Mother's brother's daughter (younger than self)", tags: ['collateral', 'maternal', 'same_gen'] });

// Also maternal aunt's children = 表兄弟姐妹 (same dimension signature)
add({ term: '姨表兄', pinyin: 'yí biǎo xiōng', dimensions: { generation: 0, lineage: 'maternal', gender: 'male', seniority: 'older', directness: 2 }, paths: [['mother', 'older_sister', 'son']], explanationZh: '妈妈的姐姐或妹妹的儿子（比自己年长）', explanationEn: "Mother's sister's son (older than self)", tags: ['collateral', 'maternal', 'same_gen'] });
add({ term: '姨表弟', pinyin: 'yí biǎo dì', dimensions: { generation: 0, lineage: 'maternal', gender: 'male', seniority: 'younger', directness: 2 }, paths: [['mother', 'older_sister', 'son']], explanationZh: '妈妈的姐姐或妹妹的儿子（比自己年幼）', explanationEn: "Mother's sister's son (younger than self)", tags: ['collateral', 'maternal', 'same_gen'] });

// ============ NIECES/NEPHEWS (侄、甥) ============
add({ term: '侄子', pinyin: 'zhí zi', dimensions: { generation: -1, lineage: 'paternal', gender: 'male', seniority: 'neutral', directness: 1 }, paths: [['older_brother', 'son'], ['younger_brother', 'son']], explanationZh: '哥哥或弟弟的儿子', explanationEn: "Brother's son, nephew (paternal)", tags: ['collateral', 'paternal', 'junior'] });
add({ term: '侄女', pinyin: 'zhí nǚ', dimensions: { generation: -1, lineage: 'paternal', gender: 'female', seniority: 'neutral', directness: 1 }, paths: [['older_brother', 'daughter'], ['younger_brother', 'daughter']], explanationZh: '哥哥或弟弟的女儿', explanationEn: "Brother's daughter, niece (paternal)", tags: ['collateral', 'paternal', 'junior'] });
add({ term: '外甥', pinyin: 'wài shēng', dimensions: { generation: -1, lineage: 'maternal', gender: 'male', seniority: 'neutral', directness: 1 }, paths: [['older_sister', 'son'], ['younger_sister', 'son']], explanationZh: '姐姐或妹妹的儿子', explanationEn: "Sister's son, nephew (maternal)", tags: ['collateral', 'maternal', 'junior'] });
add({ term: '外甥女', pinyin: 'wài shēng nǚ', dimensions: { generation: -1, lineage: 'maternal', gender: 'female', seniority: 'neutral', directness: 1 }, paths: [['older_sister', 'daughter'], ['younger_sister', 'daughter']], explanationZh: '姐姐或妹妹的女儿', explanationEn: "Sister's daughter, niece (maternal)", tags: ['collateral', 'maternal', 'junior'] });

// ============ SPOUSE & AFFINAL (姻亲) ============
add({ term: '丈夫', pinyin: 'zhàng fu', dimensions: { generation: 0, lineage: 'husband_family', gender: 'male', seniority: 'neutral', directness: 0 }, paths: [['husband']], explanationZh: '配偶（男性）', explanationEn: 'Husband', tags: ['affinal'] });
add({ term: '妻子', pinyin: 'qī zi', dimensions: { generation: 0, lineage: 'wife_family', gender: 'female', seniority: 'neutral', directness: 0 }, paths: [['wife']], explanationZh: '配偶（女性）', explanationEn: 'Wife', tags: ['affinal'] });
add({ term: '公公', pinyin: 'gōng gong', dimensions: { generation: 1, lineage: 'husband_family', gender: 'male', seniority: 'neutral', directness: 0 }, paths: [['husband', 'father']], explanationZh: '丈夫的爸爸', explanationEn: "Husband's father, father-in-law", tags: ['affinal', 'husband_family', 'senior'] });
add({ term: '婆婆', pinyin: 'pó po', dimensions: { generation: 1, lineage: 'husband_family', gender: 'female', seniority: 'neutral', directness: 0 }, paths: [['husband', 'mother']], explanationZh: '丈夫的妈妈', explanationEn: "Husband's mother, mother-in-law", tags: ['affinal', 'husband_family', 'senior'] });
add({ term: '岳父', pinyin: 'yuè fù', dimensions: { generation: 1, lineage: 'wife_family', gender: 'male', seniority: 'neutral', directness: 0 }, paths: [['wife', 'father']], explanationZh: '妻子的爸爸', explanationEn: "Wife's father, father-in-law", tags: ['affinal', 'wife_family', 'senior'] });
add({ term: '岳母', pinyin: 'yuè mǔ', dimensions: { generation: 1, lineage: 'wife_family', gender: 'female', seniority: 'neutral', directness: 0 }, paths: [['wife', 'mother']], explanationZh: '妻子的妈妈', explanationEn: "Wife's mother, mother-in-law", tags: ['affinal', 'wife_family', 'senior'] });

// ============ IN-LAW SIBLINGS ============
add({ term: '嫂子', pinyin: 'sǎo zi', dimensions: { generation: 0, lineage: 'paternal', gender: 'female', seniority: 'older', directness: 1 }, paths: [['older_brother', 'wife']], explanationZh: '哥哥的妻子', explanationEn: "Older brother's wife", tags: ['affinal', 'paternal', 'same_gen'] });
add({ term: '弟媳', pinyin: 'dì xí', dimensions: { generation: 0, lineage: 'paternal', gender: 'female', seniority: 'younger', directness: 1 }, paths: [['younger_brother', 'wife']], explanationZh: '弟弟的妻子', explanationEn: "Younger brother's wife", tags: ['affinal', 'paternal', 'same_gen'] });
add({ term: '姐夫', pinyin: 'jiě fu', dimensions: { generation: 0, lineage: 'paternal', gender: 'male', seniority: 'older', directness: 1 }, paths: [['older_sister', 'husband']], explanationZh: '姐姐的丈夫', explanationEn: "Older sister's husband", tags: ['affinal', 'paternal', 'same_gen'] });
add({ term: '妹夫', pinyin: 'mèi fu', dimensions: { generation: 0, lineage: 'paternal', gender: 'male', seniority: 'younger', directness: 1 }, paths: [['younger_sister', 'husband']], explanationZh: '妹妹的丈夫', explanationEn: "Younger sister's husband", tags: ['affinal', 'paternal', 'same_gen'] });

// Uncle's wife
add({ term: '伯母', pinyin: 'bó mǔ', dimensions: { generation: 1, lineage: 'paternal', gender: 'female', seniority: 'older', directness: 1 }, paths: [['father', 'older_brother', 'wife']], explanationZh: '伯父的妻子', explanationEn: "Father's older brother's wife", tags: ['affinal', 'paternal', 'senior'] });
add({ term: '婶婶', pinyin: 'shěn shen', dimensions: { generation: 1, lineage: 'paternal', gender: 'female', seniority: 'younger', directness: 1 }, paths: [['father', 'younger_brother', 'wife']], explanationZh: '叔父的妻子', explanationEn: "Father's younger brother's wife", tags: ['affinal', 'paternal', 'senior'] });
add({ term: '舅母', pinyin: 'jiù mǔ', dimensions: { generation: 1, lineage: 'maternal', gender: 'female', seniority: 'neutral', directness: 1 }, paths: [['mother', 'older_brother', 'wife']], explanationZh: '舅父的妻子', explanationEn: "Mother's brother's wife", tags: ['affinal', 'maternal', 'senior'] });
add({ term: '姨父', pinyin: 'yí fu', dimensions: { generation: 1, lineage: 'maternal', gender: 'male', seniority: 'neutral', directness: 1 }, paths: [['mother', 'older_sister', 'husband']], explanationZh: '姨母的丈夫', explanationEn: "Mother's sister's husband", tags: ['affinal', 'maternal', 'senior'] });

// ============ EXTENDED PATERNAL (宗族) ============
add({ term: '再从兄', pinyin: 'zài cóng xiōng', dimensions: { generation: 0, lineage: 'paternal', gender: 'male', seniority: 'older', directness: 3 }, paths: [['father', 'father', 'older_brother', 'son', 'son']], explanationZh: '祖父的哥哥的儿子的儿子（比自己年长）', explanationEn: "Paternal second cousin (older)", tags: ['collateral', 'paternal', 'same_gen', 'extended'] });
add({ term: '再从弟', pinyin: 'zài cóng dì', dimensions: { generation: 0, lineage: 'paternal', gender: 'male', seniority: 'younger', directness: 3 }, paths: [['father', 'father', 'older_brother', 'son', 'son']], explanationZh: '祖父的哥哥的儿子的儿子（比自己年幼）', explanationEn: "Paternal second cousin (younger)", tags: ['collateral', 'paternal', 'same_gen', 'extended'] });

add({ term: '伯祖父', pinyin: 'bó zǔ fù', dimensions: { generation: 2, lineage: 'paternal', gender: 'male', seniority: 'older', directness: 2 }, paths: [['father', 'father', 'older_brother']], explanationZh: '爸爸的爸爸的哥哥', explanationEn: "Grandfather's older brother", tags: ['collateral', 'paternal', 'senior', 'extended'] });
add({ term: '叔祖父', pinyin: 'shū zǔ fù', dimensions: { generation: 2, lineage: 'paternal', gender: 'male', seniority: 'younger', directness: 2 }, paths: [['father', 'father', 'younger_brother']], explanationZh: '爸爸的爸爸的弟弟', explanationEn: "Grandfather's younger brother", tags: ['collateral', 'paternal', 'senior', 'extended'] });
add({ term: '姑祖母', pinyin: 'gū zǔ mǔ', dimensions: { generation: 2, lineage: 'paternal', gender: 'female', seniority: 'neutral', directness: 2 }, paths: [['father', 'father', 'older_sister']], explanationZh: '爸爸的爸爸的姐姐或妹妹', explanationEn: "Grandfather's sister", tags: ['collateral', 'paternal', 'senior', 'extended'] });

// ============ MATERNAL EXTENDED ============
add({ term: '舅祖父', pinyin: 'jiù zǔ fù', dimensions: { generation: 2, lineage: 'maternal', gender: 'male', seniority: 'neutral', directness: 2 }, paths: [['mother', 'father', 'older_brother']], explanationZh: '妈妈的爸爸的哥哥或弟弟', explanationEn: "Maternal grandfather's brother", tags: ['collateral', 'maternal', 'senior', 'extended'] });
add({ term: '姨祖母', pinyin: 'yí zǔ mǔ', dimensions: { generation: 2, lineage: 'maternal', gender: 'female', seniority: 'neutral', directness: 2 }, paths: [['mother', 'mother', 'older_sister']], explanationZh: '妈妈的妈妈的姐姐或妹妹', explanationEn: "Maternal grandmother's sister", tags: ['collateral', 'maternal', 'senior', 'extended'] });

// ============ SON/DAUGHTER IN-LAW ============
add({ term: '儿媳', pinyin: 'ér xí', dimensions: { generation: -1, lineage: 'paternal', gender: 'female', seniority: 'neutral', directness: 0 }, paths: [['son', 'wife']], explanationZh: '儿子的妻子', explanationEn: "Son's wife, daughter-in-law", tags: ['affinal', 'junior'] });
add({ term: '女婿', pinyin: 'nǚ xu', dimensions: { generation: -1, lineage: 'maternal', gender: 'male', seniority: 'neutral', directness: 0 }, paths: [['daughter', 'husband']], explanationZh: '女儿的丈夫', explanationEn: "Daughter's husband, son-in-law", tags: ['affinal', 'junior'] });

// ============ SPECIAL / STEP RELATIONS ============
add({ term: '继父', pinyin: 'jì fù', dimensions: { generation: 1, lineage: 'paternal', gender: 'male', seniority: 'neutral', directness: 0 }, paths: [['mother', 'husband']], explanationZh: '妈妈的再婚丈夫（非生父）', explanationEn: 'Stepfather', tags: ['special'] });
add({ term: '继母', pinyin: 'jì mǔ', dimensions: { generation: 1, lineage: 'paternal', gender: 'female', seniority: 'neutral', directness: 0 }, paths: [['father', 'wife']], explanationZh: '爸爸的再婚妻子（非生母）', explanationEn: 'Stepmother', tags: ['special'] });
add({ term: '养父', pinyin: 'yǎng fù', dimensions: { generation: 1, lineage: 'paternal', gender: 'male', seniority: 'neutral', directness: 0 }, paths: [['father']], explanationZh: '养育自己的父亲（非亲生）', explanationEn: 'Adoptive father', tags: ['special'] });
add({ term: '养母', pinyin: 'yǎng mǔ', dimensions: { generation: 1, lineage: 'maternal', gender: 'female', seniority: 'neutral', directness: 0 }, paths: [['mother']], explanationZh: '养育自己的母亲（非亲生）', explanationEn: 'Adoptive mother', tags: ['special'] });

// Not in the map due to duplicate dimension keys, these are variants:
// (堂兄 and multiple paths to same term are handled by the engine logic)

// ===== Public API =====

export function getTermByDimensions(dims: {
  generation: number; lineage: string; gender: string;
  seniority: string; directness: number;
}): KinshipTerm | undefined {
  const k = key(dims.generation, dims.lineage, dims.gender, dims.seniority, dims.directness);
  return TERM_MAP.get(k);
}

export function searchTerms(query: string): KinshipTerm[] {
  const q = query.trim().toLowerCase();
  if (!q) return getAllTerms();
  return getAllTerms().filter(t =>
    t.term.includes(q) || t.pinyin.toLowerCase().includes(q),
  );
}

export function getAllTerms(): KinshipTerm[] {
  return Array.from(TERM_MAP.values());
}

export function getTermsByTag(tag: string): KinshipTerm[] {
  return getAllTerms().filter(t => t.tags.includes(tag));
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  for (const t of TERM_MAP.values()) {
    for (const tag of t.tags) tagSet.add(tag);
  }
  return Array.from(tagSet).sort();
}
