import { nextTick, onActivated, onDeactivated, onMounted, onUnmounted, ref } from "vue";
import { useDebounceFn, useEventListener } from "@vueuse/core";
import type { Ref } from "vue";
/**
 * 创建观察器
 * @param {HTMLElement} dom
 * @param {() => void} callback
 * @returns {window.MutationObserver}
 */
export function observerDomResize(dom: HTMLElement, callback: () => void) {
  const MutationObserver = window.MutationObserver;
 
  const observer = new MutationObserver(callback);
 
  observer.observe(dom, { attributes: true, attributeFilter: ["style"], attributeOldValue: true });
 
  return observer;
}
function autoResize(
  dom: Ref<HTMLElement | null>,
  onResize?: () => void,
  afterAutoResizeMixinInit?: () => void,
) {
  const width = ref(0);
  const height = ref(0);
 
  let debounceInitWHFun: () => void;
  let domObserver: MutationObserver | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let domHtml: HTMLElement | null = null;
  const initWH = (resize = true) => {
    return new Promise((resolve) => {
      nextTick(() => {
        domHtml = dom.value;
        width.value = dom.value ? dom.value.clientWidth : 0;
        height.value = dom.value ? dom.value.clientHeight : 0;
 
        // 减少警告频率，只在开发环境且确实有问题时才警告
        if (import.meta.env.DEV) {
          if (!dom.value) {
            console.warn("DataV: Failed to get dom node, component rendering may be abnormal!");
          } else if (!width.value || !height.value) {
            // 检查是否是因为组件还未完全渲染导致的临时0尺寸
            const rect = dom.value.getBoundingClientRect();
            if (rect.width === 0 && rect.height === 0) {
              // 如果getBoundingClientRect也返回0，说明组件确实没有尺寸
              console.warn("DataV: Component width or height is 0px, rendering abnormality may occur!");
            }
            // 如果getBoundingClientRect有尺寸但clientWidth/Height为0，可能是CSS问题，不警告
          }
        }
 
        if (typeof onResize === "function" && resize) onResize();
        resolve(true);
      });
    });
  };
  const getDebounceInitWHFun = () => {
    debounceInitWHFun = useDebounceFn(initWH, 200);
  };
  const bindResizeObserver = () => {
    if (!domHtml || typeof ResizeObserver === "undefined") return;

    resizeObserver = new ResizeObserver(() => {
      debounceInitWHFun();
    });

    resizeObserver.observe(domHtml);
  };

  const bindDomResizeCallback = () => {
    if (!domHtml) {
      if (import.meta.env.DEV) {
        console.warn("autoResize: dom element is missing, skip binding resize observer.");
      }
      return;
    }

    domObserver = observerDomResize(domHtml, debounceInitWHFun);

    useEventListener(window, "resize", debounceInitWHFun);
  };
  const unbindDomResizeCallback = () => {
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }

    if (!domObserver) return;
    domObserver.disconnect();
    domObserver.takeRecords();
    domObserver = null;
  };
  const autoResizeMixinInit = async () => {
    await initWH(false);
 
    getDebounceInitWHFun();
 
    bindDomResizeCallback();

    bindResizeObserver();
 
    if (typeof afterAutoResizeMixinInit === "function") afterAutoResizeMixinInit();
  };
  onMounted(() => {
    autoResizeMixinInit();
  });
 
  onUnmounted(() => {
    unbindDomResizeCallback();
  });
  onActivated(autoResizeMixinInit);
 
  onDeactivated(unbindDomResizeCallback);
 
  return {
    width,
    height,
    initWH,
  };
}
 
export default autoResize;