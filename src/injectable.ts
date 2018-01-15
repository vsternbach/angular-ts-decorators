import { defineMetadata, getMetadata, metadataKeys } from './utils';
import { Provider } from './provider';
import { IModule } from 'angular';

export function Injectable(name?: string) {
  return (Class: any) => {
    if (name) {
      defineMetadata(metadataKeys.name, name, Class);
    }
  };
}

/** @internal */
export function registerProviders(module: IModule, providers: Provider[]) {
  providers.forEach((provider: any) => {
    // providers registered using { provide, useClass/useFactory/useValue } syntax
    if (provider.provide) {
      const name = provider.provide;
      if (provider.useClass && provider.useClass instanceof Function) {
        module.service(name, provider.useClass);
      }
      else if (provider.useFactory && provider.useFactory instanceof Function) {
        provider.useFactory.$inject = provider.deps || provider.useFactory.$inject;
        module.factory(name, provider.useFactory);
      }
      else if (provider.useValue) {
        module.constant(name, provider.useValue);
      }
    }
    // providers registered as classes
    else {
      const name = getMetadata(metadataKeys.name, provider);
      if (!name) {
        console.error(`${provider.name} was not registered as angular service:
        Provide explicit name in @Injectable when using class syntax or register it using object provider syntax:
        { provide: '${provider.name}', useClass: ${provider.name} }`);
      } else {
        module.service(name, provider);
      }
    }
  });
}
