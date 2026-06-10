// ---- Basic relationship steps ----
// The 10 atomic relationship directions from ego's perspective
export type BasicRelation =
  | 'father'        // 父亲
  | 'mother'        // 母亲
  | 'older_brother' // 哥哥
  | 'younger_brother' // 弟弟
  | 'older_sister'  // 姐姐
  | 'younger_sister' // 妹妹
  | 'husband'       // 丈夫
  | 'wife'          // 妻子
  | 'son'           // 儿子
  | 'daughter';     // 女儿

// ---- Lineage (谱系) ----
export type Lineage = 'paternal' | 'maternal' | 'husband_family' | 'wife_family';

// ---- Gender ----
export type Gender = 'male' | 'female' | 'neutral';

// ---- Seniority (长幼) ----
export type Seniority = 'older' | 'younger' | 'neutral';

// ---- The five dimensions that uniquely determine a kinship term ----
export interface KinshipDimensions {
  /** Generation offset: +2=grandparent, +1=parent, 0=same, -1=child, -2=grandchild */
  generation: number;
  /** Which family line the relation traces through */
  lineage: Lineage;
  /** Gender of the target person */
  gender: Gender;
  /** Whether the target is older/younger than the reference at same generation */
  seniority: Seniority;
  /** 0 = direct line; 1 = sibling (first collateral); 2 = cousin (second collateral); etc. */
  directness: number;
}

// ---- A kinship term entry in the database ----
export interface KinshipTerm {
  /** The Chinese kinship term, e.g. "堂兄" */
  term: string;
  /** Pinyin with tone marks, e.g. "táng xiōng" */
  pinyin: string;
  /** The dimension signature that uniquely identifies this term */
  dimensions: KinshipDimensions;
  /** One or more canonical paths from ego to this relative */
  paths: BasicRelation[][];
  /** Chinese explanation */
  explanationZh: string;
  /** English explanation */
  explanationEn: string;
  /** Category tags for browsing */
  tags: string[];
}

// ---- Result of a calculation ----
export interface CalculationResult {
  /** The matched term, or null if no match */
  term: KinshipTerm | null;
  /** The computed dimensions */
  dimensions: KinshipDimensions;
  /** The parsed path */
  path: BasicRelation[];
  /** Closest alternative terms if no exact match */
  alternatives: KinshipTerm[];
  /** Error message if parsing failed */
  error?: string;
}

// ---- Engine public API ----
export interface KinshipEngine {
  /** Forward: path text → calculated term */
  calculate(input: string): CalculationResult;
  /** Forward: basic relation steps → calculated term */
  calculateFromSteps(steps: BasicRelation[]): CalculationResult;
  /** Reverse: search term by Chinese name */
  lookupByTerm(search: string): KinshipTerm[];
  /** Get all terms */
  getAllTerms(): KinshipTerm[];
  /** Get all basic relations with Chinese labels */
  getBasicRelations(): { key: BasicRelation; labelZh: string; labelEn: string }[];
}
