export type TNewStructure = {
    id: string;
}

export type FormValuesNewStructure = {
    id?: string;
    name: string;
    code: string;
    bricks: TBrick[];
}

export type TBrick = {
    id?: string;
    name: string;
    type: string;
    key: string;
    description: string;
    validations: {
        code: string;
        type: string;
        value: any;
    }[];
    system: boolean;
}
export type TTranslations = {
    enabled: boolean;
}
export type TSections = {
    enabled: boolean;
    bricks: TBrick[];
}
export type TNotifications = {
    new: {
        alert: {
          enabled: boolean;
          message: string;
        }
    }
}
export type TStructure = {
    id: string;
    name: string;
    code: string;
    bricks: TBrick[];
    sections: TSections;
    translations: TTranslations;
    notifications: TNotifications;
}

export type FormValuesEditStructure = {
    id: string;
    name: string;
    code: string;
    bricks: TBrick[];
    api: {
        enabled: boolean
    };
    translations: {
        enabled: boolean
    };
    sections: {
        enabled: boolean
    };
}

export type FormValuesManageBricks = {
    id: string;
    bricks: TBrick[];
};

type TValidationSchemaBrick = {
    code: string;
    name: string;
    value: string;
    desc: string;
    type: string;
    presetChoices: {name: string, value: string}[];
}
export type TSchemaBrick = {
    id: string;
    name: string;
    type: string;
    icon: string;
    groupCode: string;
    list: string;
    validationDescHtml: string;
    validations: TValidationSchemaBrick[];
}

export type TProject = {
    id: string;
    name: string;
    projectNumber: number;
    planFinishedAt: Date;
    trialFinishedAt: Date;
    currencies: {code:string, primary:boolean, name: string}[];
    languages: {code:string, primary:boolean, name: string}[];
}
export type FormValuesEditProject = Pick<TProject, 'name'|'currencies'|'languages'>


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
    alt: string;
    caption: string;
    state: string;
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
    sectionIds: string[];
}

export type TSection = {
    id: string;
    projectId: string;
    structureId: string;
    parentId: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy: string;
    updatedBy: string;
    name: string;
    code: string;
    doc: TDoc;
}

export type TCurrency = {
    name: string;
    code: string;
    enabled:boolean;
    sort: number;
    moneyFormat: string;
    moneyInEmailsFormat: string;
    moneyWithCurrencyFormat: string;
    moneyWithCurrencyInEmailsFormat: string;
    decimalMark: string;
    subunitToUnit: number;
    symbol: string;
    thousandsSeparator: string;
}
export type TCurrencyPreview = Pick<TCurrency, 'name' | 'code' | 'symbol'>&{primary:boolean}
export type TCurrencyOption = {
    value: string;
    label: string;
}

export type TLanguage = {
    name: string;
    code: string;
    enabled:boolean;
    sort: number;
}
export type TLanguagePreview = Pick<TLanguage, 'name' | 'code'>&{primary:boolean}
export type TLanguageOption = {
    value: string;
    label: string;
}

export type TAlert = {
    id: string;
    message: string;
    createdAt: string;
    read: boolean;
    structureId: string;
    subjectId: string;
    subjectType: string;
}

export type TValueTranslation = {[key: string]: any}

export type TTranslation = {
    id: string;
	userId: string; 
    projectId: string;
    structureId: string;
    subjectId: string;
    subject: string;
    key: string;
    value: TValueTranslation;
    lang: string;
    createdAt?: string;
}

export type TMenu = {
    id: string;
    title: string;
    handle: string;
}

export type FormValuesNewMenu = {
    id?: string;
    title: string;
    handle: string;
}