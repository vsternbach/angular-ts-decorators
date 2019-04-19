import { ElementRef } from './element_ref';
import { defineMetadata, getMetadata, metadataKeys } from './utils';
import { Type } from './type';
import * as angular from 'angular';

/** @internal */
export interface IViewChildren {
  [property: string]: {
    first: boolean;
    selector: any;
    read?: typeof ElementRef;
  };
}

export function ViewChild(selector: Type<any>|Function|string, opts: {read?: typeof ElementRef} = {}): any {
  return (target: any, key: string) => addBindingToMetadata(target, key, selector, opts.read, true);
}

export function ViewChildren(selector: Type<any>|Function|string, opts: {read?: typeof ElementRef} = {}): any {
  return (target: any, key: string) => addBindingToMetadata(target, key, selector, opts.read, false);
}

/** @internal */
function addBindingToMetadata(target: any,
                              key: string,
                              selector: Type<any>|Function|string,
                              read: typeof ElementRef,
                              first: boolean) {
  const targetConstructor = target.constructor;
  const viewChildren: IViewChildren = angular.extend({},
    getMetadata(metadataKeys.viewChildren, targetConstructor) || {});
  viewChildren[key] = { first, selector, read };
  defineMetadata(metadataKeys.viewChildren, viewChildren, targetConstructor);
}
