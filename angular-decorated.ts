import * as angular from 'angular';
import 'reflect-metadata';

enum Declarations { component, filter }

const typeSymbol = 'custom:type';
const nameSymbol = 'custom:name';
const bindingsSymbol = 'custom:bindings';
const optionsSymbol = 'custom:options';

/**
 * Interfaces
 */
// declare global {
//   interface Function {
//     $inject?: string[];
//   }
// }

export interface ModuleConfig {
  declarations: Array<ng.IComponentController | PipeTransform>;
  imports?: Array<string | Function>;
  exports?: Array<Function>;
  providers?: Array<ng.IServiceProvider | ng.Injectable<Function>>;
}

export interface ModuleDecoratedConstructor {
  new(...args: Array<any>): ModuleDecorated;
  module?: ng.IModule;
}

export interface ModuleDecorated {
  config?(...args: Array<any>): void;
  run?(...args: Array<any>): void;
}

export interface ComponentOptionsDecorated {
  selector: string;
  template?: string | ng.Injectable<(...args: Array<any>) => string>;
  templateUrl?: string | ng.Injectable<(...args: Array<any>) => string>;
  transclude?: boolean | {[slot: string]: string};
  require?: {[controller: string]: string};
}

export interface PipeTransformConstructor {
  new(...args: Array<any>): PipeTransform;
}

export interface PipeTransform {
  transform(...args: Array<any>): any;
}

/**
 * Decorators
 */
export function NgModule({ declarations, imports, providers }: ModuleConfig) {
  return (Class: ModuleDecoratedConstructor) => {
    // module registration
    const deps = imports ? imports.map(mod => typeof mod === 'string' ? mod : mod.name) : [];
    const module = angular.module(Class.name, deps);

    // components, directives and filters registration
    declarations.forEach((declaration: any) => {
      const declarationType = getDeclarationType(declaration);
      switch (declarationType) {
        case Declarations.component:
          registerComponent(module, declaration);
          break;
        case Declarations.filter:
          registerFilter(module, declaration);
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
      registerServices(module, providers);
    }
    // config and run blocks registration
    const { config, run } = Class.prototype;
    if (config) {
      config.$inject = annotate(config);
      module.config(config);
    }
    if (run) {
      run.$inject = annotate(run);
      module.run(run);
    }
    // expose angular module as static property
    Class.module = module;
  };
}

export function Component(decoratedOptions: ComponentOptionsDecorated) {
  return (ctrl: ng.IControllerConstructor) => {
    const options: ng.IComponentOptions = Object.assign({}, decoratedOptions);
    options.controller = ctrl;
    const bindings = Reflect.getMetadata(bindingsSymbol, ctrl);
    if (bindings) {
      options.bindings = bindings;
    }
    Reflect.defineMetadata(nameSymbol, decoratedOptions.selector, ctrl);
    Reflect.defineMetadata(typeSymbol, Declarations.component, ctrl);
    Reflect.defineMetadata(optionsSymbol, options, ctrl);
  };
}

export function Input(alias?: string) {
  return (target: Object, key: string) => addBindingToMetadata(target, key, '<', alias);
}

export function Output(alias?: string) {
  return (target: Object, key: string) => addBindingToMetadata(target, key, '&', alias);
}

export function Injectable(name?: string) {
  return (Class: any) => {
    name = name || Class.name;
    Reflect.defineMetadata(nameSymbol, name, Class);
  };
}

export function Pipe(options: {name: string}) {
  return (Class: PipeTransformConstructor) => {
    Reflect.defineMetadata(nameSymbol, options.name, Class);
    Reflect.defineMetadata(typeSymbol, Declarations.filter, Class);
  };
}

/**
 * Private functions
 */
function registerComponent(module: ng.IModule, component: ng.IComponentController) {
  const {name, options} = getComponentMetadata(component);
  module.component(name, options);
}

function registerFilter(module: ng.IModule, filter: PipeTransformConstructor) {
  const {name} = getNameMetadata(filter);
  const filterFunc = (...args: Array<any>) => {
    const instance = new filter(args);
    return instance.transform.bind(instance);
  };
  filterFunc.$inject = filter.$inject || annotate(filter);
  module.filter(name, filterFunc);
}

function registerServices(module: ng.IModule, services: Array<ng.IServiceProvider | ng.Injectable<Function>>) {
  services.forEach((service: any) => {
    const {name} = getNameMetadata(service);
    service.$inject = service.$inject || annotate(service);
    const method = service.prototype.$get ? 'provider' : 'service';
    module[method](name, service);
  });
}

function getComponentMetadata(component: ng.IComponentController) {
  return {
    name: Reflect.getMetadata(nameSymbol, component),
    options: Reflect.getMetadata(optionsSymbol, component)
  };
}

function getNameMetadata(service: any) {
  return {
    name: Reflect.getMetadata(nameSymbol, service)
  };
}

function getDeclarationType(declaration: any) {
  return Reflect.getMetadata(typeSymbol, declaration);
}

function addBindingToMetadata(target: Object, key: string, direction: string, alias?: string) {
  const targetConstructor = target.constructor;
  const bindings = Reflect.getMetadata(bindingsSymbol, targetConstructor) || {};
  bindings[key] = alias || direction;
  Reflect.defineMetadata(bindingsSymbol, bindings, targetConstructor);
}

function annotate(func: any) {
  return angular.injector().annotate(func);
}
