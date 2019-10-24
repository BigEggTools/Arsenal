import { ImageData, ImageMetaData, IMetaData, TextMetaData } from '../../meta-data'

export enum SelectType {
    Multi,
    Single,
    None,
}

export class ThumbnailItem {
    public imageMetaData: ImageMetaData;
    public imageTopTextMetaData: TextMetaData;
    public imageTextMetaData: TextMetaData;
    public metaData: IMetaData[];

    constructor(options: {
        imageMetaData: ImageMetaData,
        imageTopTextMetaData: TextMetaData,
        imageTextMetaData: TextMetaData,
        metaData: IMetaData[]
    }) {
        this.imageMetaData = options.imageMetaData;
        this.imageTopTextMetaData = options.imageTopTextMetaData;
        this.imageTextMetaData = options.imageTextMetaData;
        this.metaData = options.metaData;
    }

    public getImageUrl(rowData: any): ImageData {
        return this.imageMetaData.getValue(rowData) as ImageData;
    }
}
