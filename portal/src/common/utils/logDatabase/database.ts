import {createRxDatabase, addRxPlugin, RxDatabase} from 'rxdb';
import {getRxStoragePouch, addPouchPlugin} from 'rxdb/plugins/pouchdb';
import {RxDBLeaderElectionPlugin} from 'rxdb/plugins/leader-election';
import {RxDBQueryBuilderPlugin} from 'rxdb/plugins/query-builder';
import {RxDBUpdatePlugin} from 'rxdb/plugins/update';
import {RxDBDevModePlugin} from 'rxdb/plugins/dev-mode';
import {logSchema} from './schema';

addRxPlugin(RxDBLeaderElectionPlugin);
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBDevModePlugin);
addPouchPlugin(require('pouchdb-adapter-idb'));

let dbPromise: Promise<RxDatabase> | null = null;

const create = async () => {
    // 创建数据库
    const db = await createRxDatabase({
        name: 'logsdb',
        storage: getRxStoragePouch('idb'),
    });
    window.db = db; // 创建数据源表

    await db.addCollections({
        logs: {
            schema: logSchema,
        },
    });
    return db;
};

export const getDatabase = () => {
    if (!dbPromise) dbPromise = create();
    return dbPromise;
};
