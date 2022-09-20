import { Firebot } from '@crowbartools/firebot-custom-scripts-types';
import { QueueJoinEffect } from './queues/effects/join';
import { QueueLeaveEffect } from './queues/effects/leave';
import { QueuePeekEffect } from './queues/effects/peek';
import { QueuePopEffect } from './queues/effects/pop';
import { ManagementConsole } from './queues/manager';
import { QueueManager } from './queues/queue-manager';

export interface StartupParams {
	defaultQueue: string;
}

let queueManager;
// TODO: convert this to an ES6 class
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
		const { effectManager, logger, fs, userDb, httpServer } = runRequest.modules;
		if (runRequest.trigger.type === undefined) {
			// interestingly startup scripts receive null as the trigger, not startup_script
			// spin up the queue manager
			queueManager = new QueueManager(fs, userDb);
			// register effects
			effectManager.registerEffect(new QueueJoinEffect(runRequest.parameters, queueManager, runRequest.modules));
			effectManager.registerEffect(new QueueLeaveEffect(runRequest.parameters, queueManager, runRequest.modules));
			effectManager.registerEffect(new QueuePeekEffect(runRequest.parameters, queueManager, runRequest.modules));
			effectManager.registerEffect(new QueuePopEffect(runRequest.parameters, queueManager, runRequest.modules));
			// add a web endpoint for managing the queue
			new ManagementConsole(queueManager, runRequest.modules);
		} else {
			logger.error(
				`firebot-queue: The startup script was called from a non-startup trigger (${JSON.stringify(
					runRequest.trigger,
				)})`,
			);
		}
	},
};

export default script;
