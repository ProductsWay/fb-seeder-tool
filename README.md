# Welcome to fb-seeder-tool 👋

![Version](https://img.shields.io/badge/version-0.0.1-blue.svg?cacheSeconds=2592000)
[![Twitter: jellydn](https://img.shields.io/twitter/follow/jellydn.svg?style=social)](https://twitter.com/jellydn)

> FB Seeder App

[![IT Man - Tech #22 - Tauri App - Build smaller, faster, and more secure desktop [Vietnamese]](https://i.ytimg.com/vi/SdLGyC8BtOE/hqdefault.jpg)](https://www.youtube.com/watch?v=SdLGyC8BtOE)

## Prerequisites

[pnpm](https://pnpm.io/) - Fast, disk space efficient package manager

[ni](https://github.com/antfu/ni) - 💡 Use the right package manager

[rustup](https://rustup.rs/) - rustup is an installer for the systems programming language Rust

## Built with

- [Tauri: Build an optimized, secure, and frontend-independent application for multi-platform deployment.](https://tauri.app/)
- [Tailwindcss: rapidly build modern websites without ever leaving your HTML](https://tailwindcss.com/)
- [React-hook-form: performance, flexible and extensible forms with easy-to-use validation](https://www.react-hook-form.com/)
- [Jotai: Primitive and flexible state management for React](https://jotai.org/)
- [new-web-app: Frontend app generator, built on top vitejs](https://github.com/jellydn/new-web-app)
- [use-local-storage-state: React hook that persists data in localStorage](https://github.com/astoilkov/use-local-storage-state)
- Testing with [vitest](https://vitest.dev/) and [playwright](https://playwright.dev/)
- And other standard tools as [Eslint](https://eslint.org/), [Prettier](https://prettier.io/), [Nano-staged](https://github.com/usmanyunusov/nano-staged)

## Install

```sh
ni
```

## Usage

```sh
# enable log on developement: RUST_LOG=info nr tauri dev
nr tauri dev
```

![https://gyazo.com/44138993476442256ffb1518b87b71e3.gif](https://gyazo.com/44138993476442256ffb1518b87b71e3.gif)

![https://gyazo.com/fc96fac098644f713fbc17fa3c330634.gif](https://gyazo.com/fc96fac098644f713fbc17fa3c330634.gif)

![https://gyazo.com/d6cc023cf4a54b8d1f3d98e5a15ffb69.gif](https://gyazo.com/d6cc023cf4a54b8d1f3d98e5a15ffb69.gif)

## Build

```sh
nr tauri build
```

![https://gyazo.com/b043bda7e44cfbc5518836dc49376962.gif](https://gyazo.com/b043bda7e44cfbc5518836dc49376962.gif)

## Run tests

```sh
nr test
```

## Useful links

- Calling Rust from the frontend https://tauri.app/v1/guides/features/command/
- Inter-Process Communication https://tauri.app/v1/guides/architecture/inter-process-communication/

## TODO

- [ ] Add usage on readme how to create FB app and get access token
  - Scopes: user_posts, pages_show_list, publish_to_groups, pages_read_engagement, pages_manage_posts, public_profile
- [x] Preview the content on editor
- [ ] Add to list
- [ ] Share to page
- [ ] Share to groups

## Author

👤 **Dung Huynh**

- Website: https://productsway.com/
- Twitter: [@jellydn](https://twitter.com/jellydn)
- Github: [@jellydn](https://github.com/jellydn)

## Show your support

Give a ⭐️ if this project helped you!

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
