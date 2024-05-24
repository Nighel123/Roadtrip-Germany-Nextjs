declare global {
  interface Set<T> {
    add(value: T): this;
    clear(): void;
    delete(value: T): boolean;
    forEach(
      callbackfn: (value: T, value2: T, set: Set<T>) => void,
      thisArg?: any
    ): void;
    has(value: T): boolean;
    intersection(value: Set<T>): this;
    isSubsetOf(value: Set<T>): this;
    readonly size: number;
  }
}

export {};
