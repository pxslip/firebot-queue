import { ScriptModules } from '@crowbartools/firebot-custom-scripts-types';
import { Logger } from '@crowbartools/firebot-custom-scripts-types/types/modules/logger';
import { Request, Response } from 'express';
import { QueueManager } from '../queue-manager';
import indexHtml from './templates/index.post.html';

export class ManagementConsole {
	logger: Logger;
	queueManager: QueueManager;
	constructor(queueManager: QueueManager, { httpServer, logger }: ScriptModules) {
		httpServer.registerCustomRoute('queue', 'view', 'GET', this.index);
		this.logger = logger;
		this.queueManager = queueManager;
	}

	index(_: Request, res: Response) {
		res.send(indexHtml);
	}
	queues(_: Request, res: Response) {
		res.json(this.queueManager.listQueues());
	}
}
