import * as angular from 'angular';
import { PipeTransform, registerPipe } from './pipe';
import { registerProviders } from './injectable';
import { camelToKebab, Declaration, getMetadata, getTypeName, metadataKeys, injectionsKey, defineMetadata } from './utils';
import { registerComponent } from './component';
import { registerDirective } from './directive';
import { Provider } from './provider';
import { IComponentController, IDirectiveFactory, IModule, Injectable } from 'angular';

export interface ModuleConfig {
  id?: string;
  declarations?: Array<IComponentController | Injectable<IDirectiveFactory> | PipeTransform>;
  imports?: Array<string | NgModule>;
  exports?: Function[];
  providers?: Provider[];
  bootstrap?: IComponentController[];
}

export interface NgModule {
  module?: IModule;
  config?(...args: any[]): any;
  run?(...args: any[]): any;
  [p: string]: any;
}

const addMethod = (target, propertyKey, metaKey) => {
  const method = target[propertyKey];
  const injections = getMetadata(injectionsKey(propertyKey), target) || [];
  const runMethods = getMetadata(metaKey, target) || [];
  runMethods.push([...injections, method]);
  defineMetadata(metaKey, runMethods, target);
};

export function Run() {
  return (target: any, propertyKey: string) => addMethod(target, propertyKey, metadataKeys.run);
}

export function Config() {
  return (target: any, propertyKey: string) => addMethod(target, propertyKey, metadataKeys.config);
}

export function NgModule({ id, bootstrap = [], declarations = [], imports = [], providers = [] }: ModuleConfig) {
  return (Class: NgModule) => {
    // module registration
    const deps = imports.map(mod => typeof mod === 'string' ? mod : mod.module.name);
    if (!id) {
      console.warn('You are not providing ngModule id, be careful this code won\'t work when uglified.');
      id = (Class as any).name;
    }
    const module = angular.module(id, deps);

    // components, directives and filters registration
    declarations.forEach((declaration: any) => {
      const declarationType = getMetadata(metadataKeys.declaration, declaration);
      switch (declarationType) {
        case Declaration.Component:
          registerComponent(module, declaration);
          break;
        case Declaration.Directive:
          registerDirective(module, declaration);
          break;
        case Declaration.Pipe:
          registerPipe(module, declaration);
          break;
        default:
          console.error(
            `Can't find type metadata on ${declaration.name} declaration, did you forget to decorate it?
            Decorate your declarations using @Component, @Directive or @Pipe decorator.`
          );
      }
    });

    // services registration
    if (providers) {
      registerProviders(module, providers);
    }

    const runMethods = getMetadata(metadataKeys.run, Class.prototype);
    if (runMethods) {
      runMethods.forEach((r) => { module.run(r); });
    }
    const configMethods = getMetadata(metadataKeys.config, Class.prototype);
    if (configMethods) {
      configMethods.forEach((c) => { module.config(c); });
    }

    // Backwards compatible ...
    // config and run blocks registration
    const { config, run } = Class;
    if (config) {
      module.config(config);
    }
    if (run) {
      module.run(run);
    }

    // expose angular module as static property
    Class.module = module;
  };
}
