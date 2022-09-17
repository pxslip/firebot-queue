/**
 * Class to handle the actual management of the queue
 */

import { ScriptModules } from '@crowbartools/firebot-custom-scripts-types';

interface Queue {
	label: string;
	members: string[]; // Will probably want a more complex type here
}

type FileSystem = Pick<ScriptModules['fs'], 'readJsonSync'>;

export class QueueManager {
	#queues: Record<string, Queue> = {};
	#fs: FileSystem;

	constructor(fs: FileSystem) {
		this.#fs = fs;
	}

	join(queue: string): boolean {
		return false;
	}

	leave(queue: string): boolean {
		return false;
	}

	remove(queue: string): boolean {
		return false;
	}

	pop(queue: string): boolean {
		return false;
	}
}
