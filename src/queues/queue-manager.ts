/**
 * Class to handle the actual management of the queue
 */

import { UserDb } from '@crowbartools/firebot-custom-scripts-types/types/modules/user-db';
import { FirebotQueue } from '../../types';
import { Queue } from './queue';

export class QueueManager {
	static #queues: Record<string, Queue> = {};
	#fs: FirebotQueue.FileSystem;
	#userDb: UserDb;

	constructor(fs: FirebotQueue.FileSystem, userDb: UserDb) {
		this.#fs = fs;
		this.#userDb = userDb;
	}

	getQueue(name: string) {
		return QueueManager.#queues[name];
	}

	async getFirebotUser(user: string) {
		return await this.#userDb.getTwitchUserByUsername(user);
	}
}
