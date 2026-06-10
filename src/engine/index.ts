import { KinshipEngine, CalculationResult, KinshipDimensions, KinshipTerm, BasicRelation } from './types';
import { parsePath, validatePath } from './path-parser';
import { calculateDimensions } from './dimension-calculator';
import { matchTerm } from './term-matcher';
import { searchTerms, getAllTerms } from './term-database';
import { BASIC_RELATIONS } from './basic-relations';

export function createKinshipEngine(): KinshipEngine {
  return {
    calculate(input: string): CalculationResult {
      const validation = validatePath(input);
      if (!validation.valid) {
        return {
          term: null,
          dimensions: { generation: 0, lineage: 'paternal', gender: 'neutral', seniority: 'neutral', directness: 0 },
          path: [],
          alternatives: [],
          error: validation.error,
        };
      }
      return this.calculateFromSteps(validation.steps);
    },

    calculateFromSteps(steps: BasicRelation[]): CalculationResult {
      if (steps.length === 0) {
        return {
          term: null,
          dimensions: { generation: 0, lineage: 'paternal', gender: 'neutral', seniority: 'neutral', directness: 0 },
          path: [],
          alternatives: [],
        };
      }
      const dimensions = calculateDimensions(steps);
      const { term, alternatives } = matchTerm(dimensions);
      return { term, dimensions, path: steps, alternatives };
    },

    lookupByTerm(search: string): KinshipTerm[] {
      return searchTerms(search);
    },

    getAllTerms(): KinshipTerm[] {
      return getAllTerms();
    },

    getBasicRelations() {
      return Object.entries(BASIC_RELATIONS).map(([key, val]) => ({
        key: key as BasicRelation,
        labelZh: val.labelZh,
        labelEn: val.labelEn,
      }));
    },
  };
}

export type { KinshipEngine, CalculationResult, KinshipDimensions, KinshipTerm, BasicRelation } from './types';
