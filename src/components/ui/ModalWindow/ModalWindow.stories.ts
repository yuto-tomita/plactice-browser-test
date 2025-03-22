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
