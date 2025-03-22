import type { Meta, StoryObj } from "@storybook/vue3";

import { expect, fireEvent, waitFor, within } from "@storybook/test";

import ModalWindow from "./ModalWindow.vue";
// NOTE: Interaction Test 良いところポイント
// - jsdom 等を使用したテスト用のシミュレーション環境ではなく、実際にブラウザにレンダリングすることによってユーザーと近い環境でテストを行うことができる
// - Storybook コンソールが見やすい
// - Storybook コンソール上からイベントをステップ実行できるため、テストが可視化されてわかりやすい(フロントテストに慣れていなくてもデバッグしやすいのでは)
// template を拡張できるため、よりユースケースに沿ったコンポーネントテストが書ける

// NOTE: Interaction Test 微妙ポイント
// - console.log が直感的でない(throw new Error をして確認する必要がある)
// - Step Function を使用すると本来落ちるはずのテストが Pass する
// - (やらなくても良いが) test用のStoryファイルとtest用のStoryファイルを分ける必要がある(二重管理が必要)
// - テストごとに Story 環境を作る必要があるため冗長になりがち
const meta: Meta<typeof ModalWindow> = {
  title: "interaction test/ui/ModalWindow",
  component: ModalWindow,
} satisfies Meta<typeof ModalWindow>;

export default meta;
type Story = StoryObj<typeof ModalWindow>;

const defaultComponent: Story = {
  render: (args) => ({
    components: { ModalWindow },
    setup() {
      return { args };
    },
    template: "<ModalWindow v-bind='args' />",
  }),
  args: {
    modelValue: true,
  },
};

export const 背景をクリックしてもモーダルが閉じないこと: Story = {
  ...defaultComponent,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await fireEvent.click(canvas.getByRole("dialog"));

    expect(canvas.queryByRole("dialog")).toBeTruthy();
  },
};

export const Escapeキーでモーダルが閉じること: Story = {
  ...defaultComponent,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await fireEvent.keyDown(canvas.getByRole("dialog"), { key: "Escape", code: "Escape", keyCode: 27, charCode: 27 });

    await waitFor(() => {
      expect(canvas.queryByRole("dialog")).toBeNull();
    });
  },
};

export const 複数存在するタブフォーカス可能な要素のうち一番先頭要素にフォーカスが当たること: Story = {
  render: (args) => ({
    components: { ModalWindow },
    setup() {
      return { args };
    },
    template: `<ModalWindow v-bind='args'>
      <label for="test-form">test form</label><br/>
      <input type="text" id="test-form" placeholder="test form" /><br>

      <label for="test-form2">test form 2</label><br/>
      <input type="text" id="test-form2" placeholder="test form2" />
    </ModalWindow>`,
  }),
  args: {
    modelValue: true,
  },
  play: async () => {
    const activeForm = document.activeElement as HTMLInputElement;

    expect(activeForm.type).toEqual("button");
  },
};

export const フォーカス可能な最後の要素をアクティブにした状態でモーダルを閉じてから再度モーダルを開くと先頭のフォーカス可能要素がアクティブとなること: Story =
  {
    render: (args) => ({
      components: { ModalWindow },
      setup() {
        return { args };
      },
      template: `
      <div>
        <button type="button" @click="args.modelValue = true">click me</button>

        <ModalWindow v-model='args.modelValue'>
          <label for="test-form">test form</label><br/>
          <input type="text" id="test-form" placeholder="test form" /><br>

          <label for="test-form2">test form 2</label><br/>
          <input type="text" id="test-form2" placeholder="test form2" />
        </ModalWindow>
      </div>`,
    }),
    args: {
      modelValue: true,
    },
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      // NOTE: テスト可読性のために step function を使用したいところだが、
      // storybook-test-runner と step function が相性悪く、step関数内で例外が発生してもテストが test-runner 内では通ってしまうため使用しない
      canvas.getByPlaceholderText("test form2").focus();
      expect((document.activeElement as HTMLInputElement).placeholder).toEqual("test form2");

      await fireEvent.keyDown(canvas.getByRole("dialog"), { key: "Escape" });
      expect(canvas.queryByRole("dialog")).toBeNull();

      await fireEvent.click(canvas.getByText("click me"));
      await waitFor(() => {
        expect((document.activeElement as HTMLInputElement).type).toEqual("button");
      });
    },
  };

export const 親要素にアクティブなフォームが存在してもモーダルを開いた際にモーダル内のフォームがアクティブになること: Story =
  {
    render: (args) => ({
      components: { ModalWindow },
      setup() {
        return { args };
      },
      template: `
      <div>
        <label for="test-form">test form</label><br/>
        <input type="text" id="test-form" placeholder="test form" /><br>
        <button type="button" @click="args.modelValue = true">click me</button>

        <ModalWindow v-model='args.modelValue'>
          <label for="test-form2">test form 2</label><br/>
          <input type="text" id="test-form2" placeholder="test form2" />
        </ModalWindow>
      </div>`,
    }),
    args: {
      modelValue: false,
    },
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      canvas.getByPlaceholderText("test form").focus();
      expect((document.activeElement as HTMLInputElement).placeholder).toEqual("test form");

      await fireEvent.click(canvas.getByText("click me"));
      await waitFor(() => {
        expect((document.activeElement as HTMLInputElement).type).toEqual("button");
      });
    },
  };
