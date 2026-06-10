# 亲戚计算器 (Kinship Calculator) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a cross-platform mobile app (iOS + Android) that calculates Chinese kinship terms bidirectionally — forward (relationship path → term) and reverse (term → path + explanation + family tree).

**Architecture:** Three-layer structure: (1) pure-TypeScript core engine with graph-traversal kinship logic independent of any framework, (2) React Native UI layer with bottom-tab navigation, (3) locale data for zh/en switching. The engine models Chinese kinship as dimension-transformation rules: each basic relation step (父/母/兄/弟/…) transforms five dimensions (generation, lineage, gender, seniority, directness), and the final dimensions are matched against a comprehensive term database.

**Tech Stack:** React Native (Expo SDK 54+), TypeScript, Expo Router (file-based navigation), react-native-svg (family tree), React Context (i18n state)

---

## File Structure

```
c:/Users/75815/kinship-calculator/
├── app/                          # Expo Router file-based routes
│   ├── _layout.tsx               # Root layout with tab navigator
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Tab layout
│   │   ├── calculate.tsx         # Forward calculation screen
│   │   ├── lookup.tsx            # Reverse lookup screen
│   │   └── settings.tsx          # Settings screen
│   └── result.tsx                # Result screen (stack)
├── src/
│   ├── engine/                   # Pure TypeScript, zero RN dependencies
│   │   ├── types.ts              # Core type definitions
│   │   ├── basic-relations.ts    # Basic relation step definitions
│   │   ├── term-database.ts      # All kinship terms with dimension signatures
│   │   ├── path-parser.ts        # Text→path parser
│   │   ├── dimension-calculator.ts  # Path traversal → dimensions
│   │   ├── term-matcher.ts       # Dimensions → term lookup
│   │   └── index.ts              # Public API
│   ├── i18n/
│   │   ├── translations.ts       # All string maps
│   │   └── LanguageContext.tsx   # React context for language state
│   ├── components/
│   │   ├── PathTextInput.tsx      # Free-text path input
│   │   ├── StepSelector.tsx       # Step-by-step relationship picker
│   │   ├── FamilyTreeView.tsx     # SVG family tree diagram
│   │   └── TermCard.tsx          # Result card with term + pinyin + explanation
│   └── utils/
│       └── pinyin.ts             # Basic pinyin annotation utility
├── package.json
├── tsconfig.json
├── app.json                      # Expo config
└── babel.config.js
```

---

### Task 1: Initialize Expo Project

**Files:**
- Create: `package.json`, `tsconfig.json`, `app.json`, `babel.config.js`
- Create: `app/_layout.tsx`, `app/(tabs)/_layout.tsx`

Run `npx create-expo-app@latest` then customize.

- [ ] **Step 1: Create Expo project**

```bash
cd c:/Users/75815/kinship-calculator
npx create-expo-app@latest . --template blank-typescript
```

Expected: Creates package.json, tsconfig.json, app.json, App.tsx, etc.

- [ ] **Step 2: Install all dependencies**

```bash
cd c:/Users/75815/kinship-calculator
npx expo install expo-router expo-linking expo-constants expo-status-bar react-native-svg react-native-safe-area-context react-native-screens react-native-gesture-handler @react-navigation/bottom-tabs
```

Expected: All packages installed.

- [ ] **Step 3: Configure app.json for Expo Router**

Read the generated `app.json`, then replace it with:

```json
{
  "expo": {
    "name": "亲戚计算器",
    "slug": "kinship-calculator",
    "version": "1.0.0",
    "orientation": "portrait",
    "scheme": "kinship",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.kinship.calculator"
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#ffffff"
      },
      "package": "com.kinship.calculator"
    },
    "plugins": ["expo-router"],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

- [ ] **Step 4: Set up root layout with tab navigator**

Create `app/_layout.tsx`:

```tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LanguageProvider } from '../src/i18n/LanguageContext';

export default function RootLayout() {
  return (
    <LanguageProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="result" options={{ headerShown: true, title: '结果', headerBackTitle: '返回' }} />
      </Stack>
    </LanguageProvider>
  );
}
```

Create `app/(tabs)/_layout.tsx`:

```tsx
import { Tabs } from 'expo-router';
import { useLanguage } from '../../src/i18n/LanguageContext';
import { t } from '../../src/i18n/translations';

export default function TabLayout() {
  const { lang } = useLanguage();
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#c41e3a', headerStyle: { backgroundColor: '#fff' } }}>
      <Tabs.Screen
        name="calculate"
        options={{
          title: t('tab_calculate', lang),
          tabBarIcon: ({ color }) => null, // Will use text
          headerTitle: t('tab_calculate', lang),
        }}
      />
      <Tabs.Screen
        name="lookup"
        options={{
          title: t('tab_lookup', lang),
          headerTitle: t('tab_lookup', lang),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tab_settings', lang),
          headerTitle: t('tab_settings', lang),
        }}
      />
    </Tabs>
  );
}
```

- [ ] **Step 5: Create placeholder screen files**

Create `app/(tabs)/calculate.tsx`:

```tsx
import { View, Text, StyleSheet } from 'react-native';

export default function CalculateScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>计算</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold' },
});
```

Create identical placeholder files for `app/(tabs)/lookup.tsx` (title "查询") and `app/(tabs)/settings.tsx` (title "设置").

Create `app/result.tsx`:

```tsx
import { View, Text, StyleSheet } from 'react-native';

export default function ResultScreen() {
  return (
    <View style={styles.container}>
      <Text>Result placeholder</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});
```

- [ ] **Step 6: Verify the app launches**

```bash
cd c:/Users/75815/kinship-calculator
npx expo start --web
```

Expected: App opens in browser with bottom tabs visible.

- [ ] **Step 7: Commit**

```bash
cd c:/Users/75815/kinship-calculator
git add -A && git commit -m "feat: initialize Expo project with tab navigation"
```

---

### Task 2: Core Engine — Types

**Files:**
- Create: `src/engine/types.ts`

- [ ] **Step 1: Write the type definitions**

Create `src/engine/types.ts`:

```typescript
// ---- Basic relationship steps ----
// The 10 atomic relationship directions from ego's perspective
export type BasicRelation =
  | 'father'       // 父亲
  | 'mother'       // 母亲
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
  /** 'direct' = direct line; number = collateral degree (1=sibling, 2=cousin, 3=second cousin...) */
  directness: number; // 0 = direct, 1 = first collateral, 2 = second collateral, etc.
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

// ---- A parsed step in a user's input path ----
export interface ParsedStep {
  /** The raw Chinese text for this step, e.g. "爸爸" */
  raw: string;
  /** The resolved basic relation */
  relation: BasicRelation | null;
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
}

// ---- Engine public API ----
export interface KinshipEngine {
  /** Forward: path text → calculated term */
  calculate(input: string): CalculationResult;
  /** Forward: basic relation steps → calculated term */
  calculateFromSteps(steps: BasicRelation[]): CalculationResult;
  /** Reverse: search term by Chinese name */
  lookupByTerm(search: string): KinshipTerm[];
  /** Reverse: get all terms matching filters */
  lookupByFilter(filters: Partial<KinshipDimensions>): KinshipTerm[];
  /** Get all terms */
  getAllTerms(): KinshipTerm[];
  /** Get all basic relations with Chinese labels */
  getBasicRelations(): { key: BasicRelation; labelZh: string; labelEn: string }[];
}
```

- [ ] **Step 2: Verify file compiles**

```bash
cd c:/Users/75815/kinship-calculator && npx tsc --noEmit src/engine/types.ts
```

- [ ] **Step 3: Commit**

```bash
cd c:/Users/75815/kinship-calculator
git add -A && git commit -m "feat: define core engine types"
```

---

### Task 3: Core Engine — Basic Relations

**Files:**
- Create: `src/engine/basic-relations.ts`

- [ ] **Step 1: Write basic relations with dimension transforms**

Create `src/engine/basic-relations.ts`:

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
cd c:/Users/75815/kinship-calculator
git add -A && git commit -m "feat: define basic relations with dimension transforms"
```

---

### Task 4: Core Engine — Path Parser

**Files:**
- Create: `src/engine/path-parser.ts`

The parser converts Chinese text like "爸爸的哥哥的儿子" into `['father', 'older_brother', 'son']`.

- [ ] **Step 1: Write the path parser**

Create `src/engine/path-parser.ts`:

