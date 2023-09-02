import React from 'react';
import {Carousel} from 'antd';
import {getImageUrl} from '@/services/file';
import styles from './styles.module.scss';
import DefaultBackground from '../../../../public/image/login.jpg';

const CarouselBackground = ({
    background = [],
    autoplay = false,
    height = 1080,
    width = 1920,
}) => (
    <Carousel autoplay={autoplay}>
        {/* name, enable, */}
        {background.map(({ipicId, ipicName, ipicIsenable, src}) => {
            if (!ipicIsenable) {
                return null;
            }

            return (
                <div key={ipicId}>
                    <img
                        alt={ipicName}
                        src={getImageUrl(src)}
                        height={height}
                        width={width}
                    />
                </div>
            );
        })}
    </Carousel>
);

const Background = ({
    background = [],
    loginPicsIsRequested = false,
    size = {
        width: 1920,
        height: 1080,
    },
}) => {
    const {height, width} = size;
    return (
        <div className={styles.view}>
            {!background.length && loginPicsIsRequested ? (
                <img
                    alt=""
                    src={DefaultBackground}
                    height={height}
                    width={width}
                />
            ) : (
                <CarouselBackground
                    background={background}
                    autoplay
                    height={height}
                    width={width}
                />
            )}
        </div>
    );
};

export default Background;
