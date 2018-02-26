import { defineMetadata, getMetadata, metadataKeys } from './utils';

export function Input(alias?: string) {
  return (target: any, key: string) => addBindingToMetadata(target, key, '<', alias);
}

export function Output(alias?: string) {
  return (target: any, key: string) => addBindingToMetadata(target, key, '&', alias);
}

export function ViewParent(controller: string) {
  return (target: any, key: string) => addRequireToMetadata(target, key, controller);
}

/** @internal */
function addBindingToMetadata(target: any, key: string, direction: string, alias?: string) {
  const targetConstructor = target.constructor;
  const bindings = getMetadata(metadataKeys.bindings, targetConstructor) || {};
  bindings[key] = alias || direction;
  defineMetadata(metadataKeys.bindings, bindings, targetConstructor);
}

/** @internal */
function addRequireToMetadata(target: any, key: string, controller: string) {
  const targetConstructor = target.constructor;
  const require = getMetadata(metadataKeys.require, targetConstructor) || {};
  require[key] = controller;
  defineMetadata(metadataKeys.require, require, targetConstructor);
}
