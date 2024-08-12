<script setup lang="ts">
import ModalWindow from "@/components/ui/ModalWindow";
import { ref } from "vue";

const modalState = ref(false);
</script>

<template>
  <button @click="modalState = true">clickMe</button>

  <ModalWindow
    v-model="modalState"
    teleport='body'
  >
    <label for="form1">これは disable なフォーム</label>
    <div>
      <p>
        <input id="form1" type="text" />
      </p>
    </div>

    <label for="form2">これは disable なフォーム</label>
    <div>
      <p>
        <input id="form2" type="text" disabled />
      </p>
    </div>

    <label for="form3">好きな食べ物は？</label>
    <div>
      <p>
        <input id="form3" type="text" />
      </p>
    </div>
  </ModalWindow>
</template>
