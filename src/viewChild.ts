import {
  defineMetadata, getMetadata, metadataKeys, camelToKebab, getTypeName
} from './utils';
import { Type } from './type';

/** @internal */
export interface IViewChildren {
  [property: string]: {
    first: boolean;
    selector: any;
  }
}

export function ViewChild(selector: any): any {
  return (target: any, key: string) => addBindingToMetadata(target, key, selector, true);
}

export function ViewChildren(selector: any): any {
  return (target: any, key: string) => addBindingToMetadata(target, key, selector, false);
}

/** @internal */
function addBindingToMetadata(target: any, key: string, type: any, first: boolean) {
  const targetConstructor = target.constructor;
  const selector = camelToKebab(getTypeName(type));
  const children: IViewChildren = getMetadata(metadataKeys.viewChildren, targetConstructor) || {};
  children[key] = {
    first,
    selector: selector
  };
  defineMetadata(metadataKeys.viewChildren, children, targetConstructor);
}
