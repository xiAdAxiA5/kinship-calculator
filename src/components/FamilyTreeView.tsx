import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Line, Rect, Text as SvgText } from 'react-native-svg';
import { BasicRelation } from '../engine/types';
import { useLanguage } from '../i18n/LanguageContext';

interface TreePerson {
  id: string;
  label: string;
  level: number;
  isTarget: boolean;
  isEgo: boolean;
}

interface Props {
  path: BasicRelation[];
  targetName?: string; // added for named relatives feature
}

const NODE_W = 64;
const NODE_H = 28;
const LEVEL_H = 72;
const SVG_W = 320;

export function FamilyTreeView({ path, targetName }: Props) {
  const { lang } = useLanguage();

  if (path.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {lang === 'zh' ? '没有关系路径可显示' : 'No path to display'}
        </Text>
      </View>
    );
  }

  const nodes: TreePerson[] = [
    { id: 'ego', label: lang === 'zh' ? '我' : 'Me', level: 0, isTarget: false, isEgo: true },
  ];

  let currentLevel = 0;
  for (let i = 0; i < path.length; i++) {
    const step = path[i];
    if (step === 'father' || step === 'mother') currentLevel += 1;
    else if (step === 'son' || step === 'daughter') currentLevel -= 1;

    const isTarget = i === path.length - 1;
    let label = '';
    if (isTarget && targetName) {
      label = targetName;
    } else {
      label = lang === 'zh' ? getLabelZh(step) : getLabelEn(step);
    }

    nodes.push({
      id: `step-${i}`,
      label,
      level: currentLevel,
      isTarget,
      isEgo: false,
    });
  }

  const minLevel = Math.min(...nodes.map(n => n.level));
  const maxLevel = Math.max(...nodes.map(n => n.level));
  const svgH = (maxLevel - minLevel + 1) * LEVEL_H + 20;

  const centerX = SVG_W / 2;

  return (
    <View style={styles.container}>
      <Svg width={SVG_W} height={svgH} viewBox={`0 0 ${SVG_W} ${svgH}`}>
        {nodes.slice(1).map((node, i) => {
          const prev = nodes[i];
          const x1 = centerX;
          const y1 = (maxLevel - prev.level) * LEVEL_H + NODE_H + 4;
          const x2 = centerX;
          const y2 = (maxLevel - node.level) * LEVEL_H;
          return (
            <Line
              key={`line-${i}`}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#d4d4d4" strokeWidth={2}
            />
          );
        })}

        {nodes.map((node, i) => {
          const x = centerX - NODE_W / 2;
          const y = (maxLevel - node.level) * LEVEL_H;
          let fill = '#666';
          if (node.isEgo) fill = '#333';
          if (node.isTarget) fill = '#c41e3a';

          return (
            <React.Fragment key={node.id}>
              <Rect x={x} y={y} width={NODE_W} height={NODE_H} rx={8} fill={fill} />
              <SvgText
                x={x + NODE_W / 2}
                y={y + NODE_H / 2 + 5}
                fill="#fff"
                fontSize={11}
                fontWeight={node.isTarget ? 'bold' : 'normal'}
                textAnchor="middle"
              >
                {node.label.length > 5 ? node.label.slice(0, 5) + '..' : node.label}
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
  emptyContainer: { padding: 20, alignItems: 'center' },
  emptyText: { color: '#999', fontSize: 14 },
});
