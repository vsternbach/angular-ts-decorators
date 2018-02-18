import { defineMetadata, getMetadata, metadataKeys } from './utils';
import { Type } from './type';

/** @internal */
export interface IQueries {
  [property: string]: {
    first: boolean;
    selector: string;
  }
}

export function ViewChild(selector: string): any {
  return (target: any, key: string) => addBindingToMetadata(target, key, selector, true);
}

export function ViewChildren(selector: string): any {
  return (target: any, key: string) => addBindingToMetadata(target, key, selector, false);
}

/** @internal */
function addBindingToMetadata(target: any, key: string, selector: string, first: boolean) {
  const targetConstructor = target.constructor;
  const queries: IQueries = getMetadata(metadataKeys.queries, targetConstructor) || {};
  queries[key] = {
    first,
    selector
  };
  defineMetadata(metadataKeys.queries, queries, targetConstructor);
}
