import { Firebot } from '@crowbartools/firebot-custom-scripts-types';
import { Effects, EffectTriggerResponse } from '@crowbartools/firebot-custom-scripts-types/types/effects';
import { FirebotQueue } from '../../../types';
import optionsTemplate from './eos-templates/base.html';
import { QueueEffect } from './effect';

interface QueueJoinEffectModel {
	queue: string;
	user: string;
}

export class QueueJoinEffect extends QueueEffect implements Firebot.EffectType<QueueJoinEffectModel> {
	get definition() {
		return {
			id: 'pxslip:queue-join',
			name: 'Join Queue',
			description: 'Add a user to a queue, self-add or manually',
			icon: 'fad fa-user-plus',
			categories: ['chat based', 'common'] as Effects.EffectCategory[],
			dependencies: ['chat'] as 'chat'[],
		};
	}

	get optionsTemplate() {
		return optionsTemplate;
	}

	async onTriggerEvent(
		event: FirebotQueue.EffectTriggerEvent<QueueJoinEffectModel>,
	): Promise<boolean | void | EffectTriggerResponse> {
		const { effect } = event;
		let { user, queue } = effect;
		if (!user) {
			user = event.trigger.metadata.username;
		}
		if (!queue) {
			queue = this.defaultQueue;
		}
		const fbUser = await this.queueManager.getFirebotUser(user);
		const success = this.queueManager.getQueue(queue).push(fbUser);
		if (success) {
			this.chat.sendChatMessage(
				`${user}, you were added to the queue at position ${this.queueManager.getQueue(queue).length}`,
			);
		} else {
			this.chat.sendChatMessage(`Huh, there was an error adding you to the queue ${user}. Contact a mod for help`);
		}
		// returning true allows Firebot to continue to the next effect in the queue
		return true;
	}
}
