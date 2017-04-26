import { defineMetadata, getMetadata, metadataKeys } from './utils';

export function Input(alias?: string) {
  return (target: object, key: string) => addBindingToMetadata(target, key, '<', alias);
}

export function Output(alias?: string) {
  return (target: object, key: string) => addBindingToMetadata(target, key, '&', alias);
}

/** @internal */
function addBindingToMetadata(target: object, key: string, direction: string, alias?: string) {
  const targetConstructor = target.constructor;
  const bindings = getMetadata(metadataKeys.bindings, targetConstructor) || {};
  bindings[key] = alias || direction;
  defineMetadata(metadataKeys.bindings, bindings, targetConstructor);
}
