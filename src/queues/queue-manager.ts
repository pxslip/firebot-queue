/**
 * Class to handle the actual management of the queue
 */

import { FirebotUser, UserDb } from '@crowbartools/firebot-custom-scripts-types/types/modules/user-db';
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

	listQueues() {
		return Object.keys(QueueManager.#queues);
	}

	getQueue(name: string): Queue {
		if (!QueueManager.#queues[name]) {
			QueueManager.#queues[name] = new Queue(name, this.#fs);
		}
		return QueueManager.#queues[name];
	}

	async getFirebotUser(user: string): Promise<FirebotUser> {
		return await this.#userDb.getTwitchUserByUsername(user);
	}
}