```typescript
import { BasicRelation } from './types';

// Mapping from Chinese terms to basic relations
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

// Separators between steps
const SEPARATORS = /的|之|的爸爸|的妈妈|的哥哥|的弟弟|的姐姐|的妹妹|的儿子|的女儿|的丈夫|的妻子/g;

/**
 * Parse a Chinese kinship path string into basic relation steps.
 * Example: "爸爸的哥哥的儿子" → ['father', 'older_brother', 'son']
 */
export function parsePath(input: string): BasicRelation[] {
  // Normalize: remove spaces, strip leading "我的" or "我"
  let normalized = input.trim().replace(/\s+/g, '');
  normalized = normalized.replace(/^(我的|我)/, '');

  // Split by separators (的, 之)
  const parts = normalized.split(SEPARATORS).filter(s => s.length > 0);

  // If no separators found, try direct match of the whole string
  if (parts.length === 0 || (parts.length === 1 && parts[0] === normalized)) {
    // Try to match the whole string as a single relation
    const direct = RELATION_MAP[normalized];
    if (direct) return [direct];

    // Try character-by-character for compact forms like "父兄子"
    const chars = normalized.split('');
    const steps: BasicRelation[] = [];
    let i = 0;
    while (i < chars.length) {
      // Try 2-char match first
      const twoChar = chars.slice(i, i + 2).join('');
      if (RELATION_MAP[twoChar]) {
        steps.push(RELATION_MAP[twoChar]);
        i += 2;
      } else if (RELATION_MAP[chars[i]]) {
        steps.push(RELATION_MAP[chars[i]]);
        i += 1;
      } else {
        i += 1; // skip unrecognized
      }
    }
    return steps;
  }

  // Map each part to a basic relation
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
```

- [ ] **Step 2: Commit**

```bash
cd c:/Users/75815/kinship-calculator
git add -A && git commit -m "feat: add path parser for Chinese text input"
```

---

### Task 5: Core Engine — Dimension Calculator

**Files:**
- Create: `src/engine/dimension-calculator.ts`

Traverses a path of basic relations and computes the five dimensions.

- [ ] **Step 1: Write the dimension calculator**

Create `src/engine/dimension-calculator.ts`:

```typescript
import { BasicRelation, KinshipDimensions, Lineage } from './types';
import { BASIC_RELATIONS } from './basic-relations';

/**
 * Compute the five kinship dimensions by traversing a path from ego.
 */
export function calculateDimensions(path: BasicRelation[]): KinshipDimensions {
  let generation = 0;
  let lineage: Lineage = 'paternal'; // default for male ego
  let lineageSet = false;
  let seniority: KinshipDimensions['seniority'] = 'neutral';
  let directness = 0; // 0 = direct line

  for (const step of path) {
    const t = BASIC_RELATIONS[step];

    generation += t.genDelta;

    // Lineage is determined by the first parent/spouse step
    if (!lineageSet && t.lineageSetter) {
      lineage = t.lineageSetter;
      lineageSet = true;
    }

    // Seniority: last sibling step determines it
    if (t.seniority !== 'neutral') {
      seniority = t.seniority;
    }

    directness += t.directnessDelta;
  }

  // Gender is determined by the last step
  const lastStep = BASIC_RELATIONS[path[path.length - 1]];
  const gender = lastStep ? lastStep.gender : 'neutral';

  return { generation, lineage, gender, seniority, directness };
}
```

- [ ] **Step 2: Commit**

```bash
cd c:/Users/75815/kinship-calculator
git add -A && git commit -m "feat: add dimension calculator for path traversal"
```

---

### Task 6: Core Engine — Term Database

**Files:**
- Create: `src/engine/term-database.ts`

The comprehensive kinship term database. Each term is defined by its five-dimension signature.

- [ ] **Step 1: Write the full term database**

Create `src/engine/term-database.ts`:

