import { Firebot } from '@crowbartools/firebot-custom-scripts-types';
import { Effects, EffectTriggerResponse } from '@crowbartools/firebot-custom-scripts-types/types/effects';
import { FirebotQueue } from '../../../types';
import { QueueEffect } from './effect';
import optionsTemplate from './eos-templates/base.html';

interface QueueLeaveEffectModel {
	queue: string;
	user: string;
}

export class QueueLeaveEffect extends QueueEffect implements Firebot.EffectType<QueueLeaveEffectModel> {
	get definition() {
		return {
			id: 'pxslip:queue-leave',
			name: 'Leave Queue',
			description: 'Removes a user from a queue',
			icon: 'fad fa-user-minus',
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
			queue = this.defaultQueue;
		}
		const fbUser = await this.queueManager.getFirebotUser(user);
		const success = this.queueManager.getQueue(queue).remove(fbUser);
		if (success) {
			this.chat.sendChatMessage(`${user} was removed from the queue`);
		}
		// returning true allows Firebot to continue to the next effect in the queue
		return true;
	}
}
