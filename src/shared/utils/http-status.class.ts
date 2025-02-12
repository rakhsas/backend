export class HttpStatusWrapper {
	private static HttpStatus: any | null = null;

	public static async getStatus(statusCode: string): Promise<number> {
		if (!HttpStatusWrapper.HttpStatus) {
			const { HttpStatus } = await import('http-status-ts');
			HttpStatusWrapper.HttpStatus = HttpStatus;
		}
		return HttpStatusWrapper.HttpStatus[statusCode];
	}
}
