import { KinshipDimensions, KinshipTerm } from './types';
import { getTermByDimensions, getAllTerms } from './term-database';

/**
 * Match dimensions to the closest kinship term.
 * Tries exact match first, then relaxes seniority, then directness.
 */
export function matchTerm(dims: KinshipDimensions): { term: KinshipTerm | null; alternatives: KinshipTerm[] } {
  // Try exact match
  const exact = getTermByDimensions(dims);
  if (exact) return { term: exact, alternatives: [] };

  // Try relaxing seniority
  if (dims.seniority !== 'neutral') {
    const relaxed = getTermByDimensions({ ...dims, seniority: 'neutral' });
    if (relaxed) return { term: relaxed, alternatives: findAlternatives(dims) };
  }

  // Try both older and younger
  const older = getTermByDimensions({ ...dims, seniority: 'older' });
  const younger = getTermByDimensions({ ...dims, seniority: 'younger' });
  if (older || younger) {
    return {
      term: null,
      alternatives: [older, younger].filter(Boolean) as KinshipTerm[],
    };
  }

  return { term: null, alternatives: findAlternatives(dims) };
}

function findAlternatives(dims: KinshipDimensions): KinshipTerm[] {
  return getAllTerms()
    .filter(t =>
      t.dimensions.generation === dims.generation &&
      t.dimensions.lineage === dims.lineage &&
      t.dimensions.gender === dims.gender,
    )
    .slice(0, 5);
}
