export interface baseUploadType {
	uploadConfig?: {
		'list-type': 'picture-card' | 'picture' | 'text'
	}
	fileRule?: {
		maxSize: number
	}
	fileType?: 'image'
	layout: {
		imgContainer: {
			width: string
			height: string
			lineHeight: string
		}
	}
}

export interface cropUploadType {
	baseUploadConfig: baseUploadType
	cropperUploadConfig: {
		fixedNumber: Array<number>
	}
	layout?: {
		cropperLayout: {
			width: string
			height: string
		}
	}
}