```typescript
import { KinshipTerm } from './types';

// Build dimension keys for matching
function key(g: number, l: string, gend: string, s: string, d: number): string {
  return `${g}|${l}|${gend}|${s}|${d}`;
}

// All kinship terms indexed by dimension key
const TERM_MAP = new Map<string, KinshipTerm>();

function add(term: KinshipTerm): void {
  const k = key(
    term.dimensions.generation,
    term.dimensions.lineage,
    term.dimensions.gender,
    term.dimensions.seniority,
    term.dimensions.directness
  );
  TERM_MAP.set(k, term);
}

// ============ DIRECT LINE (直系) — lineage irrelevant for direct line ============
// Generation +2
add({ term: '祖父', pinyin: 'zǔ fù', dimensions: { generation: 2, lineage: 'paternal', gender: 'male', seniority: 'neutral', directness: 0 }, paths: [['father', 'father']], explanationZh: '爸爸的爸爸', explanationEn: "Father's father, paternal grandfather", tags: ['direct', 'paternal', 'senior'] });
add({ term: '祖母', pinyin: 'zǔ mǔ', dimensions: { generation: 2, lineage: 'paternal', gender: 'female', seniority: 'neutral', directness: 0 }, paths: [['father', 'mother']], explanationZh: '爸爸的妈妈', explanationEn: "Father's mother, paternal grandmother", tags: ['direct', 'paternal', 'senior'] });
add({ term: '外祖父', pinyin: 'wài zǔ fù', dimensions: { generation: 2, lineage: 'maternal', gender: 'male', seniority: 'neutral', directness: 0 }, paths: [['mother', 'father']], explanationZh: '妈妈的爸爸', explanationEn: "Mother's father, maternal grandfather", tags: ['direct', 'maternal', 'senior'] });
add({ term: '外祖母', pinyin: 'wài zǔ mǔ', dimensions: { generation: 2, lineage: 'maternal', gender: 'female', seniority: 'neutral', directness: 0 }, paths: [['mother', 'mother']], explanationZh: '妈妈的妈妈', explanationEn: "Mother's mother, maternal grandmother", tags: ['direct', 'maternal', 'senior'] });

// Generation +3
add({ term: '曾祖父', pinyin: 'zēng zǔ fù', dimensions: { generation: 3, lineage: 'paternal', gender: 'male', seniority: 'neutral', directness: 0 }, paths: [['father', 'father', 'father']], explanationZh: '爸爸的爸爸的爸爸', explanationEn: "Father's father's father, paternal great-grandfather", tags: ['direct', 'paternal', 'senior'] });
add({ term: '曾祖母', pinyin: 'zēng zǔ mǔ', dimensions: { generation: 3, lineage: 'paternal', gender: 'female', seniority: 'neutral', directness: 0 }, paths: [['father', 'father', 'mother']], explanationZh: '爸爸的爸爸的妈妈', explanationEn: "Father's father's mother, paternal great-grandmother", tags: ['direct', 'paternal', 'senior'] });
add({ term: '曾外祖父', pinyin: 'zēng wài zǔ fù', dimensions: { generation: 3, lineage: 'maternal', gender: 'male', seniority: 'neutral', directness: 0 }, paths: [['mother', 'father', 'father']], explanationZh: '妈妈的爸爸的爸爸', explanationEn: "Mother's father's father", tags: ['direct', 'maternal', 'senior'] });
add({ term: '曾外祖母', pinyin: 'zēng wài zǔ mǔ', dimensions: { generation: 3, lineage: 'maternal', gender: 'female', seniority: 'neutral', directness: 0 }, paths: [['mother', 'father', 'mother']], explanationZh: '妈妈的爸爸的妈妈', explanationEn: "Mother's father's mother", tags: ['direct', 'maternal', 'senior'] });

// Generation +1 (parents — direct line)
add({ term: '父亲', pinyin: 'fù qīn', dimensions: { generation: 1, lineage: 'paternal', gender: 'male', seniority: 'neutral', directness: 0 }, paths: [['father']], explanationZh: '爸爸', explanationEn: 'Father', tags: ['direct', 'paternal'] });
add({ term: '母亲', pinyin: 'mǔ qīn', dimensions: { generation: 1, lineage: 'maternal', gender: 'female', seniority: 'neutral', directness: 0 }, paths: [['mother']], explanationZh: '妈妈', explanationEn: 'Mother', tags: ['direct', 'maternal'] });

// Generation 0 (self/siblings — direct line)
add({ term: '本人', pinyin: 'běn rén', dimensions: { generation: 0, lineage: 'paternal', gender: 'neutral', seniority: 'neutral', directness: 0 }, paths: [[]], explanationZh: '自己', explanationEn: 'Self', tags: ['direct'] });

// Generation -1
add({ term: '儿子', pinyin: 'ér zi', dimensions: { generation: -1, lineage: 'paternal', gender: 'male', seniority: 'neutral', directness: 0 }, paths: [['son']], explanationZh: '自己的儿子', explanationEn: 'Son', tags: ['direct'] });
add({ term: '女儿', pinyin: 'nǚ ér', dimensions: { generation: -1, lineage: 'paternal', gender: 'female', seniority: 'neutral', directness: 0 }, paths: [['daughter']], explanationZh: '自己的女儿', explanationEn: 'Daughter', tags: ['direct'] });

// Generation -2
add({ term: '孙子', pinyin: 'sūn zi', dimensions: { generation: -2, lineage: 'paternal', gender: 'male', seniority: 'neutral', directness: 0 }, paths: [['son', 'son']], explanationZh: '儿子的儿子', explanationEn: "Son's son, grandson (paternal)", tags: ['direct', 'paternal', 'junior'] });
add({ term: '孙女', pinyin: 'sūn nǚ', dimensions: { generation: -2, lineage: 'paternal', gender: 'female', seniority: 'neutral', directness: 0 }, paths: [['son', 'daughter']], explanationZh: '儿子的女儿', explanationEn: "Son's daughter, granddaughter (paternal)", tags: ['direct', 'paternal', 'junior'] });
add({ term: '外孙', pinyin: 'wài sūn', dimensions: { generation: -2, lineage: 'maternal', gender: 'male', seniority: 'neutral', directness: 0 }, paths: [['daughter', 'son']], explanationZh: '女儿的儿子', explanationEn: "Daughter's son, grandson (maternal)", tags: ['direct', 'maternal', 'junior'] });
add({ term: '外孙女', pinyin: 'wài sūn nǚ', dimensions: { generation: -2, lineage: 'maternal', gender: 'female', seniority: 'neutral', directness: 0 }, paths: [['daughter', 'daughter']], explanationZh: '女儿的女儿', explanationEn: "Daughter's daughter, granddaughter (maternal)", tags: ['direct', 'maternal', 'junior'] });

// ============ FIRST COLLATERAL: SIBLINGS (一代旁系：兄弟姐妹) ============
add({ term: '哥哥', pinyin: 'gē ge', dimensions: { generation: 0, lineage: 'paternal', gender: 'male', seniority: 'older', directness: 1 }, paths: [['older_brother']], explanationZh: '比自己年长的同辈男性，同一父母', explanationEn: 'Older brother, same parents', tags: ['collateral', 'paternal', 'same_gen'] });
add({ term: '弟弟', pinyin: 'dì di', dimensions: { generation: 0, lineage: 'paternal', gender: 'male', seniority: 'younger', directness: 1 }, paths: [['younger_brother']], explanationZh: '比自己年幼的同辈男性，同一父母', explanationEn: 'Younger brother, same parents', tags: ['collateral', 'paternal', 'same_gen'] });
add({ term: '姐姐', pinyin: 'jiě jie', dimensions: { generation: 0, lineage: 'paternal', gender: 'female', seniority: 'older', directness: 1 }, paths: [['older_sister']], explanationZh: '比自己年长的同辈女性，同一父母', explanationEn: 'Older sister, same parents', tags: ['collateral', 'paternal', 'same_gen'] });
add({ term: '妹妹', pinyin: 'mèi mei', dimensions: { generation: 0, lineage: 'paternal', gender: 'female', seniority: 'younger', directness: 1 }, paths: [['younger_sister']], explanationZh: '比自己年幼的同辈女性，同一父母', explanationEn: 'Younger sister, same parents', tags: ['collateral', 'paternal', 'same_gen'] });

// ============ PATERNAL UNCLE/AUNT (父系长辈：伯叔姑) ============
// father's older brother → 伯父
add({ term: '伯父', pinyin: 'bó fù', dimensions: { generation: 1, lineage: 'paternal', gender: 'male', seniority: 'older', directness: 1 }, paths: [['father', 'older_brother']], explanationZh: '爸爸的哥哥', explanationEn: "Father's older brother, paternal uncle", tags: ['collateral', 'paternal', 'senior'] });
// father's younger brother → 叔父
add({ term: '叔父', pinyin: 'shū fù', dimensions: { generation: 1, lineage: 'paternal', gender: 'male', seniority: 'younger', directness: 1 }, paths: [['father', 'younger_brother']], explanationZh: '爸爸的弟弟', explanationEn: "Father's younger brother, paternal uncle", tags: ['collateral', 'paternal', 'senior'] });
// father's sister → 姑母
add({ term: '姑母', pinyin: 'gū mǔ', dimensions: { generation: 1, lineage: 'paternal', gender: 'female', seniority: 'neutral', directness: 1 }, paths: [['father', 'older_sister'], ['father', 'younger_sister']], explanationZh: '爸爸的姐姐或妹妹', explanationEn: "Father's sister, paternal aunt", tags: ['collateral', 'paternal', 'senior'] });

// ============ MATERNAL UNCLE/AUNT (母系长辈：舅姨) ============
// mother's brother → 舅父
add({ term: '舅父', pinyin: 'jiù fù', dimensions: { generation: 1, lineage: 'maternal', gender: 'male', seniority: 'neutral', directness: 1 }, paths: [['mother', 'older_brother'], ['mother', 'younger_brother']], explanationZh: '妈妈的哥哥或弟弟', explanationEn: "Mother's brother, maternal uncle", tags: ['collateral', 'maternal', 'senior'] });
// mother's sister → 姨母
add({ term: '姨母', pinyin: 'yí mǔ', dimensions: { generation: 1, lineage: 'maternal', gender: 'female', seniority: 'neutral', directness: 1 }, paths: [['mother', 'older_sister'], ['mother', 'younger_sister']], explanationZh: '妈妈的姐姐或妹妹', explanationEn: "Mother's sister, maternal aunt", tags: ['collateral', 'maternal', 'senior'] });

// ============ SECOND COLLATERAL: PATERNAL COUSINS (二代旁系：堂兄弟姐妹) ============
// father's brother's son → 堂兄/堂弟
add({ term: '堂兄', pinyin: 'táng xiōng', dimensions: { generation: 0, lineage: 'paternal', gender: 'male', seniority: 'older', directness: 2 }, paths: [['father', 'older_brother', 'son']], explanationZh: '爸爸的哥哥的儿子（比自己年长）', explanationEn: "Father's older brother's son (older than self), paternal male cousin", tags: ['collateral', 'paternal', 'same_gen'] });
add({ term: '堂弟', pinyin: 'táng dì', dimensions: { generation: 0, lineage: 'paternal', gender: 'male', seniority: 'younger', directness: 2 }, paths: [['father', 'older_brother', 'son']], explanationZh: '爸爸的哥哥的儿子（比自己年幼）', explanationEn: "Father's older brother's son (younger than self), paternal male cousin", tags: ['collateral', 'paternal', 'same_gen'] });
add({ term: '堂姐', pinyin: 'táng jiě', dimensions: { generation: 0, lineage: 'paternal', gender: 'female', seniority: 'older', directness: 2 }, paths: [['father', 'older_brother', 'daughter']], explanationZh: '爸爸的哥哥的女儿（比自己年长）', explanationEn: "Father's older brother's daughter (older than self), paternal female cousin", tags: ['collateral', 'paternal', 'same_gen'] });
add({ term: '堂妹', pinyin: 'táng mèi', dimensions: { generation: 0, lineage: 'paternal', gender: 'female', seniority: 'younger', directness: 2 }, paths: [['father', 'older_brother', 'daughter']], explanationZh: '爸爸的哥哥的女儿（比自己年幼）', explanationEn: "Father's older brother's daughter (younger than self), paternal female cousin", tags: ['collateral', 'paternal', 'same_gen'] });

// ============ SECOND COLLATERAL: MATERNAL COUSINS (二代旁系：表兄弟姐妹) ============
// mother's brother's children → 表兄/表弟
add({ term: '表兄', pinyin: 'biǎo xiōng', dimensions: { generation: 0, lineage: 'maternal', gender: 'male', seniority: 'older', directness: 2 }, paths: [['mother', 'older_brother', 'son']], explanationZh: '妈妈的哥哥或弟弟的儿子（比自己年长）', explanationEn: "Mother's brother's son (older than self), maternal male cousin", tags: ['collateral', 'maternal', 'same_gen'] });
add({ term: '表弟', pinyin: 'biǎo dì', dimensions: { generation: 0, lineage: 'maternal', gender: 'male', seniority: 'younger', directness: 2 }, paths: [['mother', 'older_brother', 'son']], explanationZh: '妈妈的哥哥或弟弟的儿子（比自己年幼）', explanationEn: "Mother's brother's son (younger than self), maternal male cousin", tags: ['collateral', 'maternal', 'same_gen'] });
add({ term: '表姐', pinyin: 'biǎo jiě', dimensions: { generation: 0, lineage: 'maternal', gender: 'female', seniority: 'older', directness: 2 }, paths: [['mother', 'older_brother', 'daughter']], explanationZh: '妈妈的哥哥或弟弟的女儿（比自己年长）', explanationEn: "Mother's brother's daughter (older than self), maternal female cousin", tags: ['collateral', 'maternal', 'same_gen'] });
add({ term: '表妹', pinyin: 'biǎo mèi', dimensions: { generation: 0, lineage: 'maternal', gender: 'female', seniority: 'younger', directness: 2 }, paths: [['mother', 'older_brother', 'daughter']], explanationZh: '妈妈的哥哥或弟弟的女儿（比自己年幼）', explanationEn: "Mother's brother's daughter (younger than self), maternal female cousin", tags: ['collateral', 'maternal', 'same_gen'] });

// ============ NIECES/NEPHEWS (晚辈：侄、甥) ============
// brother's children → 侄
add({ term: '侄子', pinyin: 'zhí zi', dimensions: { generation: -1, lineage: 'paternal', gender: 'male', seniority: 'neutral', directness: 1 }, paths: [['older_brother', 'son']], explanationZh: '哥哥或弟弟的儿子', explanationEn: "Brother's son, nephew (paternal)", tags: ['collateral', 'paternal', 'junior'] });
add({ term: '侄女', pinyin: 'zhí nǚ', dimensions: { generation: -1, lineage: 'paternal', gender: 'female', seniority: 'neutral', directness: 1 }, paths: [['older_brother', 'daughter']], explanationZh: '哥哥或弟弟的女儿', explanationEn: "Brother's daughter, niece (paternal)", tags: ['collateral', 'paternal', 'junior'] });
// sister's children → 外甥
add({ term: '外甥', pinyin: 'wài shēng', dimensions: { generation: -1, lineage: 'maternal', gender: 'male', seniority: 'neutral', directness: 1 }, paths: [['older_sister', 'son']], explanationZh: '姐姐或妹妹的儿子', explanationEn: "Sister's son, nephew (maternal)", tags: ['collateral', 'maternal', 'junior'] });
add({ term: '外甥女', pinyin: 'wài shēng nǚ', dimensions: { generation: -1, lineage: 'maternal', gender: 'female', seniority: 'neutral', directness: 1 }, paths: [['older_sister', 'daughter']], explanationZh: '姐姐/妹妹的女儿', explanationEn: "Sister's daughter, niece (maternal)", tags: ['collateral', 'maternal', 'junior'] });

// ============ SPOUSE & AFFINAL (姻亲) ============
add({ term: '丈夫', pinyin: 'zhàng fu', dimensions: { generation: 0, lineage: 'husband_family', gender: 'male', seniority: 'neutral', directness: 0 }, paths: [['husband']], explanationZh: '配偶（男性）', explanationEn: 'Husband', tags: ['affinal'] });
add({ term: '妻子', pinyin: 'qī zi', dimensions: { generation: 0, lineage: 'wife_family', gender: 'female', seniority: 'neutral', directness: 0 }, paths: [['wife']], explanationZh: '配偶（女性）', explanationEn: 'Wife', tags: ['affinal'] });
// Husband's parents → 公婆
add({ term: '公公', pinyin: 'gōng gong', dimensions: { generation: 1, lineage: 'husband_family', gender: 'male', seniority: 'neutral', directness: 0 }, paths: [['husband', 'father']], explanationZh: '丈夫的爸爸', explanationEn: "Husband's father, father-in-law (from wife's perspective)", tags: ['affinal', 'husband_family'] });
add({ term: '婆婆', pinyin: 'pó po', dimensions: { generation: 1, lineage: 'husband_family', gender: 'female', seniority: 'neutral', directness: 0 }, paths: [['husband', 'mother']], explanationZh: '丈夫的妈妈', explanationEn: "Husband's mother, mother-in-law (from wife's perspective)", tags: ['affinal', 'husband_family'] });
// Wife's parents → 岳父母
add({ term: '岳父', pinyin: 'yuè fù', dimensions: { generation: 1, lineage: 'wife_family', gender: 'male', seniority: 'neutral', directness: 0 }, paths: [['wife', 'father']], explanationZh: '妻子的爸爸', explanationEn: "Wife's father, father-in-law (from husband's perspective)", tags: ['affinal', 'wife_family'] });
add({ term: '岳母', pinyin: 'yuè mǔ', dimensions: { generation: 1, lineage: 'wife_family', gender: 'female', seniority: 'neutral', directness: 0 }, paths: [['wife', 'mother']], explanationZh: '妻子的妈妈', explanationEn: "Wife's mother, mother-in-law (from husband's perspective)", tags: ['affinal', 'wife_family'] });

// Brother's wife → 嫂子/弟媳
add({ term: '嫂子', pinyin: 'sǎo zi', dimensions: { generation: 0, lineage: 'paternal', gender: 'female', seniority: 'older', directness: 1 }, paths: [['older_brother', 'wife']], explanationZh: '哥哥的妻子', explanationEn: "Older brother's wife, sister-in-law", tags: ['affinal', 'paternal'] });
add({ term: '弟媳', pinyin: 'dì xí', dimensions: { generation: 0, lineage: 'paternal', gender: 'female', seniority: 'younger', directness: 1 }, paths: [['younger_brother', 'wife']], explanationZh: '弟弟的妻子', explanationEn: "Younger brother's wife, sister-in-law", tags: ['affinal', 'paternal'] });

// Uncle's wife (伯母/婶婶)
add({ term: '伯母', pinyin: 'bó mǔ', dimensions: { generation: 1, lineage: 'paternal', gender: 'female', seniority: 'older', directness: 1 }, paths: [['father', 'older_brother', 'wife']], explanationZh: '伯父的妻子', explanationEn: "Father's older brother's wife, aunt (paternal)", tags: ['affinal', 'paternal'] });
add({ term: '婶婶', pinyin: 'shěn shen', dimensions: { generation: 1, lineage: 'paternal', gender: 'female', seniority: 'younger', directness: 1 }, paths: [['father', 'younger_brother', 'wife']], explanationZh: '叔父的妻子', explanationEn: "Father's younger brother's wife, aunt (paternal)", tags: ['affinal', 'paternal'] });
// Mother's brother's wife → 舅母
add({ term: '舅母', pinyin: 'jiù mǔ', dimensions: { generation: 1, lineage: 'maternal', gender: 'female', seniority: 'neutral', directness: 1 }, paths: [['mother', 'older_brother', 'wife']], explanationZh: '舅父的妻子', explanationEn: "Mother's brother's wife, aunt (maternal)", tags: ['affinal', 'maternal'] });

// ============ EXTENDED PATERNAL (宗族) ============
// father's father's brother's son's son → 再从兄弟 (third collateral, paternal)
add({ term: '再从兄', pinyin: 'zài cóng xiōng', dimensions: { generation: 0, lineage: 'paternal', gender: 'male', seniority: 'older', directness: 3 }, paths: [['father', 'father', 'older_brother', 'son', 'son']], explanationZh: '祖父的哥哥的儿子的儿子（比自己年长），同曾祖父', explanationEn: "Paternal second cousin (older), shares great-grandfather", tags: ['collateral', 'paternal', 'same_gen', 'extended'] });
add({ term: '再从弟', pinyin: 'zài cóng dì', dimensions: { generation: 0, lineage: 'paternal', gender: 'male', seniority: 'younger', directness: 3 }, paths: [['father', 'father', 'older_brother', 'son', 'son']], explanationZh: '祖父的哥哥的儿子的儿子（比自己年幼），同曾祖父', explanationEn: "Paternal second cousin (younger), shares great-grandfather", tags: ['collateral', 'paternal', 'same_gen', 'extended'] });

// father's father's brother = 伯祖父/叔祖父
add({ term: '伯祖父', pinyin: 'bó zǔ fù', dimensions: { generation: 2, lineage: 'paternal', gender: 'male', seniority: 'older', directness: 2 }, paths: [['father', 'father', 'older_brother']], explanationZh: '爸爸的爸爸的哥哥', explanationEn: "Grandfather's older brother, granduncle (paternal)", tags: ['collateral', 'paternal', 'senior', 'extended'] });
add({ term: '叔祖父', pinyin: 'shū zǔ fù', dimensions: { generation: 2, lineage: 'paternal', gender: 'male', seniority: 'younger', directness: 2 }, paths: [['father', 'father', 'younger_brother']], explanationZh: '爸爸的爸爸的弟弟', explanationEn: "Grandfather's younger brother, granduncle (paternal)", tags: ['collateral', 'paternal', 'senior', 'extended'] });

// Mother's father's brother's son → 表舅 (complex maternal)
// Actually 舅父 already covers mother's brother. Mother's father's brother = 舅祖父
add({ term: '舅祖父', pinyin: 'jiù zǔ fù', dimensions: { generation: 2, lineage: 'maternal', gender: 'male', seniority: 'neutral', directness: 2 }, paths: [['mother', 'father', 'older_brother']], explanationZh: '妈妈的爸爸的哥哥或弟弟', explanationEn: "Maternal grandmother's brother, great-uncle (maternal)", tags: ['collateral', 'maternal', 'senior', 'extended'] });

// ============ Special / step relations ============
add({ term: '继父', pinyin: 'jì fù', dimensions: { generation: 1, lineage: 'paternal', gender: 'male', seniority: 'neutral', directness: 0 }, paths: [['mother', 'husband']], explanationZh: '妈妈的再婚丈夫（非生父）', explanationEn: 'Stepfather', tags: ['special'] });
add({ term: '继母', pinyin: 'jì mǔ', dimensions: { generation: 1, lineage: 'paternal', gender: 'female', seniority: 'neutral', directness: 0 }, paths: [['father', 'wife']], explanationZh: '爸爸的再婚妻子（非生母）', explanationEn: 'Stepmother', tags: ['special'] });

// Son's wife / daughter's husband
add({ term: '儿媳', pinyin: 'ér xí', dimensions: { generation: -1, lineage: 'paternal', gender: 'female', seniority: 'neutral', directness: 0 }, paths: [['son', 'wife']], explanationZh: '儿子的妻子', explanationEn: "Son's wife, daughter-in-law", tags: ['affinal', 'junior'] });
add({ term: '女婿', pinyin: 'nǚ xu', dimensions: { generation: -1, lineage: 'maternal', gender: 'male', seniority: 'neutral', directness: 0 }, paths: [['daughter', 'husband']], explanationZh: '女儿的丈夫', explanationEn: "Daughter's husband, son-in-law", tags: ['affinal', 'junior'] });

// ===== Public API =====

/** Get a term by exact dimension match */
export function getTermByDimensions(dims: KinshipTerm['dimensions']): KinshipTerm | undefined {
  const k = key(dims.generation, dims.lineage, dims.gender, dims.seniority, dims.directness);
  return TERM_MAP.get(k);
}

/** Search terms by Chinese name (fuzzy match) */
export function searchTerms(query: string): KinshipTerm[] {
  const q = query.trim().toLowerCase();
  if (!q) return getAllTerms();
  return getAllTerms().filter(t =>
    t.term.includes(q) || t.pinyin.toLowerCase().includes(q)
  );
}

/** Get all terms */
export function getAllTerms(): KinshipTerm[] {
  return Array.from(TERM_MAP.values());
}

/** Get terms by category tag */
export function getTermsByTag(tag: string): KinshipTerm[] {
  return getAllTerms().filter(t => t.tags.includes(tag));
}

/** Get all available tags */
export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  for (const t of TERM_MAP.values()) {
    for (const tag of t.tags) tagSet.add(tag);
  }
  return Array.from(tagSet);
}
```

