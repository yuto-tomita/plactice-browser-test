// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/vue3-vite';
 
const config: StorybookConfig = {
  framework: '@storybook/vue3-vite',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    // Other Storybook addons
    '@storybook/addon-interactions', // 👈 Register the addon
  ],
};
 
export default config;
