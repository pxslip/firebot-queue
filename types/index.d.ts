import { ScriptModules } from '@crowbartools/firebot-custom-scripts-types';
import { Effects } from '@crowbartools/firebot-custom-scripts-types/types/effects';

export namespace FirebotQueue {
	type FileSystem = Pick<ScriptModules['fs'], 'readJsonSync'>;

	type EffectTriggerEvent<EffectModel, OverlayData = unknown> = {
		effect: EffectModel;
		trigger: Effects.Trigger;
		sendDataToOverlay: (data: OverlayData, overlayInstance?: string) => void;
	};
}
