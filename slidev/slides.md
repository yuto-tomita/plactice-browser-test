---
# You can also start simply with 'default'
theme: seriph
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: https://cover.sli.dev
# some information about your slides (markdown enabled)
title: Storybook の InteractionTest がよさそうっていう話
info: |
  ## Slidev Starter Template
  Presentation slides for developers.

  Learn more at [Sli.dev](https://sli.dev)
# apply unocss classes to the current slide
class: text-center
# https://sli.dev/features/drawing
drawings:
  persist: false
# slide transition: https://sli.dev/guide/animations.html#slide-transitions
transition: slide-left
# enable MDC Syntax: https://sli.dev/features/mdc
mdc: true
---

# InteractionTest とは？

---

Storybook上でコンポーネントの振る舞いが正しいかどうかを検証できるテスト手法の一つ。

記述したコンポーネントをStorybook経由で実際にブラウザにDOMを描画し、ユーザーの操作をシミュレートすることでコンポーネントの振る舞いを検証する。

---

# Storybook ではテスト機能の強化が進んでいる

---

- Storybook 6.4から InteractionTest が仕様としてリリース
  - https://storybook.js.org/blog/storybook-6-4/
- Storybook 7.x は開発者体験向上をメインに開発されていた
  - TypeScript連携への強化(CSF)
  - Vite サポート
  - カバレッジレポートの出力
  - step function の実装(play関数内にstep関数を記述することにより、より可読性の高いテストコードを記述できる)
- Storybook 8.x ではテスト機能の強化が進んでいる
  - テストビルドの高速化
  - [Portable stories](https://storybook.js.org/blog/portable-stories-for-playwright-ct/)(Storybookを用いた単体テストする時に、カタログとしての Story を再利用することで props を渡すことなくテストができるようになる)
    - Storybook内部で搭載しているテストランナーに Vitest を導入
    - アクセシビリティテストの機能強化

---

# デモ

こちらのようなモーダルを用意してみた

<ModalWindow :model-value="true" style="margin-top: 20px">
  Hello World! <br/>
  よくあるモーダルです
</ModalWindow>

---

# モーダルの要件

- モーダルコンテンツにフォーカス可能な要素がある場合、それに要素を当てる
- モーダルコンテンツ以外の要素にフォーカスが移動しない
- エスケープキーを押すとモーダルが閉じる
- 「x」ボタンを押すとモーダルが閉じる
- 「x」ボタンの上でEnterキーを押すとモーダルが閉じる

---

# テストコード

実際にデプロイ先でテストを実行することもできたりする

https://yuto-tomita.github.io/plactice-browser-test/?path=/story/components-ui-modalwindow--basic

---

# まとめ

かなりテストの信頼性が上がり、成果の視認性が上がる良い手法になると思った。

実際にブラウザにレンダリングしてテストを行う手法は、最近 Vitest でも [BrowserMode](https://vitest.dev/guide/browser/) という機能が提供され始め、どんどん普及していくんじゃないかと考えている。





