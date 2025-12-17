import { Children, cloneElement, type FC, type PropsWithChildren, type ReactElement, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import 'react-datepicker/dist/react-datepicker.css';
import './index.scss';
import useOutsideClick from '../../hooks/useOtsideClick.ts';
import { preventSideModalCloseAtom } from '../../modules/packages/store/store.ts';
import { useRecoilValue } from 'recoil';

const Modal: FC<
  PropsWithChildren<{ onClose: () => void; isOpen: boolean; title?: string; closeOnOutsideClick?: boolean }>
> = ({ onClose, isOpen, children, title = 'edit' }) => {
  const { t } = useTranslation();
  const modalRef = useRef(null);
  const modalWrapperRef = useRef(null);

  const preventSideModalClose = useRecoilValue(preventSideModalCloseAtom);

  const handleOutsideClickClose = () => {
    if (!preventSideModalClose) {
      onClose();
    } else return;
  };

  useOutsideClick(modalRef, handleOutsideClickClose);

  const childrenWithProps = Children.map(children, (child) =>
    cloneElement(child as ReactElement, { modalRef: modalWrapperRef }),
  );

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('disable-body-scroll');
    } else {
      document.body.classList.remove('disable-body-scroll');
    }

    return () => {
      document.body.classList.remove('disable-body-scroll');
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="edit-wrapper" ref={modalWrapperRef}>
      <div className="edit-inner" ref={modalRef}>
        <div className="modal-header font-bold flex space-between">
          <div>{t(title)}</div>
          <div className="cursor flex" onClick={onClose}>
            <img src="/images/close.svg" alt="" />
          </div>
        </div>
        <div className="modal-body">{childrenWithProps}</div>
      </div>
    </div>
  );
};

export default Modal;
