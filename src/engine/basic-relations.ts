import { BasicRelation, KinshipDimensions, Lineage, Gender, Seniority } from './types';

/**
 * Each basic relation defines how it transforms the accumulated dimensions
 * when traversed in a path from ego.
 */
export interface RelationTransform {
  /** Chinese label */
  labelZh: string;
  /** English label */
  labelEn: string;
  /** Added to generation */
  genDelta: number;
  /** Sets lineage if this is the first parent/husband/wife step, otherwise keeps current */
  lineageSetter: Lineage | null;
  /** Gender of the resulting person */
  gender: Gender;
  /** Sets seniority */
  seniority: Seniority;
  /** Added to directness count */
  directnessDelta: number;
}

export const BASIC_RELATIONS: Record<BasicRelation, RelationTransform> = {
  father: {
    labelZh: '爸爸', labelEn: 'father',
    genDelta: 1, lineageSetter: 'paternal', gender: 'male',
    seniority: 'neutral', directnessDelta: 0,
  },
  mother: {
    labelZh: '妈妈', labelEn: 'mother',
    genDelta: 1, lineageSetter: 'maternal', gender: 'female',
    seniority: 'neutral', directnessDelta: 0,
  },
  older_brother: {
    labelZh: '哥哥', labelEn: 'older brother',
    genDelta: 0, lineageSetter: null, gender: 'male',
    seniority: 'older', directnessDelta: 1,
  },
  younger_brother: {
    labelZh: '弟弟', labelEn: 'younger brother',
    genDelta: 0, lineageSetter: null, gender: 'male',
    seniority: 'younger', directnessDelta: 1,
  },
  older_sister: {
    labelZh: '姐姐', labelEn: 'older sister',
    genDelta: 0, lineageSetter: null, gender: 'female',
    seniority: 'older', directnessDelta: 1,
  },
  younger_sister: {
    labelZh: '妹妹', labelEn: 'younger sister',
    genDelta: 0, lineageSetter: null, gender: 'female',
    seniority: 'younger', directnessDelta: 1,
  },
  husband: {
    labelZh: '丈夫', labelEn: 'husband',
    genDelta: 0, lineageSetter: 'husband_family', gender: 'male',
    seniority: 'neutral', directnessDelta: 0,
  },
  wife: {
    labelZh: '妻子', labelEn: 'wife',
    genDelta: 0, lineageSetter: 'wife_family', gender: 'female',
    seniority: 'neutral', directnessDelta: 0,
  },
  son: {
    labelZh: '儿子', labelEn: 'son',
    genDelta: -1, lineageSetter: null, gender: 'male',
    seniority: 'neutral', directnessDelta: 0,
  },
  daughter: {
    labelZh: '女儿', labelEn: 'daughter',
    genDelta: -1, lineageSetter: null, gender: 'female',
    seniority: 'neutral', directnessDelta: 0,
  },
};
