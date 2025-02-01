export type TNewContent = {
    id: string;
}

export type FormValuesNewContent = {
    id?: string;
    name: string;
    code: string;
    entries: {
        fields: TField[];
    }
}

export type TFContent = {
    id?: string;
    name: string;
}

export type TField = {
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
    params: {
        code: string;
        type: string;
        value: any;
    }[];
    system: boolean;
    unit?: string;
}
export type TTranslations = {
    enabled: boolean;
}
export type TSections = {
    enabled: boolean;
    fields: TField[];
}
export type TEntries = {
    fields: TField[];
}
export type TNotifications = {
    new: {
        alert: {
          enabled: boolean;
          message: string;
        }
    }
}
export type TContent = {
    id: string;
    name: string;
    code: string;
    entries: TEntries;
    sections: TSections;
    translations: TTranslations;
    notifications: TNotifications;
}

export type FormValuesEditContent = {
    id: string;
    name: string;
    code: string;
    entries: {
        fields: TField[];
    };
    api: {
        enabled: boolean;
    };
    translations: {
        enabled: boolean;
    };
    sections: {
        enabled: boolean;
        fields: TField[];
    };
}

export type FormValuesManageFields = {
    id: string;
    fields: TField[];
};

type TValidationSchemaField = {
    code: string;
    name: string;
    value: string;
    desc: string;
    type: string;
    presetChoices: {name: string, value: string}[];
}
type TParamSchemaField = {
    code: string;
    name: string;
    value: string;
    desc: string;
    type: string;
    presetChoices: {name: string, value: string}[];
}
type TUnitField = {
    code: string;
    name: string;
}
export type TSchemaField = {
    id: string;
    name: string;
    type: string;
    icon: string;
    groupCode: string;
    list: string;
    validationDescHtml: string;
    params: TParamSchemaField[];
    validations: TValidationSchemaField[];
    units: TUnitField[];
}

export type TProject = {
    id: string;
    name: string;
    projectNumber: number;
    planFinishedAt: Date;
    trialFinishedAt: Date;
    currencies: {code:string, primary:boolean, name: string}[];
    languages: {code:string, primary:boolean, name: string}[];
    front: {
        title: string;
        logo: string;
    }
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
    contentId: string;
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
    contentId: string;
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
    contentId: string;
    subjectId: string;
    subjectType: string;
}

export type TValueTranslation = {[key: string]: any}

export type TTranslation = {
    id: string;
	userId: string; 
    projectId: string;
    contentId: string;
    subjectId: string;
    subject: string;
    key: string;
    value: TValueTranslation;
    lang: string;
    createdAt?: string;
}

export type TMenu = {
    id: string;
    name: string;
    code: string;
    items: {
        fields: TField[];
    };
    translations: TTranslations;
}

export type TItem = {
    id: string;
    projectId: string;
    userId: string;
    menuId: string;
    parentId: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
    doc: TDoc;
    subject: string;
    subjectId: string;
    items?: TItem[];
  }

export type TItemForm = {
    title: string;
    url: string;
    type: string;
    subject: string|null;
    subjectId: string|null;
}
export type FormValuesMenu = {
    id?: string;
    name: string;
    code: string;
    items: TItemForm[];
}
export type FormValuesNewMenu = {
    name: string;
    code: string;
    items: {
        fields: TField[];
    };
}

export type TItems = {
    fields: TField[];
}