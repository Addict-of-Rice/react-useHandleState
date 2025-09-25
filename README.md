# React useHandleState

useHandleState is a modified useState hook which creates the commonly implemented handleChange function which modifies a property of a state object by giving the property name. useHandleState takes this implementation further by supporting nested objects/properties separated by "." and has access to the "prev" keyword.

This implementation allows for components which depend on deeply nested object structures to be easily and safely manipulated without needing to create multiple states or functions for each use case.

## Installation

```
npm i react-usehandlestate
```

## Examples
### Nested Object

We can safely modify nested objects/properties.

```tsx
import React, { FC } from 'react';
import { useHandleState } from 'react-usehandlestate';

export const NestedObject: FC = () => {
  const [rootObject, handleChange] = useHandleState({
    a: 'a',
    subObject: { b: 'b', property: 'value' },
  });

  return (
    <input
      type='text'
      value={rootObject.subObject.property}
      onChange={(event) => handleChange('subObject.property', event.target.value)}
    />
  );
};
```

### Nested Object depending on prev

We can also use prev.

```tsx
import React, { FC } from 'react';
import { useHandleState } from 'react-usehandlestate';

export const NestedObjectWithPrev: FC = () => {
  const [rootObject, handleChange] = useHandleState({
    a: 'a',
    subObject: { b: 'b', property: 0 },
  });

  return (
    <div>
      <h1>Time's clicked: {rootObject.subObject.property}</h1>
      <button onClick={() => handleChange('subObject.property', (prev) => prev + 1)}>+</button>
    </div>
  );
};
```

### Basic Primitive

We can use useHandleState like you would with setState, by simply not adding a path.

```tsx
import React, { FC } from 'react';
import { useHandleState } from 'react-usehandlestate';

export const BasicPrimitive: FC = () => {
  const [myString, handleChange] = useHandleState('value');

  return (
    <input type='text' value={myString} onChange={(event) => handleChange(event.target.value)} />
  );
};
```

### Primitive with Prev

We can also use prev of course.

```tsx
import React, { FC } from 'react';
import { useHandleState } from 'react-usehandlestate';

export const PrimitiveWithPrev: FC = () => {
  const [myNumber, handleChange] = useHandleState(0);

  return (
    <div>
      <h1>Time's clicked: {myNumber}</h1>
      <button onClick={() => handleChange((prev) => prev + 1)}>+</button>
    </div>
  );
};
```
