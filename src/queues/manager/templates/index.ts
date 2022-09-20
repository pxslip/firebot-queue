const updateQueueSelector = async () => {
	const selector = document.getElementById('queue_selector') as HTMLSelectElement;
	selector.disabled = true;
	const resp = await fetch('/integrations/fb-queue/queues', {
		method: 'GET',
	});
	if (resp.ok) {
		const data = (await resp.json()) as string[];
		for (const queue of data) {
			const opt = document.createElement('option');
			opt.value = queue;
			opt.text = queue;
			selector.appendChild(opt);
		}
		selector.disabled = false;
	}
};

document.addEventListener('DOMContentLoaded', () => {
	// load the current list of queues
	updateQueueSelector();
	// bind a change listener to the selector to update the list when necessary
	document.getElementById('queue_selector').addEventListener('change', async () => {
		const url = new URL(`/integrations/fb-queue/queue-members`);
		// const resp = fetch();
	});
});
