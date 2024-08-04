<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
const modalState = defineModel<boolean>({ required: true });
const focusState = ref(false);
const focusableElements = ref<FocusableElement[]>([]);

const modalElement = ref<null | HTMLDivElement>(null);

type HasDisabledAttributeElement =
  | HTMLButtonElement
  | HTMLFieldSetElement
  | HTMLOptGroupElement
  | HTMLOptionElement
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

type FocusableElement =
  | HTMLAnchorElement
  | HTMLInputElement
  | HTMLButtonElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

const FOCUSABLE_ELEMENTS = {
  A: "A",
  INPUT: "INPUT",
  BUTTON: "BUTTON",
  SELECT: "SELECT",
  TEXTAREA: "TEXTAREA",
} as const;

const isFocusableElement = (element: HTMLElement) => {
  if (element.tabIndex < 0) return;

  const hasDisabledAttributeElement = element as HasDisabledAttributeElement;
  if (hasDisabledAttributeElement.disabled) return;

  return element.nodeName in FOCUSABLE_ELEMENTS;
};

const focusFirstFocusableElement = () => {
  focusableElements.value[0].focus();
};

const correctFocusableElement = (element: HTMLElement) => {
  if (element.hasChildNodes()) {
    for (const childElement of element.children) {
      correctFocusableElement(childElement as HTMLElement);
    }
  }

  if (isFocusableElement(element)) {
    focusableElements.value.push(element as FocusableElement);
  }
};

const trapFocus = () => {
  if (focusState.value) return;

  for (const childElement of modalElement.value?.children ?? []) {
    correctFocusableElement(childElement as HTMLElement);
  }

  focusFirstFocusableElement();
  focusState.value = true;
};

onMounted(() => {
  trapFocus();
});
onUnmounted(() => {
  focusState.value = false;
});

const closeModal = () => {
  modalState.value = false;
};
</script>

<template>
  <div :class="$style.modal_background">
    <div
      :class="$style.modal_content"
      role="dialog"
      aria-modal
    >
      <span :class="$style.modal_close" @click="closeModal" />

      <div :class="$style.slot_content" ref="modalElement">
        <p>hoge</p>
        <slot />
      </div>
    </div>
  </div>
</template>

<style module>
.modal_background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal_content {
  position: relative;
  background-color: white;
  width: 55%;
  height: 60%;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal_close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: #333;
  transition: background-color 0.3s ease;
}

.modal_close:hover {
  background-color: #e0e0e0;
}

.modal_close::before,
.modal_close::after {
  content: '';
  position: absolute;
  width: 15px;
  height: 2px;
  background-color: #333;
}

.modal_close::before {
  transform: rotate(45deg);
}

.modal_close::after {
  transform: rotate(-45deg);
}

.slot_content {
  margin-top: 20px;
}
</style>
