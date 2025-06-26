import { repository } from '../../repository';

export const saveReport = async (reportData: {
	title: string;
	user_id: string;
	reported_user_id: string;
}) => {
	try {
		// Assuming you have a Report model set up
		const report = await repository.save('reports', reportData);
		return report;
	} catch (error) {
		console.error('Error saving report:', error);
		throw error;
	}
};
