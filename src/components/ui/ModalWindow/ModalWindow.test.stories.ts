import type { Meta, StoryObj } from "@storybook/vue3";

import { expect, fireEvent, waitFor, within } from "@storybook/test";

import ModalWindow from "./ModalWindow.vue";

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

export const モーダルが閉じること: Story = {
  ...defaultComponent,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await fireEvent.click(canvas.getByTestId("close-button"));

    expect(canvas.queryByRole("dialog")).toBeNull();
  },
};

export const 複数存在するフォームのうち先頭のフォームがアクティブであること: Story = {
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

    expect(activeForm.placeholder).toEqual("test form");
  },
};

export const 先頭のフォームがdisableなフォームの場合disableの次のフォームがアクティブであること: Story = {
  render: (args) => ({
    components: { ModalWindow },
    setup() {
      return { args };
    },
    template: `<ModalWindow v-bind='args'>
      <label for="test-form">test disable form</label><br>
      <input type="text-disable-form" disabled /><br>

      <label for="test-form">test form</label><br/>
      <input type="text" id="test-form" placeholder="test form" />
    </ModalWindow>`,
  }),
  args: {
    modelValue: true,
  },
  play: async () => {
    const activeForm = document.activeElement as HTMLInputElement;

    expect(activeForm.placeholder).toEqual("test form");
  },
};

export const 二番目のフォームをアクティブにした状態でモーダルを閉じてから再度モーダルを開くと先頭のフォームがアクティブとなること: Story =
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

      await fireEvent.click(canvas.getByTestId("close-button"));
      expect(canvas.queryByRole("dialog")).toBeNull();

      await fireEvent.click(canvas.getByText("click me"));
      await waitFor(() => {
        expect((document.activeElement as HTMLInputElement).placeholder).toEqual("test form");
      });
    },
  };
