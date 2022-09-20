import { FirebotUser } from '@crowbartools/firebot-custom-scripts-types/types/modules/user-db';
import { FirebotQueue } from '../../types';

export class Queue {
	#fs: FirebotQueue.FileSystem;
	#queue: FirebotUser[] = [];
	constructor(name: string, fs: FirebotQueue.FileSystem) {
		this.#fs = fs;
		// TODO: make sure the backup file exists
	}

	push(user: FirebotUser): boolean {
		if (!this.#queue.includes(user)) {
			this.#queue.push(user);
			return true;
		}
		return false;
	}

	pop(count: number): FirebotUser[] {
		const group = this.#queue.splice(0, count);
		return group;
	}

	remove(user: FirebotUser) {
		try {
			this.#queue = this.#queue.filter((value) => value._id !== user._id);
			return true;
		} catch (exc) {
			return false;
		}
	}

	position(user: FirebotUser) {
		return this.#queue.findIndex((value) => value._id === user._id);
	}

	get length() {
		return this.#queue.length;
	}
}
