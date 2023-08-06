/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-this-alias */
import {
   ReactNode,
   RefObject,
   useEffect,
   useMemo,
   useRef,
   useSyncExternalStore
} from "react";
import { Modal } from "@/components/ui";
import { ModalProps } from "@/types";

interface ModalCloseOptions {
   /**
    * Whether or not to clear the modal content once it is closed.
    * @default false
    */
   keepAlive?: boolean;
}

interface ModalOpenOptions {
   /**
    * Whether or not the modal should close if the user clicks outside it.
    * @default true
    */
   closeOnClickOutside?: boolean;
   // /**
   //  * Whether or not the modal should impose a route change.
   //  * @default false
   //  */
   // routeChange?: string | boolean;
}

type ModalPropsUpdate = Partial<
   Exclude<ModalProps, "closeButtonRef" | "children" | "onClose">
>;

interface ModalManager {
   /**
    * Sets the content of the modal.
    */
   setContent(value: ReactNode): void;
   /**
    * Opens a modal.
    * @param options Modal options.
    */
   open(options?: ModalOpenOptions): void;
   /**
    * Change the properties of the modal.
    */
   morph(props: ModalPropsUpdate): void;
   /** Force closes the modal. */
   close(options?: ModalCloseOptions): void;
}

/**
 * External store for modal management in the app.
 */
class ModalStore extends EventTarget {
   isOpen = false;
   content = null as ReactNode;
   initialProps = {} as ModalPropsUpdate;
   closeOnClickOutside = true;
   closeButtonRef = null as RefObject<HTMLButtonElement> | null;
   props: ModalPropsUpdate;
   private manager: ModalManager;

   constructor() {
      super();
      const outerThis = this;
      this.props = this.initialProps;
      // Create a new modal manager.
      this.manager = {
         setContent(value: ReactNode) {
            outerThis.content = value;
            if (outerThis.isOpen) {
               outerThis.update();
            }
         },
         close(options) {
            outerThis.isOpen = false;
            if (!options?.keepAlive) {
               outerThis.content = null;
               outerThis.props = outerThis.initialProps;
            }
            outerThis.update();
         },
         open(options) {
            outerThis.isOpen = true;
            if (options?.closeOnClickOutside === undefined) {
               outerThis.closeOnClickOutside = true;
            } else {
               outerThis.closeOnClickOutside = options.closeOnClickOutside;
            }
            outerThis.update();
         },
         morph(props) {
            outerThis.props = props;
            if (outerThis.isOpen) {
               outerThis.update();
            }
         }
      };
   }
   /**
    * Triggers an external store update.
    */
   private update() {
      // Changes object reference.
      this.manager = { ...this.manager };

      this.dispatchEvent(new Event("update"));
   }

   /**
    * Required `subscribe()` function.
    * @param callback Function that should run when the store changes.
    * @returns An unsubscribe function.
    */
   subscribe(callback: () => void) {
      this.addEventListener("update", callback);
      return () => this.removeEventListener("update", callback);
   }

   /**
    * Required `getSnapshot()` function.
    * @returns A modal manager.
    */
   getSnapshot(): ModalManager {
      return this.manager;
   }
}

export const modalStore = new ModalStore();

interface ModalProviderProps {
   children: ReactNode;
}

/**
 * Wrapper for modal users.
 */
export function ModalProvider(props: ModalProviderProps) {
   const { children } = props;

   const childrenMemoized = useMemo(() => children, [children]);
   const modalSnapshot = useSyncExternalStore(
      modalStore.subscribe.bind(modalStore),
      modalStore.getSnapshot.bind(modalStore)
   );
   const closeButtonRef = useRef<HTMLButtonElement>(null);

   useEffect(() => {
      modalStore.closeButtonRef = closeButtonRef;
   }, []);

   return (
      <>
         {modalStore.isOpen ? (
            <Modal
               closeOnClickOutside={modalStore.closeOnClickOutside}
               closeButtonRef={closeButtonRef}
               onClose={() => modalSnapshot.close()}
               {...modalStore.props}
            >
               {modalStore.content}
            </Modal>
         ) : (
            <></>
         )}
         {childrenMemoized}
      </>
   );
}
