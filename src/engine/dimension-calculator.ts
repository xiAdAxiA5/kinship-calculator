import { BasicRelation, KinshipDimensions, Lineage } from './types';
import { BASIC_RELATIONS } from './basic-relations';

/**
 * Compute the five kinship dimensions by traversing a path from ego.
 */
export function calculateDimensions(path: BasicRelation[]): KinshipDimensions {
  let generation = 0;
  let lineage: Lineage = 'paternal';
  let lineageSet = false;
  let seniority: KinshipDimensions['seniority'] = 'neutral';
  let directness = 0;

  for (const step of path) {
    const t = BASIC_RELATIONS[step];

    generation += t.genDelta;

    if (!lineageSet && t.lineageSetter) {
      lineage = t.lineageSetter;
      lineageSet = true;
    }

    if (t.seniority !== 'neutral') {
      seniority = t.seniority;
    }

    directness += t.directnessDelta;
  }

  const lastStep = path.length > 0 ? BASIC_RELATIONS[path[path.length - 1]] : null;
  const gender = lastStep ? lastStep.gender : 'neutral';

  return { generation, lineage, gender, seniority, directness };
}
