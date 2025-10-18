// src/components/ui/Modal.tsx
'use client';

import { forwardRef, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from './Button';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  confirmAction?: () => void;
  confirmText?: string;
  cancelText?: string;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ open, onClose, title, children, confirmAction, confirmText = 'Confirm', cancelText = 'Cancel' }, ref) => {
    useEffect(() => {
      if (open) document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = 'unset'; };
    }, [open]);

    return (
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose} ref={ref}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center">
                    {title}
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </Dialog.Title>
                  <div className="mt-2">{children}</div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button variant="outline" onClick={onClose}>{cancelText}</Button>
                    {confirmAction && (
                      <Button onClick={() => { confirmAction(); onClose(); }} variant="default" className="bg-red-600 hover:bg-red-700">
                        {confirmText}
                      </Button>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  }
);
Modal.displayName = 'Modal';

export { Modal };