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

## [Avoid positional parameters of the same type](https://github.com/danvk/effective-typescript/blob/main/samples/ch-design/same-type-params.md)

- Positional parameters of the same type are easy to mix up.

## [Prefer a distinct type for failure](https://github.com/danvk/effective-typescript/blob/main/samples/ch-design/in-domain-null.md)

- Using a distinct type for failure makes the failure obvious.
- Prefer `null` over `undefined` to ensure the failure is handled even with optional parameters.

## [Make illegal states unrepresentable](https://github.com/danvk/effective-typescript/blob/main/samples/ch-design/valid-states.md) and [prefer precise types](https://github.com/danvk/effective-typescript/blob/main/samples/ch-design/avoid-strings.md) or [brands](https://github.com/danvk/effective-typescript/blob/main/samples/ch-recipes/brands.md)

- Making illegal states unrepresentable, precise types and brands increase confidence and type safety, and reduce implementation complexity.
- Note: Big unions might hurt performance.
