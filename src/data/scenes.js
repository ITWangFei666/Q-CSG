/**
 * 虚拟场景注册表
 * 把 sceneId 映射到具体场景数据，供 StepFlow 的 `scene-action` step 类型查询
 *
 * 结构：
 *   { width, height, title, backgroundDesc, elements, sequence, errorRules }
 *
 * 添加新场景：往这里加一个 entry 即可，sceneData 里只放原始数据。
 */

import { SCENE_ELEMENTS, OPERATION_SEQUENCE, ERROR_RULES } from './sceneData'

export const SCENE_REGISTRY = {
  transmission_line_10kv: {
    width: 800,
    height: 500,
    title: '10kV 城南线 #16 杆 — 检修作业',
    backgroundDesc: '同杆架设了一条 10kV 城北线（带电运行）',
    elements: SCENE_ELEMENTS,
    sequence: OPERATION_SEQUENCE,
    errorRules: ERROR_RULES,
  },
}

/** 类型 → 图标（hotspot 内显示） */
export const ELEMENT_ICONS = {
  breaker: '⚡',
  isolator: '🔌',
  tool: '🔍',
  ground: '🪝',
  sign: '⚠️',
  barrier: '🚧',
}
