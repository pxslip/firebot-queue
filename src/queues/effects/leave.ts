import { Firebot } from '@crowbartools/firebot-custom-scripts-types';
import { Effects, EffectTriggerResponse } from '@crowbartools/firebot-custom-scripts-types/types/effects';
import { Logger } from '@crowbartools/firebot-custom-scripts-types/types/modules/logger';
import { FirebotQueue } from '../../../types';
import { StartupParams } from '../../startup';
import { QueueManager } from '../queue-manager';
import optionsTemplate from './eos-templates/base.html';

interface QueueLeaveEffectModel {
	queue: string;
	user: string;
}

export class QueueLeaveEffect implements Firebot.EffectType<QueueLeaveEffectModel> {
	#defaultQueue: string;
	#logger: Logger;
	#queueManager: QueueManager;
	constructor({ defaultQueue }: StartupParams, logger: Logger, queueManager: QueueManager) {
		this.#defaultQueue = defaultQueue;
		this.#logger = logger;
		this.#queueManager = queueManager;
	}

	get definition() {
		return {
			id: 'pxslip:queue-leave',
			name: 'Leave Queue',
			description: 'Removes a user from a queue',
			icon: 'fad fad-user-minus',
			categories: ['chat based', 'common'] as Effects.EffectCategory[],
			dependencies: ['chat'] as 'chat'[],
		};
	}

	get optionsTemplate() {
		return optionsTemplate;
	}

	async onTriggerEvent(
		event: FirebotQueue.EffectTriggerEvent<QueueLeaveEffectModel>,
	): Promise<boolean | void | EffectTriggerResponse> {
		const { effect } = event;
		let { user, queue } = effect;
		if (!user) {
			user = event.trigger.metadata.username;
		}
		if (!queue) {
			queue = this.#defaultQueue;
		}
		const fbUser = await this.#queueManager.getFirebotUser(user);
		this.#queueManager.getQueue(queue).remove(fbUser);
		// returning true allows Firebot to continue to the next effect in the queue
		return true;
	}
}
