import type { Metadata } from 'next'
import { TCurrency, TCurrencyPreview, TMenu, TProject, TContent } from '@/types';
import { Topbar } from '@/components/topbar';
import { getCurrencies } from '@/services/system';
import { getProject } from '@/services/project';
import { getMenu } from '@/services/menus';
import { FormNewMenuItem } from '@/components/forms/form-new-menu-item';
import { getContents } from '@/services/contents';

export const metadata: Metadata = {
    title: 'New Item | AppFrame'
}

function isErrorProject(data: TErrorResponse|{project: TProject}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
function isErrorMenu(data: TErrorResponse|{menu: TMenu}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
function isErrorCurrencies(data: TErrorResponse|{currencies: TCurrency[]}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
function isErrorContents(data: TErrorResponse|{contents: TContent[]}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}

type TPageProps = { 
    params: { id: string };
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function NewItem({ params, searchParams }: TPageProps) {
    const parentId = searchParams.parent_id ? searchParams.parent_id.toString() : undefined;

    const projectPromise: Promise<TErrorResponse|{project: TProject}> = getProject();
    const menuPromise: Promise<TErrorResponse|{menu: TMenu}> = getMenu(params.id);
    const currenciesPromise: Promise<TErrorResponse|{currencies: TCurrency[]}> = getCurrencies();
    const contentsPromise: Promise<TErrorResponse|{contents: TContent[]}> = getContents();

    const [projectData, menuData, currenciesData, contentsData] = await Promise.all([projectPromise, menuPromise, currenciesPromise, contentsPromise]);

    if (isErrorProject(projectData)) {
        return <></>;
    }
    if (isErrorMenu(menuData)) {
        return <></>;
    }
    if (isErrorCurrencies(currenciesData)) {
        return <></>;
    }
    if (isErrorContents(contentsData)) {
        return <></>;
    }

    const currencies:TCurrencyPreview[] = [];
    for (const currency of currenciesData.currencies) {
        const currencyProject = projectData.project.currencies.find(c => c.code === currency.code);
        if (!currencyProject) {
            continue;
        }

        currencies.push({
            symbol: currency.symbol, 
            code: currency.code, 
            name: currency.name,
            primary: currencyProject.primary
        });
    }

    const options = contentsData.contents.map(s => ({value:s.id, label:s.name}));
    
    return (
        <div className='page pageAlignCenter'>
            <Topbar title='New Item' back={`/menus/${menuData.menu.id}/items`} />
            <FormNewMenuItem menu={menuData.menu} currencies={currencies} parentId={parentId} options={options}/>
        </div>
    )
}