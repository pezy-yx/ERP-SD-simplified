import { defineProps, PropType } from 'vue';
import { VarNode, VarTree } from '@/utils/VarTree';

// 类型安全
export interface SimpleInputBoxPropsType {
  modelValue: string | number;
  readonly: boolean;
  placeholder: string;
  config: Record<string, any>;
  node: VarNode | null;
  tree: VarTree | null;
}

export const SimpleInputBoxProps = {
  modelValue: {
    type: String,
    default: ''
  },
  readonly: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: ''
  },
  config: {
    type: Object,
    default: () => ({})
  },
  node: {
    type: Object as PropType<VarNode | null>,
    default: null
  },
  tree: {
    type: Object as PropType<VarTree | null>,
    default: null
  }
};

export const SimpleInputBoxEmits = {
  'update:modelValue': (value: string) => {
    return typeof value === 'string';
  },
  'blur': (value: string) => {
    return typeof value === 'string';
  },
  'enter': (value: string) => {
    return typeof value === 'string';
  },
  'validation-error': (message: string) => {
    return typeof message === 'string' && message.length > 0;
  }
};

export const SimpleInputBoxEmitsWithNum = {
  'update:modelValue': (value: number | string): boolean => {
    return typeof value === 'number' || typeof value === 'string';
  },
  'blur': (value: number | string): boolean => {
    return typeof value === 'number' || typeof value === 'string';
  },
  'enter': (value: number | string): boolean => {
    return typeof value === 'number' || typeof value === 'string';
  },
  'validation-error': (message: string): boolean => {
    return typeof message === 'string' && message.length > 0;
  },
};