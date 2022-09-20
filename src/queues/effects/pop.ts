import { Firebot } from '@crowbartools/firebot-custom-scripts-types';
import { Effects, EffectTriggerResponse } from '@crowbartools/firebot-custom-scripts-types/types/effects';
import { FirebotQueue } from '../../../types';
import { QueueEffect } from './effect';
import optionsTemplate from './eos-templates/base.html';

interface QueuePopEffectModel {
	queue: string;
	groupSize: number;
	msgTemplate: string;
}

export class QueuePopEffect extends QueueEffect implements Firebot.EffectType<QueuePopEffectModel> {
	get definition() {
		return {
			id: 'pxslip:queue-pop',
			name: 'Pop from Queue',
			description: 'Pop the next group from the queue, the group size must be set',
			icon: 'fas fa-users',
			categories: ['chat based', 'common'] as Effects.EffectCategory[],
			dependencies: ['chat'] as 'chat'[],
		};
	}

	get optionsTemplate() {
		return optionsTemplate;
	}

	async onTriggerEvent(
		event: FirebotQueue.EffectTriggerEvent<QueuePopEffectModel>,
	): Promise<boolean | void | EffectTriggerResponse> {
		const { effect } = event;
		let { groupSize, queue, msgTemplate } = effect;
		if (!queue) {
			queue = this.defaultQueue;
		}
		const group = this.queueManager.getQueue(queue).pop(groupSize);
		if (group) {
			const grpString = group.map((val) => val.username).join(', ');
			if (!msgTemplate) {
				msgTemplate = "$group you're up! Please message in-game to be added to the party.";
			}
			this.chat.sendChatMessage(msgTemplate.replace('$group', grpString));
		}
		// returning true allows Firebot to continue to the next effect in the queue
		return true;
	}
}
