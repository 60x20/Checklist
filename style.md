# Style Preferences

## [Declare when needed](https://google.github.io/styleguide/jsguide.html#features-declared-when-needed)

- Declaring variables close to where they're used limits their scope, reducing the cognitive load.

## [Use JSDoc for documentation](https://google.github.io/styleguide/tsguide.html#jsdoc-vs-comments)

- Use JSDoc for documentation (description, @todo, @returns, @param).
- Use normal comments for implementation details.

## [Prefer function declarations for named functions](https://google.github.io/styleguide/tsguide.html#function-declarations)

- Function declarations are clearer and hoistable.
- Prefer [arrow functions](https://google.github.io/styleguide/tsguide.html#function-expressions) for callbacks since they are simpler and bind `this`.

## [Avoid default exports](https://google.github.io/styleguide/tsguide.html#exports)

- Non-default exports add type-safety.
- Exception: If the filename matches the export name, default exports can be used since they stand out and the syntax is cleaner.

## [Use Readonly to ensure immutability](https://github.com/danvk/effective-typescript/blob/main/samples/ch-types/readonly.md)

- Marking parameters and `state` variables as readonly ensures immutability.
