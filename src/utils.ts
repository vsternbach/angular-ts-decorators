import 'reflect-metadata';

export enum Declaration { Component = 'Component', Directive = 'Directive', Pipe = 'Pipe' }

export type DirectiveRestriction = 'A' | 'E' | 'C';

/** @internal */
export const knownDirectiveTypes: Record<DirectiveRestriction, RegExp> = {
  A: /^\[([a-z][a-zA-Z\-_]*?)\]$/,
  E: /^([a-z\-]*)$/,
  C: /^\.([a-z][a-zA-Z\-_]*?)$/
};

/** @internal */
export const metadataKeys = {
  declaration: 'custom:declaration',
  name: 'custom:name',
  bindings: 'custom:bindings',
  require: 'custom:require',
  options: 'custom:options',
  listeners: 'custom:listeners',
  viewChildren: 'custom:viewChildren',
};

export function kebabToCamel(input: string) {
  return input.replace(/(-\w)/g, (m) => m[1].toUpperCase());
}

export function camelToKebab(str: string) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
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
export function tryGetDirectiveSelector(selector: string): Partial<{ selector: string, restrict: DirectiveRestriction }> {
  for (const restrictBy of Object.keys(knownDirectiveTypes)) {
    const match = selector.match(knownDirectiveTypes[restrictBy]);
    if (match && match[1]) return { selector: match[1], restrict: restrictBy as DirectiveRestriction };
  }
  return {};
}

/** @internal */
export function getMetadata(metadataKey: any, target: any): any {
  return Reflect.getMetadata(metadataKey, target);
}

/** @internal */
export function defineMetadata(metadataKey: any, metadataValue: any, target: any): void {
  Reflect.defineMetadata(metadataKey, metadataValue, target);
}

export function getTypeName(target: any): string {
  return getMetadata(metadataKeys.name, target);
}

export function getTypeDeclaration(target: any): Declaration {
  return getMetadata(metadataKeys.declaration, target);
}