- [ ] **Step 2: Commit**

```bash
cd c:/Users/75815/kinship-calculator
git add -A && git commit -m "feat: add comprehensive kinship term database (~50 terms)"
```

---

### Task 7: Core Engine — Term Matcher + Engine API

**Files:**
- Create: `src/engine/term-matcher.ts`
- Create: `src/engine/index.ts`

- [ ] **Step 1: Write the term matcher**

Create `src/engine/term-matcher.ts`:

```typescript
import { KinshipDimensions, KinshipTerm } from './types';
import { getTermByDimensions, getAllTerms, searchTerms, getTermsByTag, getAllTags } from './term-database';

/**
 * Match dimensions to the closest kinship term.
 * Tries exact match first, then relaxes seniority, then directness.
 */
export function matchTerm(dims: KinshipDimensions): { term: KinshipTerm | null; alternatives: KinshipTerm[] } {
  // Try exact match
  const exact = getTermByDimensions(dims);
  if (exact) return { term: exact, alternatives: [] };

  // Try relaxing seniority (for paths that don't specify older/younger)
  if (dims.seniority !== 'neutral') {
    const relaxed = getTermByDimensions({ ...dims, seniority: 'neutral' });
    if (relaxed) return { term: relaxed, alternatives: findAlternatives(dims) };
  }

  // Try relaxing seniority to both older and younger
  const older = getTermByDimensions({ ...dims, seniority: 'older' });
  const younger = getTermByDimensions({ ...dims, seniority: 'younger' });
  if (older || younger) {
    return {
      term: null,
      alternatives: [older, younger].filter(Boolean) as KinshipTerm[],
    };
  }

  // Try relaxing other dimensions
  return { term: null, alternatives: findAlternatives(dims) };
}

function findAlternatives(dims: KinshipDimensions): KinshipTerm[] {
  // Find terms with same generation and lineage
  return getAllTerms()
    .filter(t =>
      t.dimensions.generation === dims.generation &&
      t.dimensions.lineage === dims.lineage &&
      t.dimensions.gender === dims.gender
    )
    .slice(0, 5);
}
```

