import type { Metadata } from 'next'
import { TFile, TItem, TMenu, TProject } from '@/types';
import { Topbar } from '@/components/topbar';
import { getProject } from '@/services/project';
import { getMenuItem } from '@/services/menu-items';
import { getMenu } from '@/services/menus';
import { FormEditTranslationsMenuItem } from '@/components/forms/form-edit-translations-menu-item';

export const metadata: Metadata = {
    title: 'Edit translations | AppFrame'
}

function isErrorProject(data: TErrorResponse|{project: TProject}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
function isErrorMenu(data: TErrorResponse|{menu: TMenu}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}
function isErrorItem(data: TErrorResponse|{item: TItem}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}

export default async function EditTranslations({ params }: {params: {id: string, itemId: string}}) {
    const projectPromise: Promise<TErrorResponse|{project: TProject}> = getProject();
    const menuPromise: Promise<TErrorResponse|{menu: TMenu}>  = getMenu(params.id);
    const itemPromise: Promise<TErrorResponse|{item: TItem, files: TFile[]}> = getMenuItem(params.itemId, params.id);

    const [projectData, menuData, itemData] = await Promise.all([projectPromise, menuPromise, itemPromise]);
    if (isErrorProject(projectData)) {
        return <></>;
    }
    if (isErrorMenu(menuData)) {
        return <></>;
    }
    if (isErrorItem(itemData)) {
        return <></>;
    }

    const {menu} = menuData;
    const {item, files} = itemData;

    const languages = projectData.project.languages.map(c => ({value: c.code, label: c.name}));

    const types = ['single_line_text', 'list.single_line_text', 'multi_line_text', 'rich_text'];
    const keys = menu.items.fields.filter(b => types.includes(b.type)).map(b => ({key: b.key, name: b.name, type: b.type}));

    const typesFiles = ['file_reference', 'list.file_reference'];
    const keysFiles = menu.items.fields.filter(b => typesFiles.includes(b.type)).map(b => ({key: b.key, name: b.name, type: b.type}));

    return (
        <div className='page'>
            <Topbar title={'Edit translations'} back={`/menus/${menu.id}/items/${item.id}`} />
            <FormEditTranslationsMenuItem menu={menu} item={item} languages={languages} 
                fields={keys} fieldsFiles={keysFiles} files={files} />
        </div>
    )
}