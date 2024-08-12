import { expect, fireEvent, within } from "@storybook/test";
import type { Meta, StoryObj } from "@storybook/vue3";

import ModalWindow from "./ModalWindow.vue";

const meta: Meta<typeof ModalWindow> = {
  component: ModalWindow,
} satisfies Meta<typeof ModalWindow>;

export default meta;
type Story = StoryObj<typeof ModalWindow>;

export const Basic: Story = {
  render: (args) => ({
    components: { ModalWindow },
    setup() {
      return { args };
    },
    template: `<ModalWindow v-bind='args'>
      this is modal
    </ModalWindow>`,
  }),
  args: {
    modelValue: true,
  },
};

// NOTE: 通常のUI確認用のStoryと同一ファイルにインタラクションテストを書いてしまうと、確認用UIタブ中にテストの用のStoryが生成されてしまうため微妙な気がする
export const TestModalClose: Story = {
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("close ボタンをクリックしたらモーダルが表示されなくなること", async () => {
      await fireEvent.click(canvas.getByTestId("close-button"));

      expect(canvas.queryByRole("dialog")).toBeNull();
    });

    await step("背景をクリックしてもモーダルが閉じないこと", async () => {});
  },
};