- [ ] **Step 2: Write the engine public API**

Create `src/engine/index.ts`:

```typescript
import { KinshipEngine, CalculationResult, KinshipDimensions, KinshipTerm, BasicRelation } from './types';
import { parsePath, validatePath } from './path-parser';
import { calculateDimensions } from './dimension-calculator';
import { matchTerm } from './term-matcher';
import { searchTerms, getAllTerms, getTermsByTag, getAllTags } from './term-database';
import { BASIC_RELATIONS } from './basic-relations';

export function createKinshipEngine(): KinshipEngine {
  return {
    calculate(input: string): CalculationResult {
      const { valid, steps, error } = validatePath(input);
      if (!valid) {
        return {
          term: null,
          dimensions: { generation: 0, lineage: 'paternal', gender: 'neutral', seniority: 'neutral', directness: 0 },
          path: [],
          alternatives: [],
        };
      }
      return this.calculateFromSteps(steps);
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

    lookupByFilter(filters: Partial<KinshipDimensions>): KinshipTerm[] {
      let results = getAllTerms();
      if (filters.generation !== undefined) {
        results = results.filter(t => t.dimensions.generation === filters.generation);
      }
      if (filters.lineage !== undefined) {
        results = results.filter(t => t.dimensions.lineage === filters.lineage);
      }
      if (filters.gender !== undefined) {
        results = results.filter(t => t.dimensions.gender === filters.gender);
      }
      return results;
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

// Re-export types
export type { KinshipEngine, CalculationResult, KinshipDimensions, KinshipTerm, BasicRelation } from './types';
```

- [ ] **Step 3: Commit**

```bash
cd c:/Users/75815/kinship-calculator
git add -A && git commit -m "feat: add term matcher and engine public API"
```

---

### Task 8: Internationalization

**Files:**
- Create: `src/i18n/translations.ts`
- Create: `src/i18n/LanguageContext.tsx`

- [ ] **Step 1: Write translation strings**

Create `src/i18n/translations.ts`:

```typescript
export type Language = 'zh' | 'en';
export type TranslationKey = keyof typeof translations.zh;

const translations = {
  zh: {
    tab_calculate: '计算',
    tab_lookup: '查询',
    tab_settings: '设置',
    title_calculate: '关系计算',
    title_lookup: '称谓查询',
    title_settings: '设置',
    input_placeholder: '输入关系路径，如：爸爸的哥哥的儿子',
    input_text_mode: '文字输入',
    input_select_mode: '逐步选择',
    btn_calculate: '计算',
    btn_clear: '清除',
    btn_add_step: '添加一步',
    label_me: '我',
    search_placeholder: '搜索称谓...',
    category_direct: '直系',
    category_paternal: '父系',
    category_maternal: '母系',
    category_affinal: '姻亲',
    category_special: '特殊',
    category_senior: '长辈',
    category_same_gen: '同辈',
    category_junior: '晚辈',
    result_title: '计算结果',
    result_term: '称谓',
    result_pinyin: '拼音',
    result_explanation: '关系说明',
    result_path: '关系路径',
    result_tree: '家族图谱',
    result_no_match: '未找到匹配的称谓',
    result_alternatives: '可能的称谓：',
    lang_switch: '语言 / Language',
    about_title: '关于',
    about_text: '亲戚计算器 v1.0\n帮助你理解和计算中国传统亲属关系\n数据完全本地，无需联网',
    step_me: '我',
    step_father: '爸爸',
    step_mother: '妈妈',
    step_older_brother: '哥哥',
    step_younger_brother: '弟弟',
    step_older_sister: '姐姐',
    step_younger_sister: '妹妹',
    step_husband: '丈夫',
    step_wife: '妻子',
    step_son: '儿子',
    step_daughter: '女儿',
    back: '返回',
  },
  en: {
    tab_calculate: 'Calculate',
    tab_lookup: 'Lookup',
    tab_settings: 'Settings',
    title_calculate: 'Path → Term',
    title_lookup: 'Term → Path',
    title_settings: 'Settings',
    input_placeholder: 'Enter relationship path, e.g. father\'s older brother\'s son',
    input_text_mode: 'Type',
    input_select_mode: 'Select',
    btn_calculate: 'Calculate',
    btn_clear: 'Clear',
    btn_add_step: 'Add Step',
    label_me: 'Me',
    search_placeholder: 'Search kinship term...',
    category_direct: 'Direct',
    category_paternal: 'Paternal',
    category_maternal: 'Maternal',
    category_affinal: 'Affinal',
    category_special: 'Special',
    category_senior: 'Senior Gen.',
    category_same_gen: 'Same Gen.',
    category_junior: 'Junior Gen.',
    result_title: 'Result',
    result_term: 'Term',
    result_pinyin: 'Pinyin',
    result_explanation: 'Explanation',
    result_path: 'Relation Path',
    result_tree: 'Family Tree',
    result_no_match: 'No matching term found',
    result_alternatives: 'Possible terms:',
    lang_switch: '语言 / Language',
    about_title: 'About',
    about_text: 'Kinship Calculator v1.0\nUnderstand and calculate Chinese kinship relationships\nAll data is local, no internet needed',
    step_me: 'Me',
    step_father: 'Father',
    step_mother: 'Mother',
    step_older_brother: 'Older Brother',
    step_younger_brother: 'Younger Brother',
    step_older_sister: 'Older Sister',
    step_younger_sister: 'Younger Sister',
    step_husband: 'Husband',
    step_wife: 'Wife',
    step_son: 'Son',
    step_daughter: 'Daughter',
    back: 'Back',
  },
} as const;

export function t(key: TranslationKey, lang: Language): string {
  return translations[lang][key] ?? translations.zh[key] ?? key;
}
```

