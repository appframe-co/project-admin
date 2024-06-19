import type { Metadata } from 'next'
import { TCurrency, TCurrencyPreview, TFile, TItem, TMenu, TProject, TContent } from '@/types';
import { Topbar } from '@/components/topbar';
import { getCurrencies } from '@/services/system';
import { getProject } from '@/services/project';
import Link from 'next/link';
import Image from 'next/image';
import { Toolbar } from '@/components/toolbar';
import { getMenu } from '@/services/menus';
import { getMenuItem } from '@/services/menu-items';
import { FormEditMenuItem } from '@/components/forms/form-edit-menu-item';
import { getContents } from '@/services/contents';

export const metadata: Metadata = {
    title: 'Edit item | AppFrame'
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

export default async function EditItem({ params }: {params: {id: string, itemId: string}}) {
    const projectPromise: Promise<TErrorResponse|{project: TProject}> = getProject();
    const menuPromise = getMenu(params.id);
    const itemPromise = getMenuItem(params.itemId, params.id);
    const currenciesPromise: Promise<TErrorResponse|{currencies: TCurrency[]}> = getCurrencies();
    const contentsPromise: Promise<TErrorResponse|{contents: TContent[]}> = getContents();

    const [projectData, menuData, itemData, currenciesData, contentsData] = await Promise.all([projectPromise, menuPromise, itemPromise, currenciesPromise, contentsPromise]);

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

    const {menu}: {menu: TMenu} = menuData;
    const {item, files}: {item: TItem, files: TFile[]} = itemData;

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

    const tools = [];
    if (menu.translations && menu.translations.enabled) {
        tools.push(<>
            <Link href={item.id+'/translations'}>
                <Image width={20} height={20} src='/icons/language.svg' alt='' />
                <span>Translations</span>
            </Link>
        </>);
    }

    const options = contentsData.contents.map(s => ({value:s.id, label:s.name}));

    return (
        <div className='page pageAlignCenter'>
            <Topbar title={'Edit item of ' + menu.name} back={`/menus/${menu.id}/items`} />
            <Toolbar tools={tools} />
            <FormEditMenuItem menu={menu} item={item} files={files} currencies={currencies} options={options}/>
        </div>
    )
}