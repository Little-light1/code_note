import React, {useRef} from 'react';
import {Modal, useModal} from '@gwaapp/ease';
import {useTranslation} from 'react-i18next';
import styles from './styles.module.scss'

const DownloadAppModal = ({pageProps, modalId}) => {
  
    const {t} = useTranslation();
    const {state: modalState} = useModal();
    const showModalData = modalState[modalId] || {};
    const dataArray = showModalData.data ?? []

    function hasData() {
      if (dataArray && dataArray.length > 0) {
        for(const item of dataArray) {
          if (item.isOn) {
            return true
          }
        }
      }
      return false
    }



    const hasDataComp = (
      <div className={styles.view}>
        <div className={styles.flexWrapper}>
          {dataArray.map((item, index) => (
            item.isOn &&
            <div className={styles.card} key={index}>
              <div className={styles.contentWrapper}>
                <div className={styles.header}>
                  {index === 0 ? t('Android版') : t('iPhone版')}
                </div>
                <div className={styles.content}>
                  <img src={item.url} alt="" className={styles.image}/>
                  <div className={styles.infoWrapper}>
                    <div className={styles.infoItem}>
                    <div className={styles.infoTitle}>{t('版本信息')}</div>
                      <div className={styles.infoValue}>{item.version}</div>
                    </div>
                    <div className={styles.infoItem}>
                    <div className={styles.infoTitle}>{t('更新日期')}</div>
                      <div className={styles.infoValue}>{item.pushDate}</div>    
                    </div> 
                  </div>                     
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )

    const noDataComp = (
      <div style={{height: '160px', lineHeight: '160px'}}>暂未配置App下载二维码, 请联系管理员</div>
    )

    return (
        <Modal
            id={modalId}
            title={t('APP下载')}
            // okText={t('保存')}
            destroyOnClose
            isAutoClose={false}
            footer={null}
            centered
            width={774}
            // onOk={handleOnOk}
        >
          {
            hasData() ? hasDataComp : noDataComp
          }
            
        </Modal>
    );
};

export default DownloadAppModal;