- [ ] **Step 2: Write LanguageContext**

Create `src/i18n/LanguageContext.tsx`:

```tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Language } from './translations';
import { t, TranslationKey } from './translations';

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'zh',
  setLang: () => {},
  t: (key: TranslationKey) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('zh');

  const translate = useCallback((key: TranslationKey): string => {
    return t(key, lang);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translate }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  return useContext(LanguageContext);
}
```

- [ ] **Step 3: Commit**

```bash
cd c:/Users/75815/kinship-calculator
git add -A && git commit -m "feat: add i18n translations and language context"
```

---

### Task 9: UI — Path Selector Component + Text Input

**Files:**
- Create: `src/components/StepSelector.tsx`
- Create: `src/components/PathTextInput.tsx`

- [ ] **Step 1: Write StepSelector component**

Create `src/components/StepSelector.tsx`:

```tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { BasicRelation } from '../engine/types';
import { useLanguage } from '../i18n/LanguageContext';

const STEP_OPTIONS: BasicRelation[] = [
  'father', 'mother',
  'older_brother', 'younger_brother', 'older_sister', 'younger_sister',
  'husband', 'wife',
  'son', 'daughter',
];

interface Props {
  steps: BasicRelation[];
  onAdd: (rel: BasicRelation) => void;
  onRemove: (index: number) => void;
  onClear: () => void;
}

export function StepSelector({ steps, onAdd, onRemove, onClear }: Props) {
  const { t, lang } = useLanguage();

  return (
    <View style={styles.container}>
      {/* Current path display */}
      <View style={styles.pathRow}>
        <View style={styles.pathChip}>
          <Text style={styles.pathText}>{t('step_me')}</Text>
        </View>
        {steps.map((step, i) => (
          <View key={i} style={styles.pathRow}>
            <Text style={styles.arrow}>的</Text>
            <TouchableOpacity onPress={() => onRemove(i)}>
              <View style={[styles.pathChip, styles.pathChipActive]}>
                <Text style={styles.pathTextActive}>
                  {lang === 'zh' ? getLabelZh(step) : getLabelEn(step)}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Option buttons */}
      <Text style={styles.label}>{t('btn_add_step')}:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsRow}>
        {STEP_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={styles.optionBtn}
            onPress={() => onAdd(opt)}
          >
            <Text style={styles.optionText}>
              {lang === 'zh' ? getLabelZh(opt) : getLabelEn(opt)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {steps.length > 0 && (
        <TouchableOpacity style={styles.clearBtn} onPress={onClear}>
          <Text style={styles.clearBtnText}>{t('btn_clear')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function getLabelZh(r: BasicRelation): string {
  const map: Record<BasicRelation, string> = {
    father: '爸爸', mother: '妈妈',
    older_brother: '哥哥', younger_brother: '弟弟',
    older_sister: '姐姐', younger_sister: '妹妹',
    husband: '丈夫', wife: '妻子',
    son: '儿子', daughter: '女儿',
  };
  return map[r];
}

function getLabelEn(r: BasicRelation): string {
  const map: Record<BasicRelation, string> = {
    father: 'Father', mother: 'Mother',
    older_brother: 'Older Bro', younger_brother: 'Younger Bro',
    older_sister: 'Older Sis', younger_sister: 'Younger Sis',
    husband: 'Husband', wife: 'Wife',
    son: 'Son', daughter: 'Daughter',
  };
  return map[r];
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  pathRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
  pathChip: {
    backgroundColor: '#f0f0f0', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8, marginVertical: 4,
  },
  pathChipActive: { backgroundColor: '#c41e3a' },
  pathText: { fontSize: 15, color: '#333' },
  pathTextActive: { fontSize: 15, color: '#fff' },
  arrow: { marginHorizontal: 4, fontSize: 14, color: '#999' },
  label: { fontSize: 14, color: '#666', marginTop: 16, marginBottom: 8 },
  optionsRow: { flexDirection: 'row', marginBottom: 8 },
  optionBtn: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#c41e3a',
    borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10,
    marginRight: 8,
  },
  optionText: { fontSize: 14, color: '#c41e3a' },
  clearBtn: { alignSelf: 'flex-start', marginTop: 8 },
  clearBtnText: { fontSize: 13, color: '#999' },
});
```

- [ ] **Step 2: Write PathTextInput component**

Create `src/components/PathTextInput.tsx`:

```tsx
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  onSubmit: (text: string) => void;
}

export function PathTextInput({ onSubmit }: Props) {
  const { t } = useLanguage();
  const [text, setText] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder={t('input_placeholder')}
        placeholderTextColor="#aaa"
        multiline={false}
        returnKeyType="search"
        onSubmitEditing={() => onSubmit(text)}
      />
      <TouchableOpacity
        style={[styles.btn, !text.trim() && styles.btnDisabled]}
        onPress={() => onSubmit(text)}
        disabled={!text.trim()}
      >
        <Text style={styles.btnText}>{t('btn_calculate')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 14, fontSize: 16,
    backgroundColor: '#fff', marginBottom: 12,
  },
  btn: {
    backgroundColor: '#c41e3a', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center',
  },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
});
```

- [ ] **Step 3: Commit**

```bash
cd c:/Users/75815/kinship-calculator
git add -A && git commit -m "feat: add StepSelector and PathTextInput components"
```

---

### Task 10: UI — Family Tree Component + Term Card

**Files:**
- Create: `src/components/FamilyTreeView.tsx`
- Create: `src/components/TermCard.tsx`

- [ ] **Step 1: Write FamilyTreeView component**

Using `react-native-svg` to draw a simple family tree diagram.

Create `src/components/FamilyTreeView.tsx`:

