import { Firebot } from '@crowbartools/firebot-custom-scripts-types';

export interface StartupParams {
	identifier: string;
	action: string;
}

const script: Firebot.CustomScript<StartupParams> = {
	getScriptManifest: () => {
		return {
			name: 'firebot-queue',
			description: 'A customizable queue tool for streamers',
			author: 'pxslip',
			version: '1.0',
			firebotVersion: '5',
		};
	},
	getDefaultParameters: () => {
		return {
			identifier: {
				type: 'string',
				default: 'default',
				description: 'Queue Identifier',
				secondaryDescription: 'To manage multiple queues use a different queue name for each',
			},
			action: {
				type: 'string',
				default: 'fbqAction',
				description:
					"The name of the internal action identifier the script will use, only change this if you know what you're doing!",
			},
		};
	},
	run: (runRequest) => {
		if (runRequest.trigger.type === 'startup_script') {
			//
		} else {
			runRequest.modules.logger.error('firebot-queue: The startup script was called from a non-startup trigger');
		}
	},
};

export default script;
