export type TNewStructure = {
    id: string;
}

export type FormValuesNewStructure = {
    name: string;
    code: string;
    bricks: TBrick[]
}

export type TBrick = {
    name: string;
    type: string;
    key: string;
    description: string;
    validation: {
        code: string;
        value: any;
    }[];
}
export type TStructure = {
    id: string;
    name: string;
    code: string;
    bricks: TBrick[];
}

export type FormValuesEditStructure = {
    id: string;
    name: string;
    code: string;
    bricks: TBrick[];
}

export type FormValuesManageBricks = {
    id: string;
    bricks: TBrick[];
};

type TValidationSchemaBrick = {
    code: string;
    name: string;
    value: string;
}
export type TSchemaBrick = {
    id: string;
    name: string;
    type: string;
    icon: string;
    groupCode: string;
    validation: TValidationSchemaBrick[];
}

export type TProject = {
    id: string;
    name: string;
    projectNumber: number;
}

export type TStagedTarget = {
    parameters: {name: string, value: string}[];
    resourceUrl: string;
    url: string;
}

export type TImage = {
    mediaContentType: string;
    originalSource: string;
}

export type TErrorValidateFile = {
    file: File;
    msg: string;
}

export type ImageField = {
    [key: string]: TImage[]
}

export type TFile = {
    id: string;
    subjectField: string;
    filename: string;
    uuidName: string;
    width: number;
    height: number;
    size: number;
    mimeType: string;
    mediaContentType: string;
    src: string;
}

export enum Resource {
    IMAGE = 'image',
    VIDEO = 'video',
    FILE = 'file'
}
export type TStagedUploadFile = {
    filename: string;
    mimeType: string;
    resource: Resource;
    fileSize: number;
    httpMethod: string;
}

type TDoc = {[key: string]: any}

export type TEntry = {
    id: string;
    projectId: string;
    structureId: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy: string;
    updatedBy: string;
    doc: TDoc;
}