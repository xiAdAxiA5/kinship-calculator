/**
 * Family Graph — dynamically builds and traverses a kinship network.
 *
 * Instead of looking up pre-stored answers, we build a real family tree:
 *   - Each person is a node with gender, birth order, and parent links
 *   - Each step in a path creates or traverses to a node
 *   - After traversal, we analyze the relationship dynamically
 */

import { BasicRelation, KinshipDimensions, Lineage, Gender, Seniority } from './types';

// ---- Graph Node ----
export interface Person {
  id: string;
  gender: Gender;
  /** Birth order among siblings: 'first', 'middle', 'last' */
  birthOrder: 'first' | 'middle' | 'last';
  /** Labels accumulated during creation (for display) */
  label: string;
}

// ---- The Family Graph ----
export class FamilyGraph {
  /** All people keyed by id */
  private people = new Map<string, Person>();
  /** Edges: parentKey → childKey[] */
  private parentToChildren = new Map<string, string[]>();
  /** Edges: childKey → parentKey (exactly 2 parents for each child) */
  private childToParents = new Map<string, string[]>();
  /** Edges: husband → wife (and vice versa, via spousePairs) */
  private spouses = new Map<string, string>();
  /** Track who is whose sibling group */
  private siblingGroups = new Map<string, string[]>(); // parentPairKey → childId[]

  private idCounter = 0;

  private newId(): string {
    return `p${++this.idCounter}`;
  }

  /** Helper: get a stable key for a parent pair */
  private parentPairKey(p1: string, p2: string): string {
    return [p1, p2].sort().join('|');
  }

  /** Create ego (the reference person — me) */
  createEgo(gender: Gender = 'male'): string {
    const id = this.newId();
    this.people.set(id, { id, gender, birthOrder: 'first', label: '我' });
    return id;
  }

  /** Get or create a parent for a given child */
  getOrCreateParent(childId: string, relation: 'father' | 'mother'): string {
    const existing = this.childToParents.get(childId) || [];
    const idx = relation === 'father' ? 0 : 1;

    if (existing[idx]) return existing[idx];

    // Create the parent
    const parentId = this.newId();
    const gender: Gender = relation === 'father' ? 'male' : 'female';
    this.people.set(parentId, {
      id: parentId,
      gender,
      birthOrder: 'middle',
      label: relation === 'father' ? '父' : '母',
    });

    // Link child → parent
    existing[idx] = parentId;
    this.childToParents.set(childId, existing);

    // Link parent → child
    const children = this.parentToChildren.get(parentId) || [];
    children.push(childId);
    this.parentToChildren.set(parentId, children);

    // Track sibling group
    if (existing[0] && existing[1]) {
      const pairKey = this.parentPairKey(existing[0], existing[1]);
      const siblings = this.siblingGroups.get(pairKey) || [];
      if (!siblings.includes(childId)) {
        siblings.push(childId);
        this.siblingGroups.set(pairKey, siblings);
      }
    }

    return parentId;
  }

  /** Get or create a sibling */
  getOrCreateSibling(personId: string, relation: 'older_brother' | 'younger_brother' | 'older_sister' | 'younger_sister'): string {
    const parents = this.childToParents.get(personId);
    if (!parents || parents.length < 2) {
      // Need both parents to have siblings — auto-create grandparent chain
      const fatherId = this.getOrCreateParent(personId, 'father');
      const motherId = this.getOrCreateParent(personId, 'mother');
      return this.getOrCreateSibling(personId, relation);
    }

    const gender: Gender = relation === 'older_sister' || relation === 'younger_sister' ? 'female' : 'male';
    const pairKey = this.parentPairKey(parents[0], parents[1]);
    const existingSiblings = this.siblingGroups.get(pairKey) || [];

    // Check if a sibling with matching gender already exists
    for (const sid of existingSiblings) {
      const s = this.people.get(sid);
      if (s && s.gender === gender && sid !== personId) {
        return sid; // Reuse existing sibling of same gender
      }
    }

    // Create new sibling
    const siblingId = this.newId();
    this.people.set(siblingId, {
      id: siblingId,
      gender,
      birthOrder: relation.startsWith('older') ? 'first' : 'last',
      label: relation,
    });

    // Link to same parents
    this.childToParents.set(siblingId, [...parents]);
    for (const pid of parents) {
      const children = this.parentToChildren.get(pid) || [];
      children.push(siblingId);
      this.parentToChildren.set(pid, children);
    }

    existingSiblings.push(siblingId);
    this.siblingGroups.set(pairKey, existingSiblings);

    return siblingId;
  }

  /** Get or create a spouse */
  getOrCreateSpouse(personId: string, relation: 'husband' | 'wife'): string {
    const existing = this.spouses.get(personId);
    if (existing) {
      const spouse = this.people.get(existing);
      const expectedGender = relation === 'husband' ? 'male' : 'female';
      if (spouse && spouse.gender === expectedGender) return existing;
    }

    const spouseId = this.newId();
    const gender: Gender = relation === 'husband' ? 'male' : 'female';
    this.people.set(spouseId, {
      id: spouseId,
      gender,
      birthOrder: 'middle',
      label: relation === 'husband' ? '夫' : '妻',
    });

    this.spouses.set(personId, spouseId);
    this.spouses.set(spouseId, personId);
    return spouseId;
  }

