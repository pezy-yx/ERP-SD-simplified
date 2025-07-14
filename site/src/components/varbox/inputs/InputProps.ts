import { defineProps, PropType } from 'vue';
import { VarNode, VarTree } from '@/utils/VarTree';

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
    type: Object as PropType<VarTree>,
    default: null
  },
  nodePath: {
    type: Array as PropType<string[]>,
    default: () => []
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
  },
  'focus': () => {
    return true;
  },
  'enter-from-node': (node: VarNode, value: string, data: any) => {
    return node instanceof VarNode && typeof value === 'string';
  },
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
  'enter-from-node': (node: VarNode, value: string, data: any) => {
    return node instanceof VarNode && typeof value === 'string';
  },
};
export const SimpleInputBoxEmitsWithBool = {
  'update:modelValue': (value: boolean): boolean => {
    return typeof value === 'boolean';
  },
  'blur': (value: string): boolean => {
    return typeof value === 'string';
  },
  'enter': (value: string): boolean => {
    return typeof value === 'string';
  },
  'validation-error': (message: string): boolean => {
    return typeof message === 'string' && message.length > 0;
  },
  'enter-from-node': (node: VarNode, value: string, data: any) => {
    return node instanceof VarNode && typeof value === 'string';
  },
};
