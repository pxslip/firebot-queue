import { Firebot } from '@crowbartools/firebot-custom-scripts-types';

interface Params {
	identifier: string;
	action: string;
}

const script: Firebot.CustomScript<Params> = {
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
		const { customVariableManager: cvMgr, logger } = runRequest.modules;
		const action = cvMgr.getCustomVariable(runRequest.parameters.action);
		switch (action) {
			case 'join':
				break;
			default:
				logger.error('firebot-queue: Queue action did not match any known actions');
		}
	},
};

export default script;
