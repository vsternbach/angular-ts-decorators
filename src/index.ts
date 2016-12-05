import * as angular from 'angular';
import 'reflect-metadata';

export interface IFunctionInjectable extends Function {
  name: string;
  $inject?: Array<string>;
}

export interface IModuleDecorated extends Function {
  new(...args: Array<any>): IModuleStatic;
}

export interface IModuleStatic {
  module: ng.IModule;
}

const typeSymbol = 'custom:type';
const nameSymbol = 'custom:name';
const bindingsSymbol = 'custom:bindings';
const optionsSymbol = 'custom:options';

export interface IComponentOptionsDecorated {
  selector: string;
  template?: string | ng.Injectable<(...args: Array<any>) => string>;
  templateUrl?: string | ng.Injectable<(...args: Array<any>) => string>;
  transclude?: boolean | {[slot: string]: string};
  require?: {[controller: string]: string};
}

export interface IPipeTransform {
  transform(...args: Array<any>): any;
}

export interface IModuleConfig {
  declarations: Array<any>;
  imports?: Array<string | Function>;
  exports?: Array<Function>;
  providers?: Array<Function>;
}

export function NgModule(config: IModuleConfig) {
  return (Class: IFunctionInjectable) => {
    // module registration
    const imports = config.imports ? config.imports.map(mod => typeof mod === 'string' ? mod : mod.name) : [];
    const module = angular.module(Class.name, imports);
    // components registration
    const components = config.declarations.filter(declaration => getDeclarationType(declaration) === 'component');
    components.forEach(component => {
      const {name, options} = getComponentMetadata(component);
      module.component(name, options);
    });
    // filters registration
    const filters = config.declarations.filter(declaration => getDeclarationType(declaration) === 'filter');
    filters.forEach(filter => {
      const {name} = getNameMetadata(filter);
      function transformFunc<T>(ctor: any): Function {
        const instance = new ctor();
        return instance.transform.bind(instance);
      }
      const filterFunc = () => transformFunc(filter);
      filterFunc.$inject = annotate(filter);
      module.filter(name, filterFunc);
    });
    // services registration
    const services = config.providers;
    if (services) {
      services.forEach(service => {
        const {name} = getNameMetadata(service);
        service.$inject = annotate(service);
        module.service(name, [service]);
      });
    }
    // expose angular module as static property
    (<any>Class).module = module;
  };
}

export function Component(decoratedOptions: IComponentOptionsDecorated) {
  return (ctrl: ng.IControllerConstructor) => {
    const options: ng.IComponentOptions = Object.assign({}, decoratedOptions);
    options.controller = ctrl;
    const bindings = Reflect.getMetadata(bindingsSymbol, ctrl);
    if (bindings) {
      options.bindings = bindings;
    }
    Reflect.defineMetadata(nameSymbol, decoratedOptions.selector, ctrl);
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
  return (Class: IFunctionInjectable) => {
    name = name || Class.name;
    Reflect.defineMetadata(nameSymbol, name, Class);
  };
}

export function Pipe(options: {name: string}) {
  return (Class: IFunctionInjectable) => {
    Reflect.defineMetadata(nameSymbol, options.name, Class);
    Reflect.defineMetadata(typeSymbol, 'filter', Class);
  };
}

function getComponentMetadata(component: ng.IComponentController) {
  return {
    name: Reflect.getMetadata(nameSymbol, component),
    options: Reflect.getMetadata(optionsSymbol, component)
  };
}

function getNameMetadata(service: Function) {
  return {
    name: Reflect.getMetadata(nameSymbol, service)
  };
}

function getDeclarationType(declaration: Function) {
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
