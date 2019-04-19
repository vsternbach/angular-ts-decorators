import { defineMetadata, getMetadata, metadataKeys } from './utils';
import * as angular from 'angular';

/** @internal */
export interface IHostListeners {
  [handler: string]: {
    eventName: string;
    args: string[];
  };
}

export function HostListener(eventName?: string, args?: string[]) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const listener = descriptor.value;

    if (typeof listener !== 'function') {
      throw new Error(`@HostListener decorator can only be applied to methods not: ${typeof listener}`);
    }

    const targetConstructor = target.constructor;
    /**
     * listeners = { onMouseEnter: { eventName: 'mouseenter mouseover', args: [] } }
     */
    const listeners: IHostListeners  = angular.extend({}, getMetadata(metadataKeys.listeners, targetConstructor) || {});
    listeners[propertyKey] = { eventName, args };
    defineMetadata(metadataKeys.listeners, listeners, targetConstructor);
  };
}
