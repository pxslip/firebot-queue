import { ScriptModules } from '@crowbartools/firebot-custom-scripts-types';
import { Logger } from '@crowbartools/firebot-custom-scripts-types/types/modules/logger';
import { TwitchChat } from '@crowbartools/firebot-custom-scripts-types/types/modules/twitch-chat';
import { StartupParams } from '../../startup';
import { QueueManager } from '../queue-manager';

export class QueueEffect {
	protected defaultQueue: string;
	protected logger: Logger;
	protected queueManager: QueueManager;
	protected chat: TwitchChat;
	constructor({ defaultQueue }: StartupParams, queueManager: QueueManager, { logger, twitchChat }: ScriptModules) {
		this.defaultQueue = defaultQueue;
		this.logger = logger;
		this.queueManager = queueManager;
		this.chat = twitchChat;
	}
}
