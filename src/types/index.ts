export type TNewStructure = {
    id: string;
}

export type FormValuesNewStructure = {
    name: string;
    code: string
}

export type TBrick = {
    name: string;
    type: string;
    code: string;
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
    code: string
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
export type TSchemaBricks = {
    id: string;
    name: string;
    type: string;
    icon: string;
    validation: TValidationSchemaBrick[];
}

export type TProject = {
    id: string;
    name: string;
    projectNumber: number
}