
class FileDownLoad {
	fileDownUrl = (fileId) => {
		const fileUrl = `http://112.33.11.193:8092/acsmanager/file/down?fileId=`;
		return `${fileUrl}${fileId}`
	}
}

export default new FileDownLoad();
