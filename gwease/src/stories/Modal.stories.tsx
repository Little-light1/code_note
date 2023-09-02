import React, { FC, useCallback, useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Button } from "antd";
import { Modal, ModalProvider, useModal } from "../components/Modal/index";
import "antd/lib/style/index.css";
import "antd/lib/modal/style/index.css";

export default {
  title: "Example/Modal",
  component: Modal,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof Modal> = (args) => <Modal {...args} />;

const Container: FC = ({ children }) => <ModalProvider>{children}</ModalProvider>;

const ModalContent: FC<any> = ({ onOk, onCancel }) => {
  const { openModal } = useModal();
  return (
    <div>
      <Button
        onClick={() => {
          openModal("testModal");
        }}
      >
        打开模态窗口
      </Button>

      <Modal id="testModal" onOk={onOk} onCancel={onCancel}>
        <div>
          <Button type="primary" onClick={() => openModal("testModal2")}>
            打开
          </Button>
        </div>
      </Modal>

      <Modal id="testModal2">
        <div>123</div>
      </Modal>
    </div>
  );
};

const GlobalMaskContent: FC = ({}) => {
  const { openGlobalMask } = useModal();
  return (
    <div>
      <Button
        onClick={() => {
          openGlobalMask();
        }}
      >
        开启默认
      </Button>

      <Button
        onClick={() => {
          openGlobalMask({ visible: true, text: "这个是全局遮罩" });
        }}
      >
        开启自定义遮罩
      </Button>

      <Modal id="testModal">
        <div>content</div>
      </Modal>
    </div>
  );
};

// 1. 非受控使用
export const ModalTemplate = () => {
  return (
    <Container>
      <ModalContent />
    </Container>
  );
};
ModalTemplate.storyName = "模态(非受控)";

// 2. 受控使用
export const ControlledModalTemplate = () => {
  const [state, setState] = useState({});

  return (
    <ModalProvider state={state} updateState={setState}>
      <ModalContent />
    </ModalProvider>
  );
};
ControlledModalTemplate.storyName = "模态(受控)";

// 3. Promise
export const PromiseModalTemplate = () => {
  const [state, setState] = useState({});

  const onOk = useCallback(() => {
    return new Promise<boolean>((resolve, reject) => {
      setTimeout(() => {
        resolve(true);
      }, 3000);
    });
  }, []);

  const onCancel = useCallback(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject();
      }, 2000);
    });
  }, []);

  return (
    <ModalProvider state={state} updateState={setState}>
      <ModalContent onCancel={onCancel} onOk={onOk} />
    </ModalProvider>
  );
};
PromiseModalTemplate.storyName = "Promise控制";

// 4. 全局遮罩
export const GlobalMaskTemplate = () => {
  const [state, setState] = useState({});

  return (
    <ModalProvider updateState={setState}>
      <GlobalMaskContent />
    </ModalProvider>
  );
};
GlobalMaskTemplate.storyName = "全局遮罩(非受控)";

// 5. 打开多个模态窗口
export const MultiTemplate = () => {
  const [state, setState] = useState({});

  return (
    <ModalProvider>
      <ModalContent />
    </ModalProvider>
  );
};
MultiTemplate.storyName = "多个模态窗口";
