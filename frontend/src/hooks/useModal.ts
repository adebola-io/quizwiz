import { modalStore } from "@/stores";

/**
 * Hook for creating and managing the lifetime of a modal.
 * @example
 * ```tsx
 * function Button() {
 *    const modal = useModal();
 *    modal.data = <>Hello world.</>;
 *
 *    return (
 *       <button onClick={()=>modal.open()}>
 *          Click Me
 *       </button>
 *    );
 * }
 * ```
 */
export function useModal() {
   const modalSnapshot = modalStore.getSnapshot();
   return modalSnapshot;
}
