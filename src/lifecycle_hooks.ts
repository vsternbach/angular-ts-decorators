/**
 * @internal
 * @desc Mapping between angular and angularjs LifecycleHooks
 */
export const ngLifecycleHooksMap: object = {
  ngOnInit: '$onInit',
  ngOnDestroy: '$onDestroy',
  ngDoCheck: '$doCheck',
  ngOnChanges: '$onChanges',
  ngAfterViewInit: '$postLink'
};

/**
 * Represents a basic change from a previous to a new value.
 * @stable
 */
export declare class SimpleChange<T> implements ng.IChangesObject<T> {
  previousValue: T;
  currentValue: T;
  constructor(previousValue: T, currentValue: T);

  /**
   * Check whether the new value is the first value assigned.
   */
  isFirstChange(): boolean;
}

/**
 * A `changes` object whose keys are property names and
 * values are instances of {@link SimpleChange}. See {@link OnChanges}
 * @stable
 */
export interface SimpleChanges extends ng.IOnChangesObject { [propName: string]: SimpleChange<any>; }

/**
 * @whatItDoes Lifecycle hook that is called when any data-bound property of a directive changes.
 * @howToUse
 * {@example core/ts/metadata/lifecycle_hooks_spec.ts region='OnChanges'}
 *
 * @description
 * `ngOnChanges` is called right after the data-bound properties have been checked and before view
 * and content children are checked if at least one of them has changed.
 * The `changes` parameter contains the changed properties.
 *
 * See {@linkDocs guide/lifecycle-hooks#onchanges "Lifecycle Hooks Guide"}.
 *
 * @stable
 */
export interface OnChanges { ngOnChanges(changes: SimpleChanges): void; }

/**
 * @whatItDoes Lifecycle hook that is called after data-bound properties of a directive are
 * initialized.
 * @howToUse
 * {@example core/ts/metadata/lifecycle_hooks_spec.ts region='OnInit'}
 *
 * @description
 * `ngOnInit` is called right after the directive's data-bound properties have been checked for the
 * first time, and before any of its children have been checked. It is invoked only once when the
 * directive is instantiated.
 *
 * See {@linkDocs guide/lifecycle-hooks "Lifecycle Hooks Guide"}.
 *
 * @stable
 */
export interface OnInit { ngOnInit(): void; }

/**
 * @whatItDoes Lifecycle hook that is called when Angular dirty checks a directive.
 * @howToUse
 * {@example core/ts/metadata/lifecycle_hooks_spec.ts region='DoCheck'}
 *
 * @description
 * `ngDoCheck` gets called to check the changes in the directives in addition to the default
 * algorithm. The default change detection algorithm looks for differences by comparing
 * bound-property values by reference across change detection runs.
 *
 * Note that a directive typically should not use both `DoCheck` and {@link OnChanges} to respond to
 * changes on the same input, as `ngOnChanges` will continue to be called when the default change
 * detector detects changes.
 *
 * See {@link KeyValueDiffers} and {@link IterableDiffers} for implementing custom dirty checking
 * for collections.
 *
 * See {@linkDocs guide/lifecycle-hooks#docheck "Lifecycle Hooks Guide"}.
 *
 * @stable
 */
export interface DoCheck { ngDoCheck(): void; }

/**
 * @whatItDoes Lifecycle hook that is called when a directive, pipe or service is destroyed.
 * @howToUse
 * {@example core/ts/metadata/lifecycle_hooks_spec.ts region='OnDestroy'}
 *
 * @description
 * `ngOnDestroy` callback is typically used for any custom cleanup that needs to occur when the
 * instance is destroyed.
 *
 * See {@linkDocs guide/lifecycle-hooks "Lifecycle Hooks Guide"}.
 *
 * @stable
 */
export interface OnDestroy { ngOnDestroy(): void; }

/**
 * @whatItDoes Lifecycle hook that is called after a component's view has been fully
 * initialized.
 * @howToUse
 * {@example core/ts/metadata/lifecycle_hooks_spec.ts region='AfterViewInit'}
 *
 * @description
 * See {@linkDocs guide/lifecycle-hooks#afterview "Lifecycle Hooks Guide"}.
 *
 * @stable
 */
export interface AfterViewInit { ngAfterViewInit(): void; }
