import { Firebot } from '@crowbartools/firebot-custom-scripts-types';
import { Effects, EffectTriggerResponse } from '@crowbartools/firebot-custom-scripts-types/types/effects';
import { Logger } from '@crowbartools/firebot-custom-scripts-types/types/modules/logger';
import { TwitchChat } from '@crowbartools/firebot-custom-scripts-types/types/modules/twitch-chat';
import { FirebotQueue } from '../../../types';
import { StartupParams } from '../../startup';
import { QueueManager } from '../queue-manager';
import baseOptionsTemplate from './eos-templates/base.html';
import peekOptionsTemplate from './eos-templates/peek.html';

interface QueuePeekEffectModel {
	queue: string;
	user: string;
	groupSize: number;
	groupTime: number;
}

export class QueuePeekEffect implements Firebot.EffectType<QueuePeekEffectModel> {
	#defaultQueue: string;
	#logger: Logger;
	#queueManager: QueueManager;
	#chat: TwitchChat;
	constructor({ defaultQueue }: StartupParams, logger: Logger, queueManager: QueueManager, twitchChat: TwitchChat) {
		this.#defaultQueue = defaultQueue;
		this.#logger = logger;
		this.#queueManager = queueManager;
		this.#chat = twitchChat;
	}

	get definition() {
		return {
			id: 'pxslip:queue-peek',
			name: 'Peek Queue',
			description: 'Qet user position in queue, with optional time estimate',
			icon: 'fad fad-user-plus',
			categories: ['chat based', 'common'] as Effects.EffectCategory[],
			dependencies: ['chat'] as 'chat'[],
		};
	}

	get optionsTemplate() {
		return baseOptionsTemplate + peekOptionsTemplate;
	}

	async onTriggerEvent(
		event: FirebotQueue.EffectTriggerEvent<QueuePeekEffectModel>,
	): Promise<boolean | void | EffectTriggerResponse> {
		const { effect } = event;
		let { user, queue, groupSize, groupTime } = effect;
		if (!user) {
			user = event.trigger.metadata.username;
		}
		if (!queue) {
			queue = this.#defaultQueue;
		}
		const position = this.#queueManager.getQueue(queue).position(await this.#queueManager.getFirebotUser(user));
		const message = [];
		message.push(`${user} is at position ${position + 1} in the queue.`);
		if (groupSize) {
			const preceding = Math.floor(position / groupSize);
			message.push(`There are ${preceding} groups in front of you.`);
			if (groupTime) {
				message.push(`Your wait time is approximately ${preceding * groupTime}`);
			}
		}
		this.#chat.sendChatMessage(message.join(' '));
		// returning true allows Firebot to continue to the next effect in the queue
		return true;
	}
}
