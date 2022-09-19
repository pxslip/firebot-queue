import { Firebot } from '@crowbartools/firebot-custom-scripts-types';
import { QueueJoinEffect } from './queues/effects/join';
import { QueueManager } from './queues/queue-manager';

export interface StartupParams {
	defaultQueue: string;
}

let queueManager;

const script: Firebot.CustomScript<StartupParams> = {
	getScriptManifest: () => {
		return {
			name: 'firebot-queue-startup',
			description: 'A customizable queue tool for streamers, startup script',
			author: 'pxslip',
			version: '1.0',
			firebotVersion: '5',
			startupOnly: true,
		};
	},
	getDefaultParameters: () => {
		return {
			defaultQueue: {
				type: 'string',
				default: 'default',
				description: 'Default queue name',
				secondaryDescription:
					'The default queue that will be used by all queue operations, this can be overridden in effects',
			},
		};
	},
	run: (runRequest) => {
		if (runRequest.trigger.type === undefined) {
			// interestingly startup scripts receive null as the trigger, not startup_script
			// spin up the queue manager
			queueManager = new QueueManager(runRequest.modules.fs, runRequest.modules.userDb);
			// register effects
			runRequest.modules.effectManager.registerEffect(
				new QueueJoinEffect(runRequest.parameters, runRequest.modules.logger, queueManager),
			);
		} else {
			runRequest.modules.logger.error(
				`firebot-queue: The startup script was called from a non-startup trigger (${JSON.stringify(
					runRequest.trigger,
				)})`,
			);
		}
	},
};

export default script;
