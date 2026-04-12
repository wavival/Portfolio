/// <reference types="astro/client" />

declare module 'aos' {
  interface AosOptions {
    duration?: number;
    easing?: string;
    once?: boolean;
    offset?: number;
    delay?: number;
    disable?: boolean | 'mobile' | 'phone' | 'tablet' | (() => boolean);
    startEvent?: string;
    initClassName?: string;
    animatedClassName?: string;
    useClassNames?: boolean;
    disableMutationObserver?: boolean;
    debounceDelay?: number;
    throttleDelay?: number;
    mirror?: boolean;
    anchorPlacement?: string;
  }

  function init(options?: AosOptions): void;
  function refresh(initialize?: boolean): void;
  function refreshHard(): void;
}
