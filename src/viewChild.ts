import {
  defineMetadata, getMetadata, metadataKeys, camelToKebab, getTypeName
} from './utils';
import { Type } from './type';

/** @internal */
export interface IViewChildren {
  [property: string]: {
    first: boolean;
    selector: any;
  };
}

export function ViewChild(selector: Type<any>|Function|string, opts?: {read?: any}): any {
  return (target: any, key: string) => addBindingToMetadata(target, key, selector, true);
}

export function ViewChildren(selector: Type<any>|Function|string, opts?: {read?: any}): any {
  return (target: any, key: string) => addBindingToMetadata(target, key, selector, false);
}

/** @internal */
function addBindingToMetadata(target: any, key: string, selector: Type<any>|Function|string, first: boolean) {
  const targetConstructor = target.constructor;
  const viewChildren: IViewChildren = getMetadata(metadataKeys.viewChildren, targetConstructor) || {};
  viewChildren[key] = { first, selector };
  defineMetadata(metadataKeys.viewChildren, viewChildren, targetConstructor);
}
