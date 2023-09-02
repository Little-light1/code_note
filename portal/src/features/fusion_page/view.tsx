import React, {FC, useMemo} from 'react';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {PageProps, usePage} from '@gwaapp/ease';
import {Row, Col} from 'antd';
import TwoBillsStatistics from './two_bills_statistics';
import DefectStatistics from './defect_statistics';
import EquipmentInfo from './equipment_info';
import WarningInfo from './warning_info';
import DataQuality from './data_quality';
import DataFlow from './data_flow';
import StationEnergyEfficiency from './station_energy_efficiency';
import EquipmentEnergyEfficiency from './equipment_energy_efficiency';
import styles from './styles.module.scss';
import {MenuCode} from './types';

const Component: FC<PageProps> = (props) => {
    const menus = useAppSelector((state) => state.app.menus);
    const menuCodes: string[] = useMemo(
        () => menus?.map((item: any) => item.code) || [],
        [menus],
    );

    usePage({
        ...props,
    });

    return (
        <div className={styles.fusionPage}>
            {/* 校验若有AM菜单权限则显示数据 */}
            {menuCodes.indexOf(MenuCode.AM) > -1 ? (
                <Row gutter={[10, 10]}>
                    {/* 两票统计 */}
                    <Col span={12}>
                        <TwoBillsStatistics {...props} />
                    </Col>
                    {/* 缺陷统计 */}
                    <Col span={12}>
                        <DefectStatistics {...props} />
                    </Col>
                </Row>
            ) : null}
            {/* 校验若有SPHM菜单权限则显示数据 */}
            {menuCodes.indexOf(MenuCode.SPHM) > -1 ? (
                <Row gutter={[10, 10]}>
                    {/* 设备信息 */}
                    <Col span={24}>
                        <EquipmentInfo {...props} />
                    </Col>
                    {/* 预警信息 */}
                    <Col span={24}>
                        <WarningInfo {...props} />
                    </Col>
                </Row>
            ) : null}
            {/* 校验若有BI菜单权限则显示数据 */}
            {menuCodes.indexOf(MenuCode.BI) > -1 ? (
                <Row gutter={[10, 10]}>
                    {/* 场站系统效率PR对比分析 */}
                    <Col span={24}>
                        <StationEnergyEfficiency {...props} />
                    </Col>
                    {/* 设备能效对比分析 */}
                    <Col span={24}>
                        <EquipmentEnergyEfficiency {...props} />
                    </Col>
                </Row>
            ) : null}
            {/* 校验若有DataPlat菜单权限则显示数据 */}
            {menuCodes.indexOf(MenuCode.DataPlat) > -1 ? (
                <Row gutter={[10, 10]}>
                    {/* 数据流量 */}
                    <Col span={12}>
                        <DataFlow {...props} />
                    </Col>
                    {/* 数据质量 */}
                    <Col span={12}>
                        <DataQuality {...props} />
                    </Col>
                </Row>
            ) : null}
            <Row gutter={[10, 10]}>
                <Col span={24}>
                    <div style={{height: 100}} />
                </Col>
            </Row>
        </div>
    );
};

export default Component;
