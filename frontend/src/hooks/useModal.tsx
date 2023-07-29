import { modalStore } from "@/stores";

/**
 * Hook for creating and managing the lifetime of a modal.
 * @example
 * ```tsx
 * function Button() {
 *    const modal = useModal();
 *    function handleClick() {
 *       modal.data = <>Hello world.</>;
 *       modal.open();
 *    }
 *
 *    return (
 *       <button onClick={handleClick}>
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