```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Line, Circle, Text as SvgText, Rect } from 'react-native-svg';
import { BasicRelation } from '../engine/types';
import { useLanguage } from '../i18n/LanguageContext';

interface TreePerson {
  id: string;
  label: string;
  level: number; // generation level (0 = ego)
  isTarget: boolean;
}

interface Props {
  path: BasicRelation[];
}

const NODE_W = 60;
const NODE_H = 30;
const LEVEL_H = 80;
const SVG_W = 300;

export function FamilyTreeView({ path }: Props) {
  const { lang } = useLanguage();

  // Build tree nodes from path
  const nodes: TreePerson[] = [
    { id: 'ego', label: lang === 'zh' ? '我' : 'Me', level: 0, isTarget: false },
  ];

  let currentLevel = 0;
  for (let i = 0; i < path.length; i++) {
    const step = path[i];
    const label = lang === 'zh' ? getLabelZh(step) : getLabelEn(step);
    if (step === 'father' || step === 'mother') {
      currentLevel += 1;
    } else if (step === 'son' || step === 'daughter') {
      currentLevel -= 1;
    }
    nodes.push({
      id: `step-${i}`,
      label,
      level: currentLevel,
      isTarget: i === path.length - 1,
    });
  }

  const minLevel = Math.min(...nodes.map(n => n.level));
  const maxLevel = Math.max(...nodes.map(n => n.level));
  const svgH = (maxLevel - minLevel + 1) * LEVEL_H + 40;

  return (
    <View style={styles.container}>
      <Svg width={SVG_W} height={svgH} viewBox={`0 0 ${SVG_W} ${svgH}`}>
        {/* Lines between nodes */}
        {nodes.slice(1).map((node, i) => {
          const prev = nodes[i];
          const prevX = SVG_W / 2 + (prev.level === node.level ? 40 : 0);
          const prevY = (maxLevel - prev.level) * LEVEL_H + 20 + NODE_H;
          const currX = SVG_W / 2;
          const currY = (maxLevel - node.level) * LEVEL_H + 20;
          return (
            <Line
              key={`line-${i}`}
              x1={prevX} y1={prevY}
              x2={currX} y2={currY}
              stroke="#ccc" strokeWidth={2}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node, i) => {
          const x = SVG_W / 2 - NODE_W / 2;
          const y = (maxLevel - node.level) * LEVEL_H + 10;
          const fill = node.isTarget ? '#c41e3a' : node.id === 'ego' ? '#333' : '#666';
          return (
            <React.Fragment key={node.id}>
              <Rect x={x} y={y} width={NODE_W} height={NODE_H} rx={8} fill={fill} />
              <SvgText
                x={x + NODE_W / 2} y={y + NODE_H / 2 + 5}
                fill="#fff" fontSize={12} textAnchor="middle"
              >
                {node.label}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}

function getLabelZh(r: BasicRelation): string {
  const map: Record<BasicRelation, string> = {
    father: '爸', mother: '妈',
    older_brother: '兄', younger_brother: '弟',
    older_sister: '姐', younger_sister: '妹',
    husband: '夫', wife: '妻', son: '子', daughter: '女',
  };
  return map[r];
}

function getLabelEn(r: BasicRelation): string {
  const map: Record<BasicRelation, string> = {
    father: 'Fa', mother: 'Mo',
    older_brother: 'OB', younger_brother: 'YB',
    older_sister: 'OS', younger_sister: 'YS',
    husband: 'Hu', wife: 'Wi', son: 'So', daughter: 'Da',
  };
  return map[r];
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 16 },
});
```

- [ ] **Step 2: Write TermCard component**

Create `src/components/TermCard.tsx`:

```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { KinshipTerm } from '../engine/types';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  term: KinshipTerm;
}

export function TermCard({ term }: Props) {
  const { lang } = useLanguage();

  return (
    <View style={styles.card}>
      <Text style={styles.term}>{term.term}</Text>
      <Text style={styles.pinyin}>{term.pinyin}</Text>
      <View style={styles.divider} />
      <Text style={styles.explanation}>
        {lang === 'zh' ? term.explanationZh : term.explanationEn}
      </Text>
      {term.tags.length > 0 && (
        <View style={styles.tags}>
          {term.tags.map(tag => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff', borderRadius: 16,
    padding: 24, marginVertical: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 3,
    alignItems: 'center',
  },
  term: { fontSize: 36, fontWeight: 'bold', color: '#c41e3a' },
  pinyin: { fontSize: 16, color: '#888', marginTop: 4 },
  divider: { height: 1, backgroundColor: '#eee', alignSelf: 'stretch', marginVertical: 16 },
  explanation: { fontSize: 15, color: '#333', textAlign: 'center', lineHeight: 22 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, justifyContent: 'center' },
  tag: {
    backgroundColor: '#f5f5f5', borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: 4, margin: 3,
  },
  tagText: { fontSize: 12, color: '#888' },
});
```

- [ ] **Step 3: Commit**

```bash
cd c:/Users/75815/kinship-calculator
git add -A && git commit -m "feat: add FamilyTreeView and TermCard components"
```

---

### Task 11: UI — Calculate Screen (Forward Calculation)

**Files:**
- Modify: `app/(tabs)/calculate.tsx`

- [ ] **Step 1: Write the calculate screen**

Replace `app/(tabs)/calculate.tsx`:

```tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '../../src/i18n/LanguageContext';
import { PathTextInput } from '../../src/components/PathTextInput';
import { StepSelector } from '../../src/components/StepSelector';
import { createKinshipEngine } from '../../src/engine';
import { BasicRelation } from '../../src/engine/types';

type InputMode = 'text' | 'select';

const engine = createKinshipEngine();

export default function CalculateScreen() {
  const { t } = useLanguage();
  const router = useRouter();
  const [mode, setMode] = useState<InputMode>('text');
  const [steps, setSteps] = useState<BasicRelation[]>([]);

  const handleTextSubmit = (text: string) => {
    const result = engine.calculate(text);
    router.push({
      pathname: '/result',
      params: { path: JSON.stringify(result.path), term: result.term ? JSON.stringify(result.term) : null },
    });
  };

  const handleStepSubmit = () => {
    if (steps.length === 0) return;
    const result = engine.calculateFromSteps(steps);
    router.push({
      pathname: '/result',
      params: { path: JSON.stringify(result.path), term: result.term ? JSON.stringify(result.term) : null },
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Mode toggle */}
      <View style={styles.modeRow}>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'text' && styles.modeBtnActive]}
          onPress={() => setMode('text')}
        >
          <Text style={[styles.modeBtnText, mode === 'text' && styles.modeBtnTextActive]}>
            {t('input_text_mode')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'select' && styles.modeBtnActive]}
          onPress={() => setMode('select')}
        >
          <Text style={[styles.modeBtnText, mode === 'select' && styles.modeBtnTextActive]}>
            {t('input_select_mode')}
          </Text>
        </TouchableOpacity>
      </View>

      {mode === 'text' ? (
        <PathTextInput onSubmit={handleTextSubmit} />
      ) : (
        <View>
          <StepSelector
            steps={steps}
            onAdd={(rel) => setSteps([...steps, rel])}
            onRemove={(i) => setSteps(steps.filter((_, idx) => idx !== i))}
            onClear={() => setSteps([])}
          />
          <TouchableOpacity
            style={[styles.submitBtn, steps.length === 0 && styles.submitBtnDisabled]}
            onPress={handleStepSubmit}
            disabled={steps.length === 0}
          >
            <Text style={styles.submitBtnText}>{t('btn_calculate')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  content: { padding: 16 },
  modeRow: { flexDirection: 'row', marginBottom: 20, gap: 8 },
  modeBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 10,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd',
    alignItems: 'center',
  },
  modeBtnActive: { backgroundColor: '#c41e3a', borderColor: '#c41e3a' },
  modeBtnText: { fontSize: 15, color: '#666' },
  modeBtnTextActive: { color: '#fff' },
  submitBtn: {
    backgroundColor: '#c41e3a', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center', marginTop: 12,
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
});
```

- [ ] **Step 2: Commit**

```bash
cd c:/Users/75815/kinship-calculator
git add -A && git commit -m "feat: implement calculate screen with dual input modes"
```

---

### Task 12: UI — Lookup Screen (Reverse Lookup)

**Files:**
- Modify: `app/(tabs)/lookup.tsx`

- [ ] **Step 1: Write the lookup screen**

Replace `app/(tabs)/lookup.tsx`:

