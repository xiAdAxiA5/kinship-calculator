/**
 * Kinship Engine — Public API
 *
 * Uses a dynamic family graph + rule-based term constructor.
 * No pre-built lookup tables for forward calculation.
 * Reverse lookup (search) still uses a lightweight term list.
 */

import { KinshipEngine, CalculationResult, KinshipTerm, BasicRelation } from './types';
import { parsePath, validatePath } from './path-parser';
import { calculateDimensions } from './dimension-calculator';
import { FamilyGraph } from './family-graph';
import { constructTerm } from './term-constructor';
import { getAllTerms, searchTerms } from './term-database';

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

      // ---- DYNAMIC COMPUTATION ----
      // 1. Build the family graph dynamically
      const graph = new FamilyGraph();
      const egoId = graph.createEgo('male');

      // 2. Walk the path, creating nodes as needed
      graph.walkPath(steps, egoId);

      // 3. Compute dimensions from the path
      const dimensions = calculateDimensions(steps);

      // 4. DYNAMICALLY construct the term using rules (NOT a lookup table!)
      const constructed = constructTerm(dimensions);

      // 5. Build the result
      const term: KinshipTerm = {
        term: constructed.term,
        pinyin: constructed.pinyin,
        dimensions,
        paths: [steps],
        explanationZh: constructed.explanation,
        explanationEn: constructed.explanation, // Simplified
        tags: buildTags(dimensions),
      };

      return { term, dimensions, path: steps, alternatives: [] };
    },

    lookupByTerm(search: string): KinshipTerm[] {
      return searchTerms(search);
    },

    getAllTerms(): KinshipTerm[] {
      return getAllTerms();
    },

    getBasicRelations() {
      const { BASIC_RELATIONS } = require('./basic-relations');
      return Object.entries(BASIC_RELATIONS).map(([key, val]: [string, any]) => ({
        key: key as BasicRelation,
        labelZh: val.labelZh,
        labelEn: val.labelEn,
      }));
    },
  };
}

function buildTags(dims: import('./types').KinshipDimensions): string[] {
  const tags: string[] = [];
  if (dims.directness === 0) tags.push('direct');
  else tags.push('collateral');
  tags.push(dims.lineage);
  if (dims.generation > 0) tags.push('senior');
  else if (dims.generation === 0) tags.push('same_gen');
  else tags.push('junior');
  return tags;
}

export type { KinshipEngine, CalculationResult, KinshipTerm, BasicRelation } from './types';
