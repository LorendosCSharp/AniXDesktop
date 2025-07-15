import React, { useRef } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";

type CropModalProps = {
  isOpen: boolean;
  isActionsDisabled: boolean;
  selectedImage: any | null;
  croppedImage: any | null;
  setCropModalProps: (props: {
    isOpen: boolean;
    isActionsDisabled: boolean;
    selectedImage: any | null;
    croppedImage: any | null;
  }) => void;
  cropParams: {
    guides?: boolean;
    width?: number;
    height?: number;
    quality?: number;
    aspectRatio?: number;
    forceAspect?: boolean;
  };
};

export const CropModal: React.FC<CropModalProps> = ({
  isOpen,
  setCropModalProps,
  cropParams,
  selectedImage,
  croppedImage,
  isActionsDisabled,
}) => {
  const cropperRef = useRef<ReactCropperElement>(null);

  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      const croppedImage = cropperRef.current?.cropper
        .getCroppedCanvas({
          width: cropParams.width,
          height: cropParams.height,
          maxWidth: cropParams.width,
          maxHeight: cropParams.height,
        })
        .toDataURL(
          "image/jpeg",
          cropParams.quality || false ? cropParams.quality : 100
        );

      setCropModalProps({
        isOpen: true,
        isActionsDisabled: false,
        selectedImage: selectedImage,
        croppedImage: croppedImage,
      });
    }
  };

  return (
    <Modal
      dismissible
      show={isOpen}
      onClose={() => {
        setCropModalProps({
          isOpen: false,
          isActionsDisabled: false,
          selectedImage: null,
          croppedImage: null,
        });
      }}
      size={"7xl"}
    >
      <ModalHeader>Обрезать изображение</ModalHeader>
      <ModalBody>
        <Cropper
          src={selectedImage}
          style={{ height: 400, width: "100%" }}
          responsive={true}
          // Cropper.js options
          initialAspectRatio={cropParams.aspectRatio || 1 / 1}
          aspectRatio={
            cropParams.forceAspect || false ? cropParams.aspectRatio : undefined
          }
          guides={cropParams.guides || false}
          ref={cropperRef}
        />

        <div className="mt-4">
          <h2 className="font-bold text-md">Управление</h2>
          <p>Тяните за углы что-бы выбрать область</p>
          <p>
            Нажмите 2 раза на пустое место, что бы поменять режим выбора области
            на перемещение и обратно
          </p>
          <p>Используйте колёсико мыши что-бы изменить масштаб</p>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          color={"blue"}
          disabled={isActionsDisabled}
          onClick={() => {
            getCropData();
          }}
        >
          Сохранить
        </Button>
        <Button
          color={"red"}
          disabled={isActionsDisabled}
          onClick={() => {
            setCropModalProps({
              isOpen: false,
              isActionsDisabled: false,
              selectedImage: null,
              croppedImage: null,
            });
          }}
        >
          Отменить
        </Button>
      </ModalFooter>
    </Modal>
  );
};
