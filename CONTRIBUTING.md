# Welcome!

Thank you for your interest in contributing to the BotComet project! To keep things organized, please read the following guidelines before submitting a pull request.

## Table of Contents

- [Pull Request Guidelines](#pull-request-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [General Programming Guidelines](#general-programming-guidelines)
- [Content Guidelines](#content-guidelines)
- [Writing Documentation](#writing-documentation)
- [Code of Conduct](#code-of-conduct)

## Pull Request Guidelines

- Unless told otherwise, please open a new issue before submitting a pull request. If you want to work on a current issue, please leave a comment on the issue to let others know.
- Make sure your code is formatted correctly. We use [ESLint](https://eslint.org/) to enforce code style, so an editor extension is recommended. You can run `lerna run lint` from the root of the repository to check for errors.
- Make sure your code is well documented. If the function is private and its name is self-explanatory, you don't need to add a JSDoc comment. Otherwise, please add a JSDoc comment to the function.
- Test the code first. Run `lerna run test:ts` from the root of the repository to check for syntax/build errors.

## Commit Guidelines

- You don't need long commit names, but please make sure they are descriptive enough to understand what the commit does. "Updated README.md" is fine if you add more info in the pull request, but "Added stuff" is not.
- Make your commits small. If you are adding a new feature, you will likely need multiple commits. There is no need to squash your commits, as we will squash them when merging the pull request.

## General Programming Guidelines

- Use `const` and `let` instead of `var`. `var` is not allowed in the monorepo under any circumstances. If you are using `var` in your code, you will be asked to change it.
- Unless a class member *has* to be public, make it private.
- Use `async`/`await` instead of `.then()` when possible.
- If an error should be impossible, say so in a comment AND the error message.
- You should not be using `any` unless you have a very good reason to do so. "This type is too complicated" is not a good reason. Yes, there are some types in the monorepo with `any` in them, but that is because they are not finished yet. New code should not have `any` in it, and old code with `any` needs revising.
- Abstract types that are used in multiple packages should go in the `@botcomet/protocol` package (e.g. `DualSet`) UNLESS the type should go into a specific package used by all dependents (e.g. `Padlock` from `@botcomet/auth`).

## Content Guidelines

- DO NOT modify the `@botcomet/protocol` package unless the change does not affect the protocol itself (e.g. adding an abstract type). If you have a suggestion for the protocol, open a separate issue for it.
- Unless you have a very good reason to do so, you should not be adding new dependencies to the project. Contact a project maintanier if you want to add a new dependency.
- DO NOT modify package versions.
- DO NOT edit the test files unless your commit is a fix for tests specifically.
- DO NOT add new scripts to packages unless a maintainer tells you to do so.

## Writing Documentation

- Documentation should be in English. If you are not fluent in English, please ask someone to double-check your documentation.

## Code of Conduct

- Any submitted content that is completely unrelated to the project (spam, advertisements, NSFW, etc.) will be rejected and the user will be blocked from contributing.
- Make sure your submission belongs in the project before starting to work on it. Submitting an issue is the only for-sure way to find this out.