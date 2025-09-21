import { useState } from 'react';

// 1. Generate all valid dot-paths of nested object keys
type Path<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object ? K | `${K}.${Path<T[K]>}` : K;
    }[keyof T & string]
  : never;

// 2. Get the type of the value at a given dot-path
type PathValue<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? PathValue<T[K], Rest>
    : never
  : P extends keyof T
  ? T[P]
  : never;

// 3. Helper to immutably set nested value at path, fully typed
function setValueAtPath<T, P extends Path<T>>(rootObject: T, path: P, value: PathValue<T, P>): T {
  const keys = path.split('.') as (keyof any)[];
  const newObject = { ...rootObject };
  let current: any = newObject;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    current[key] = { ...current[key] };
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
  return newObject;
}

function getValueAtPath<T>(rootObject: T, path: string): any {
  if (path === '') return rootObject;
  return path
    .split('.')
    .reduce((accumulatorObject: any, key) => accumulatorObject?.[key], rootObject);
}

// 4. The custom hook
export function useHandleState<S>(initialState: S | (() => S)) {
  const [value, setValue] = useState<S>(initialState);

  function handleChange(newValue: S | ((prev: S) => S)): void;
  function handleChange<P extends Path<S>>(
    path: P,
    newValue: PathValue<S, P> | ((prev: PathValue<S, P>) => PathValue<S, P>)
  ): void;

  function handleChange(param1: any, param2?: any) {
    if (param2 === undefined) {
      setValue(param1);
    } else {
      if (typeof param2 !== 'function') {
        console.log('pram2 no function');
        setValue((prev) => setValueAtPath(prev, param1, param2));
      } else {
        console.log('param2 function');
        setValue((prev) => {
          const prevAtPath = getValueAtPath(prev, param1);
          console.log('prevAtPath: ', prevAtPath);
          const nextAtPath = param2(prevAtPath);
          console.log('nextAtPath: ', nextAtPath);
          return setValueAtPath(prev, param1, nextAtPath);
        });
      }
    }
  }

  return [value, handleChange] as const;
}