```tsx
import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '../../src/i18n/LanguageContext';
import { createKinshipEngine } from '../../src/engine';
import { KinshipTerm } from '../../src/engine/types';

const engine = createKinshipEngine();

const CATEGORIES = [
  { key: 'all', labelZh: '全部', labelEn: 'All' },
  { key: 'direct', labelZh: '直系', labelEn: 'Direct' },
  { key: 'paternal', labelZh: '父系', labelEn: 'Paternal' },
  { key: 'maternal', labelZh: '母系', labelEn: 'Maternal' },
  { key: 'affinal', labelZh: '姻亲', labelEn: 'Affinal' },
  { key: 'senior', labelZh: '长辈', labelEn: 'Senior' },
  { key: 'same_gen', labelZh: '同辈', labelEn: 'Same Gen' },
  { key: 'junior', labelZh: '晚辈', labelEn: 'Junior' },
  { key: 'special', labelZh: '特殊', labelEn: 'Special' },
];

export default function LookupScreen() {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const results = useMemo(() => {
    if (search.trim()) {
      return engine.lookupByTerm(search);
    }
    if (category === 'all') {
      return engine.getAllTerms();
    }
    return engine.lookupByTerm('').filter(term => term.tags.includes(category));
  }, [search, category]);

  const handleTermPress = (term: KinshipTerm) => {
    router.push({
      pathname: '/result',
      params: {
        term: JSON.stringify(term),
        path: JSON.stringify(term.paths[0] || []),
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <TextInput
        style={styles.searchInput}
        value={search}
        onChangeText={(t) => { setSearch(t); setCategory('all'); }}
        placeholder={t('search_placeholder')}
        placeholderTextColor="#aaa"
      />

      {/* Category filter (hidden when searching) */}
      {!search.trim() && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.key}
              style={[styles.catBtn, category === cat.key && styles.catBtnActive]}
              onPress={() => setCategory(cat.key)}
            >
              <Text style={[styles.catBtnText, category === cat.key && styles.catBtnTextActive]}>
                {lang === 'zh' ? cat.labelZh : cat.labelEn}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Results */}
      <ScrollView style={styles.results}>
        {results.map((term, i) => (
          <TouchableOpacity key={`${term.term}-${i}`} style={styles.termItem} onPress={() => handleTermPress(term)}>
            <Text style={styles.termText}>{term.term}</Text>
            <View style={styles.termInfo}>
              <Text style={styles.termPinyin}>{term.pinyin}</Text>
              <Text style={styles.termBrief}>
                {lang === 'zh'
                  ? term.explanationZh.slice(0, 40)
                  : term.explanationEn.slice(0, 60)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
        {results.length === 0 && (
          <Text style={styles.empty}>未找到匹配的称谓</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  searchInput: {
    margin: 16, marginBottom: 8,
    borderWidth: 1, borderColor: '#ddd', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 12, fontSize: 16,
    backgroundColor: '#fff',
  },
  categories: { paddingHorizontal: 16, marginBottom: 8, maxHeight: 44 },
  catBtn: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee',
    marginRight: 8,
  },
  catBtnActive: { backgroundColor: '#c41e3a', borderColor: '#c41e3a' },
  catBtnText: { fontSize: 13, color: '#666' },
  catBtnTextActive: { color: '#fff' },
  results: { flex: 1, paddingHorizontal: 16 },
  termItem: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    marginBottom: 8, flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  termText: { fontSize: 20, fontWeight: 'bold', color: '#c41e3a', width: 70 },
  termInfo: { flex: 1, marginLeft: 12 },
  termPinyin: { fontSize: 13, color: '#888' },
  termBrief: { fontSize: 13, color: '#666', marginTop: 2 },
  empty: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 15 },
});
```

- [ ] **Step 2: Commit**

```bash
cd c:/Users/75815/kinship-calculator
git add -A && git commit -m "feat: implement lookup screen with search and category filters"
```

---

### Task 13: UI — Result Screen

**Files:**
- Modify: `app/result.tsx`

- [ ] **Step 1: Write the result screen**

Replace `app/result.tsx`:

```tsx
import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useLanguage } from '../src/i18n/LanguageContext';
import { TermCard } from '../src/components/TermCard';
import { FamilyTreeView } from '../src/components/FamilyTreeView';
import { KinshipTerm, BasicRelation } from '../src/engine/types';
import { createKinshipEngine } from '../src/engine';

const engine = createKinshipEngine();

export default function ResultScreen() {
  const { t } = useLanguage();
  const params = useLocalSearchParams<{ term: string; path: string }>();

  const term: KinshipTerm | null = useMemo(() => {
    if (!params.term || params.term === 'null') return null;
    try { return JSON.parse(params.term); } catch { return null; }
  }, [params.term]);

  const path: BasicRelation[] = useMemo(() => {
    if (!params.path) return [];
    try { return JSON.parse(params.path); } catch { return []; }
  }, [params.path]);

  const pathDisplay = useMemo(() => {
    return path.map(r => engine.getBasicRelations().find(b => b.key === r)?.labelZh ?? r).join(' 的 ');
  }, [path]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {term ? (
        <>
          <TermCard term={term} />

          {/* Relationship path */}
          {path.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('result_path')}</Text>
              <View style={styles.pathBox}>
                <Text style={styles.pathLabel}>我</Text>
                {path.map((step, i) => (
                  <Text key={i} style={styles.pathStep}>
                    {' 的 '}{engine.getBasicRelations().find(b => b.key === step)?.labelZh ?? step}
                  </Text>
                ))}
              </View>
              <Text style={styles.pathResult}>
                = {term.term}
              </Text>
            </View>
          )}

          {/* Family tree */}
          {path.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('result_tree')}</Text>
              <FamilyTreeView path={path} />
            </View>
          )}
        </>
      ) : (
        <View style={styles.noResult}>
          <Text style={styles.noResultText}>{t('result_no_match')}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  content: { padding: 16, paddingBottom: 40 },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 17, fontWeight: '600', color: '#333', marginBottom: 10 },
  pathBox: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center',
  },
  pathLabel: { fontSize: 16, color: '#333' },
  pathStep: { fontSize: 16, color: '#c41e3a' },
  pathResult: { fontSize: 18, fontWeight: 'bold', color: '#c41e3a', marginTop: 12, textAlign: 'center' },
  noResult: { alignItems: 'center', paddingTop: 60 },
  noResultText: { fontSize: 16, color: '#999' },
});
```

- [ ] **Step 2: Commit**

```bash
cd c:/Users/75815/kinship-calculator
git add -A && git commit -m "feat: implement result screen with term card, path, and family tree"
```

---

### Task 14: UI — Settings Screen

**Files:**
- Modify: `app/(tabs)/settings.tsx`

- [ ] **Step 1: Write the settings screen**

Replace `app/(tabs)/settings.tsx`:

```tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useLanguage } from '../../src/i18n/LanguageContext';
import { Language } from '../../src/i18n/translations';

export default function SettingsScreen() {
  const { lang, setLang, t } = useLanguage();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Language switcher */}
      <Text style={styles.sectionTitle}>{t('lang_switch')}</Text>
      <View style={styles.langRow}>
        <TouchableOpacity
          style={[styles.langBtn, lang === 'zh' && styles.langBtnActive]}
          onPress={() => setLang('zh')}
        >
          <Text style={[styles.langBtnText, lang === 'zh' && styles.langBtnTextActive]}>中文</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.langBtn, lang === 'en' && styles.langBtnActive]}
          onPress={() => setLang('en')}
        >
          <Text style={[styles.langBtnText, lang === 'en' && styles.langBtnTextActive]}>English</Text>
        </TouchableOpacity>
      </View>

      {/* About */}
      <Text style={styles.sectionTitle}>{t('about_title')}</Text>
      <View style={styles.aboutBox}>
        <Text style={styles.aboutText}>{t('about_text')}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  content: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 12, marginTop: 8 },
  langRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  langBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 12,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd',
    alignItems: 'center',
  },
  langBtnActive: { backgroundColor: '#c41e3a', borderColor: '#c41e3a' },
  langBtnText: { fontSize: 16, color: '#666' },
  langBtnTextActive: { color: '#fff', fontWeight: '600' },
  aboutBox: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  aboutText: { fontSize: 14, color: '#666', lineHeight: 22 },
});
```

- [ ] **Step 2: Commit**

```bash
cd c:/Users/75815/kinship-calculator
git add -A && git commit -m "feat: implement settings screen with language switcher"
```

---

### Task 15: Final Integration & Polish

**Files:**
- Modify: `app/(tabs)/_layout.tsx` (add proper tab icons with emoji)
- Check: all files compile and app runs

- [ ] **Step 1: Add tab icons with emoji text**

Read the current `app/(tabs)/_layout.tsx`, then edit it to add emoji icons:

```tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#c41e3a',
      tabBarInactiveTintColor: '#999',
      headerStyle: { backgroundColor: '#fff' },
      headerTitleStyle: { color: '#333' },
    }}>
      <Tabs.Screen
        name="calculate"
        options={{
          title: '计算',
          tabBarIcon: ({ color }) => <TabIcon label="🧮" />,
        }}
      />
      <Tabs.Screen
        name="lookup"
        options={{
          title: '查询',
          tabBarIcon: ({ color }) => <TabIcon label="🔍" />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '设置',
          tabBarIcon: ({ color }) => <TabIcon label="⚙️" />,
        }}
      />
    </Tabs>
  );
}

function TabIcon({ label }: { label: string }) {
  const { Text } = require('react-native');
  return <Text style={{ fontSize: 22 }}>{label}</Text>;
}
```

- [ ] **Step 2: Verify TypeScript compilation**

```bash
cd c:/Users/75815/kinship-calculator && npx tsc --noEmit 2>&1 | head -50
```

Expected: No errors, or only minor fixable issues.

- [ ] **Step 3: Verify app starts**

```bash
cd c:/Users/75815/kinship-calculator && npx expo start --web --no-open &
sleep 10
curl -s http://localhost:8081 2>&1 | head -5
```

Expected: Metro bundler runs without fatal errors.

- [ ] **Step 4: Commit**

```bash
cd c:/Users/75815/kinship-calculator
git add -A && git commit -m "feat: final integration, tab icons, and polish"
```
