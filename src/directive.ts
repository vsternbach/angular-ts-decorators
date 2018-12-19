import {
  Declaration, defineMetadata, getAttributeName, getMetadata, isAttributeSelector, kebabToCamel,
  metadataKeys, tryGetDirectiveSelector
} from './utils';
import { IHostListeners } from './hostListener';
import { IViewChildren } from './viewChild';
import { extendWithHostListenersAndChildren, replaceLifecycleHooks } from './component';
import { IController, IDirective, IModule } from 'angular';

export interface DirectiveOptionsDecorated extends IDirective {
  selector: string;
}

export interface DirectiveControllerConstructor {
  new (...args: any[]): IController;
}

export function Directive({selector, ...options}: DirectiveOptionsDecorated) {
  return (ctrl: DirectiveControllerConstructor) => {
    const bindings = getMetadata(metadataKeys.bindings, ctrl);
    if (bindings) {
      options.bindToController = bindings;
    }
    const require = getMetadata(metadataKeys.require, ctrl);
    if (require) {
      options.require = require;
      if (!options.bindToController) options.bindToController = true;
    }

    const selectorTyped = tryGetDirectiveSelector(selector);
    const selectorName = selectorTyped.selector || selector;
    options.restrict = options.restrict || selectorTyped.restrict || 'A';
    defineMetadata(metadataKeys.name, kebabToCamel(selectorName), ctrl);
    defineMetadata(metadataKeys.declaration, Declaration.Directive, ctrl);
    defineMetadata(metadataKeys.options, options, ctrl);
  };
}

/** @internal */
export function registerDirective(module: IModule, ctrl: DirectiveControllerConstructor) {
  let directiveFunc;
  const name = getMetadata(metadataKeys.name, ctrl);
  const options = getMetadata(metadataKeys.options, ctrl);
  replaceLifecycleHooks(ctrl);
  const listeners: IHostListeners = getMetadata(metadataKeys.listeners, ctrl);
  const viewChildren: IViewChildren = getMetadata(metadataKeys.viewChildren, ctrl);
  options.controller = listeners || viewChildren ?
    extendWithHostListenersAndChildren(ctrl, listeners, viewChildren) : ctrl;
  directiveFunc = () => options;
  module.directive(name, directiveFunc);
}
