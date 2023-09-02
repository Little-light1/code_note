import React, {FC} from "react";
import { Progress } from 'antd';
import styles from './styles.module.scss';
import { TaskInfoModel } from "./types";
import { taskInfoColors } from "./constant";

interface Props {
    taskInfo: TaskInfoModel[] | null;
}

const Component: FC<Props> = ({taskInfo}) => (
    <div className={styles.taskInfo}>
        {taskInfo?.map((item, index) => {
            const idx = index % taskInfoColors.length;
            const colors = taskInfoColors[idx];
            const taskNum = item.taskNum || 0;
            const inProcessNum = item.inProcessNum || 0;
            const handledNum = item.handledNum || 0;
            let percent = 0;
            if (taskNum !== 0) {
                percent = inProcessNum/taskNum * 100;
            }
            return (
                <div key={item.groupId} className={styles.taskItem}>
                    <div className={styles.level}>
                        <div>{item.groupName}</div>
                        <div className={styles.levelIcon} style={{backgroundColor: colors[0]}}/>
                    </div>
                    <div className={styles.taskItemDetail}>
                        <div className={styles.taskItemValue}>
                            <div>任务：<span>{taskNum}</span></div>
                            <div><span className={styles.taskItemValueIcon} style={{backgroundImage: `linear-gradient(to right, ${colors[0]}, ${colors[1]})`}}/>处理中：<span>{inProcessNum}</span></div>
                            <div ><span className={styles.taskItemValueIcon} style={{backgroundColor: 'rgba(255, 255, 255, 0.2000)'}}/>已处理：<span>{handledNum}</span></div>
                        </div>
            
                        <Progress 
                            className={styles.itemProgress} 
                            strokeColor={{
                                '0%': colors[0],
                                '100%': colors[1],
                            }}
                            trailColor='rgba(255, 255, 255, 0.2000)'
                            percent={percent}
                            showInfo={false} 
                        />
                    </div>
                </div>
            );
        })}
    </div>
)

export default Component;