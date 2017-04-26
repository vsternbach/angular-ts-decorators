import * as angular from 'angular';
import 'reflect-metadata';

/** @internal */
export enum Declarations { component, directive, pipe }

/** @internal */
export const metadataKeys = {
  declaration: 'custom:declaration',
  name: 'custom:name',
  bindings: 'custom:bindings',
  options: 'custom:options',
};

/** @internal */
export function annotate(func: any) {
  return angular.injector().annotate(func);
}

/** @internal */
export function kebabToCamel(input: string) {
  return input.replace(/(-\w)/g, (m) => m[1].toUpperCase());
}

/** @internal */
export function getAttributeName(selector: string) {
  return selector.substr(1, selector.length - 2);
}

/** @internal */
export function isAttributeSelector(selector: string) {
  return /^[\[].*[\]]$/g.test(selector);
}

/** @internal */
export function getMetadata(metadataKey: any, target: object): any {
  return Reflect.getMetadata(metadataKey, target);
}

/** @internal */
export function defineMetadata(metadataKey: any, metadataValue: any, target: Object): void {
  Reflect.defineMetadata(metadataKey, metadataValue, target);
}