  /** Get or create a child */
  getOrCreateChild(personId: string, spouseId: string | null, relation: 'son' | 'daughter'): string {
    // Find or create parents pair
    if (!spouseId) {
      // Auto-create spouse
      const assumedSpouseGender: Gender = this.people.get(personId)?.gender === 'male' ? 'female' : 'male';
      spouseId = this.getOrCreateSpouse(personId, assumedSpouseGender === 'male' ? 'husband' : 'wife');
    }

    const parentIds = [personId, spouseId].sort();
    const pairKey = this.parentPairKey(parentIds[0], parentIds[1]);

    const existingChildren = this.siblingGroups.get(pairKey) || [];
    const gender: Gender = relation === 'son' ? 'male' : 'female';

    // Check for existing child of same gender
    for (const cid of existingChildren) {
      const c = this.people.get(cid);
      if (c && c.gender === gender) return cid;
    }

    const childId = this.newId();
    this.people.set(childId, {
      id: childId,
      gender,
      birthOrder: 'last',
      label: relation === 'son' ? '子' : '女',
    });

    this.childToParents.set(childId, [parentIds[0], parentIds[1]]);
    for (const pid of parentIds) {
      const children = this.parentToChildren.get(pid) || [];
      children.push(childId);
      this.parentToChildren.set(pid, children);
    }

    existingChildren.push(childId);
    this.siblingGroups.set(pairKey, existingChildren);
    return childId;
  }

  /** Walk a path from ego, creating/retrieving nodes at each step. Returns the final node id. */
  walkPath(path: BasicRelation[], egoId: string): { targetId: string; currentNodeId: string }[] {
    const trace: { targetId: string; currentNodeId: string }[] = [];
    let current = egoId;
    let currentSpouse: string | null = this.spouses.get(current) || null;

    for (const step of path) {
      let nextId: string;

      switch (step) {
        case 'father':
          nextId = this.getOrCreateParent(current, 'father');
          currentSpouse = null;
          break;
        case 'mother':
          nextId = this.getOrCreateParent(current, 'mother');
          currentSpouse = null;
          break;
        case 'older_brother':
        case 'younger_brother':
        case 'older_sister':
        case 'younger_sister':
          nextId = this.getOrCreateSibling(current, step);
          currentSpouse = this.spouses.get(nextId) || null;
          break;
        case 'husband':
        case 'wife':
          nextId = this.getOrCreateSpouse(current, step);
          currentSpouse = nextId; // spouse of next is current
          break;
        case 'son':
        case 'daughter':
          nextId = this.getOrCreateChild(current, currentSpouse, step);
          currentSpouse = null;
          break;
        default:
          nextId = current;
      }

      trace.push({ targetId: nextId, currentNodeId: current });
      current = nextId;
    }

    return trace;
  }

  /** Get levels between two nodes (upward steps to common ancestor, then down to target) */
  getGenerationOffset(fromId: string, toId: string): number {
    const fromAncestors = this.getAncestors(fromId);
    const toAncestors = this.getAncestors(toId);

    // Find common ancestor with minimal total distance
    let minDist = Infinity;
    let commonAncestor: string | null = null;

    for (const [ancId, fromDist] of fromAncestors) {
      if (toAncestors.has(ancId)) {
        const toDist = toAncestors.get(ancId)!;
        const total = fromDist + toDist;
        if (total < minDist) {
          minDist = total;
          commonAncestor = ancId;
        }
      }
    }

    if (!commonAncestor) {
      // No common ancestor found — direct lineal?
      // Check if toId is an ancestor of fromId
      if (fromAncestors.has(toId)) {
        return -fromAncestors.get(toId)!;
      }
      // Check if fromId is an ancestor of toId
      if (toAncestors.has(fromId)) {
        return toAncestors.get(fromId)!;
      }
      return 0;
    }

    const fromDist = fromAncestors.get(commonAncestor)!;
    const toDist = toAncestors.get(commonAncestor)!;
    return toDist - fromDist; // positive = to is older gen
  }

  private getAncestors(personId: string): Map<string, number> {
    const result = new Map<string, number>();
    const queue: [string, number][] = [[personId, 0]];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const [current, dist] = queue.shift()!;
      if (visited.has(current)) continue;
      visited.add(current);
      result.set(current, dist);

      const parents = this.childToParents.get(current) || [];
      for (const pid of parents) {
        if (!visited.has(pid)) {
          queue.push([pid, dist + 1]);
        }
      }
    }

    return result;
  }

  /** Check if the path from ego → target passes through a female (making it 表 not 堂) */
  crossesFemale(egoId: string, path: BasicRelation[]): boolean {
    let current = egoId;
    let lineage: Lineage = 'paternal';
    let crossed = false;

    for (const step of path) {
      if (step === 'mother') {
        lineage = 'maternal';
        crossed = true;
      }
      if (step === 'older_sister' || step === 'younger_sister' || step === 'wife') {
        crossed = true;
      }
    }

    return crossed || lineage === 'maternal';
  }

  /** Determine seniority between two people based on birth order */
  getSeniority(personId: string, otherId: string, path: BasicRelation[]): Seniority {
    // Check the steps for explicit seniority
    for (const step of path) {
      if (step === 'older_brother' || step === 'older_sister') return 'older';
      if (step === 'younger_brother' || step === 'younger_sister') return 'younger';
    }
    return 'neutral';
  }

  /** Compute collateral degree (how many steps away from direct line) */
  getCollateralDegree(path: BasicRelation[]): number {
    let degree = 0;
    for (const step of path) {
      if (step === 'older_brother' || step === 'younger_brother' ||
          step === 'older_sister' || step === 'younger_sister') {
        degree += 1;
      }
    }
    return degree;
  }

  /** Get person info */
  getPerson(id: string): Person | undefined {
    return this.people.get(id);
  }

  /** Get node count */
  get nodeCount(): number {
    return this.people.size;
  }
}
